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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(SecretController.class);

    private SecretService secretService;
    private UserService userService;

    // create secret REST API
    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @PostMapping
    public ResponseEntity<String> createSecret(@Valid @RequestBody NewSecret newSecret, BindingResult bindingResult, Authentication authentication) {
        logger.debug("Attempting to create a new secret for user {}", authentication.getName());
        //input validation
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                    .collect(Collectors.toList());
            logger.warn("Validation failed for creating secret for user {}: {}", authentication.getName(), errors);

            JsonArray arr = new JsonArray();
            errors.forEach(arr::add);
            JsonObject obj = new JsonObject();
            obj.add("message", arr);
            String json = new Gson().toJson(obj);

            return ResponseEntity.badRequest().body(json);
        }
        logger.debug("Input validation passed for user {}", authentication.getName());

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
        logger.info("Secret created successfully for user {}", authentication.getName());
        JsonObject obj = new JsonObject();
        obj.addProperty("answer", "Secret saved");
        String json = new Gson().toJson(obj);
        return ResponseEntity.accepted().body(json);
    }

    // Build Get All Secrets for the authenticated user REST API
    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @GetMapping
    public ResponseEntity<List<Secret>> getSecrets(Authentication authentication, @RequestParam String password) {
        String email = authentication.getName();
        logger.debug("Request to get secrets for user {}", email);
        User user = userService.findByEmail(email);

        if (user == null) {
            logger.warn("Attempt to get secrets for non-existent user {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Secret> secrets = secretService.getSecretsByUserId(user.getId());
        logger.debug("Found {} secrets for user {}", secrets.size(), email);

        // Decrypt content for each secret
        for (Secret secret : secrets) {
            try {
                String decryptedContent = new EncryptUtil(password, secret.getSalt(), secret.getIv()).decrypt(secret.getContent());
                secret.setContent(decryptedContent);
            } catch (EncryptionOperationNotPossibleException e) {
                logger.warn("Decryption failed for secret id {} for user {}", secret.getId(), email);
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
        logger.debug("Attempting to update secret id {} for user {}", secretId, authentication.getName());
        if (bindingResult.hasErrors()) {
            // Handle validation errors...
            logger.warn("Validation failed for updating secret id {} for user {}: {}", secretId, authentication.getName(), bindingResult.getAllErrors());
            return ResponseEntity.badRequest().body("Validation failed");
        }

        String userEmail = authentication.getName();
        User user = userService.findByEmail(userEmail);
        Secret dbSecret = secretService.getSecretById(secretId);

        if (dbSecret == null || !dbSecret.getUserId().equals(user.getId())) {
            logger.warn("Access denied for user {} to update secret id {}", userEmail, secretId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        try {
            new EncryptUtil(newSecret.getEncryptPassword(), dbSecret.getSalt(), dbSecret.getIv()).decrypt(dbSecret.getContent());
        } catch (EncryptionOperationNotPossibleException e) {
            logger.warn("Incorrect password provided for secret id {} by user {}", secretId, userEmail);
            return ResponseEntity.badRequest().body("Password not correct.");
        }

        String salt = EncryptUtil.generateSalt(16);
        byte[] iv = EncryptUtil.generateIv().getIV();
        dbSecret.setSalt(salt);
        dbSecret.setIv(iv);
        dbSecret.setContent(new EncryptUtil(newSecret.getEncryptPassword(), salt, iv).encrypt(newSecret.getContent().toString()));
        secretService.updateSecret(dbSecret);

        logger.info("Secret id {} updated successfully by user {}", secretId, userEmail);
        return ResponseEntity.ok("Secret updated");
    }

    // Build Delete Secret REST API
    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteSecret(@PathVariable("id") Long secretId, Authentication authentication) {
        logger.debug("Attempting to delete secret id {} for user {}", secretId, authentication.getName());
        String userEmail = authentication.getName();
        User user = userService.findByEmail(userEmail);
        Secret secret = secretService.getSecretById(secretId);

        if (secret == null || !secret.getUserId().equals(user.getId())) {
            logger.warn("Access denied for user {} to delete secret id {}", userEmail, secretId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        secretService.deleteSecret(secretId);
        logger.info("Secret id {} deleted successfully by user {}", secretId, userEmail);
        return ResponseEntity.ok("Secret deleted");
    }
}