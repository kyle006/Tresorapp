package ch.bbw.pr.tresorbackend.controller;

import ch.bbw.pr.tresorbackend.model.NewSecret;
import ch.bbw.pr.tresorbackend.model.Secret;
import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.service.SecretService;
import ch.bbw.pr.tresorbackend.service.UserService;
import ch.bbw.pr.tresorbackend.util.EncryptUtil;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SecretController
 * @author Peter Rutschmann
 */
@RestController
@AllArgsConstructor
@RequestMapping("api/secrets")
public class SecretController {

    private SecretService secretService;
    private UserService userService;

    // create secret REST API
    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @PostMapping
    public ResponseEntity<String> createSecret(@Valid @RequestBody NewSecret newSecret, BindingResult bindingResult, Authentication authentication) {
        //input validation
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                    .collect(Collectors.toList());
            System.out.println("SecretController.createSecret " + errors);

            JsonArray arr = new JsonArray();
            errors.forEach(arr::add);
            JsonObject obj = new JsonObject();
            obj.add("message", arr);
            String json = new Gson().toJson(obj);

            System.out.println("SecretController.createSecret, validation fails: " + json);
            return ResponseEntity.badRequest().body(json);
        }
        System.out.println("SecretController.createSecret, input validation passed");

        String userEmail = authentication.getName();
        User user = userService.findByEmail(userEmail);

        String salt = EncryptUtil.generateSalt(16);
        byte[] iv = EncryptUtil.generateIv().getIV();

        Secret secret = new Secret(
                null,
                user.getId(),
                new EncryptUtil(newSecret.getEncryptPassword(), salt, iv).encrypt(newSecret.getContent().toString()),
                salt,
                iv
        );
        secretService.createSecret(secret);
        System.out.println("SecretController.createSecret, secret saved in db");
        JsonObject obj = new JsonObject();
        obj.addProperty("answer", "Secret saved");
        String json = new Gson().toJson(obj);
        System.out.println("SecretController.createSecret " + json);
        return ResponseEntity.accepted().body(json);
    }

    // Build Get All Secrets for the authenticated user REST API
    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @GetMapping
    public ResponseEntity<List<Secret>> getSecrets(Authentication authentication, @RequestParam String password) {
        String email = authentication.getName();
        User user = userService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Secret> secrets = secretService.getSecretsByUserId(user.getId());

        // Decrypt content for each secret
        for (Secret secret : secrets) {
            try {
                String decryptedContent = new EncryptUtil(password, secret.getSalt(), secret.getIv()).decrypt(secret.getContent());
                secret.setContent(decryptedContent);
            } catch (EncryptionOperationNotPossibleException e) {
                secret.setContent("DECRYPTION_FAILED");
            }
        }
        return ResponseEntity.ok(secrets);
    }

    // Build Update Secret REST API
    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @PutMapping("{id}")
    public ResponseEntity<String> updateSecret(
            @PathVariable("id") Long secretId,
            @Valid @RequestBody NewSecret newSecret,
            BindingResult bindingResult,
            Authentication authentication) {

        if (bindingResult.hasErrors()) {
            // Handle validation errors...
            return ResponseEntity.badRequest().body("Validation failed");
        }

        String userEmail = authentication.getName();
        User user = userService.findByEmail(userEmail);
        Secret dbSecret = secretService.getSecretById(secretId);

        if (dbSecret == null || !dbSecret.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        try {
            new EncryptUtil(newSecret.getEncryptPassword(), dbSecret.getSalt(), dbSecret.getIv()).decrypt(dbSecret.getContent());
        } catch (EncryptionOperationNotPossibleException e) {
            return ResponseEntity.badRequest().body("Password not correct.");
        }

        String salt = EncryptUtil.generateSalt(16);
        byte[] iv = EncryptUtil.generateIv().getIV();
        dbSecret.setSalt(salt);
        dbSecret.setIv(iv);
        dbSecret.setContent(new EncryptUtil(newSecret.getEncryptPassword(), salt, iv).encrypt(newSecret.getContent().toString()));
        secretService.updateSecret(dbSecret);

        return ResponseEntity.ok("Secret updated");
    }

    // Build Delete Secret REST API
    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteSecret(@PathVariable("id") Long secretId, Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userService.findByEmail(userEmail);
        Secret secret = secretService.getSecretById(secretId);

        if (secret == null || !secret.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        secretService.deleteSecret(secretId);
        return ResponseEntity.ok("Secret deleted");
    }
}