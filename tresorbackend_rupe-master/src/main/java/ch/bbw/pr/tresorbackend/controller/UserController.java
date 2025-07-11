package ch.bbw.pr.tresorbackend.controller;

import ch.bbw.pr.tresorbackend.model.ConfigProperties;
import ch.bbw.pr.tresorbackend.model.EmailAdress;
import ch.bbw.pr.tresorbackend.model.RegisterUser;
import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.service.PasswordEncryptionService;
import ch.bbw.pr.tresorbackend.service.ReCaptchaService;
import ch.bbw.pr.tresorbackend.service.UserService;
import ch.bbw.pr.tresorbackend.util.EncryptUtil;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * UserController
 * @author Peter Rutschmann
 */
@RestController
@AllArgsConstructor
@RequestMapping("api/users")
public class UserController {

   private UserService userService;
   private PasswordEncryptionService passwordService;
   private final ConfigProperties configProperties;
   private static final Logger logger = LoggerFactory.getLogger(UserController.class);
   private ReCaptchaService reCaptchaService;

   @Autowired
   public UserController(ConfigProperties configProperties, UserService userService,
                         PasswordEncryptionService passwordService, ReCaptchaService reCaptchaService) {
      this.configProperties = configProperties;
      logger.info("UserController initialized");
      logger.debug("Cross Origin Config: {}", configProperties.getOrigin());
      this.userService = userService;
      this.passwordService = passwordService;
      this.reCaptchaService = reCaptchaService;
   }

   // build create User REST API
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PostMapping
   public ResponseEntity<String> createUser(@Valid @RequestBody RegisterUser registerUser, BindingResult bindingResult) {
      logger.debug("Attempting to create user: {}", registerUser);
      //captcha
      //todo ergänzen(Sollte komplett sein)
      /*
      if (!reCaptchaService.verifyCaptcha(registerUser.getRecaptchaToken())) {
         System.out.println("UserController.createUser: captcha validation failed.");
         JsonObject obj = new JsonObject();
         obj.addProperty("message", "ReCaptcha validation failed.");
         String json = new Gson().toJson(obj);
         return ResponseEntity.badRequest().body(json);
      }

      System.out.println("UserController.createUser: captcha passed.");
      */

      //input validation
      if (bindingResult.hasErrors()) {
         List<String> errors = bindingResult.getFieldErrors().stream()
               .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
               .collect(Collectors.toList());
         logger.warn("User creation validation failed for {}: {}", registerUser.getEmail(), errors);

         JsonArray arr = new JsonArray();
         errors.forEach(arr::add);
         JsonObject obj = new JsonObject();
         obj.add("message", arr);
         String json = new Gson().toJson(obj);

         return ResponseEntity.badRequest().body(json);
      }
      logger.debug("Input validation passed for user {}", registerUser.getEmail());

      //password validation
      //todo ergänzen(Sollte komplett sein)
      List<String> passwordErrors = userService.validatePassword(registerUser.getPassword());
      if (!passwordErrors.isEmpty()) {
         logger.warn("Password validation failed for user {}: {}", registerUser.getEmail(), passwordErrors);
         JsonArray arr = new JsonArray();
         passwordErrors.forEach(arr::add);
         JsonObject obj = new JsonObject();
         obj.add("message", arr);
         String json = new Gson().toJson(obj);
         return ResponseEntity.badRequest().body(json);
      }
      logger.debug("Password validation passed for user {}", registerUser.getEmail());

      // Check if user already exists
      if (userService.findByEmail(registerUser.getEmail()) != null) {
         logger.warn("User creation failed. Email already exists: {}", registerUser.getEmail());
         JsonObject obj = new JsonObject();
         obj.addProperty("message", "A user with this email already exists.");
         String json = new Gson().toJson(obj);
         return ResponseEntity.status(HttpStatus.CONFLICT).body(json); // 409 Conflict
      }

      // First user registered becomes an ADMIN
      String role = "USER";
      if (userService.countUsers() == 0) {
          role = "ADMIN";
         logger.info("No users found. Promoting {} to ADMIN.", registerUser.getEmail());
      }

      // Generate Salt
      String salt = EncryptUtil.generateSalt(16);

      //transform registerUser to user
      User user = new User(
              null,
              registerUser.getFirstName(),
              registerUser.getLastName(),
              registerUser.getEmail(),
              passwordService.hashPassword(registerUser.getPassword()),
              salt,
              role
      );

      User savedUser = userService.createUser(user);
      logger.info("User created successfully: {}", savedUser.getEmail());
      JsonObject obj = new JsonObject();
      obj.addProperty("answer", "User Saved");
      String json = new Gson().toJson(obj);
      return ResponseEntity.accepted().body(json);
   }

   // build get user by id REST API
   // http://localhost:8080/api/users/1
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @GetMapping("{id}")
   @PreAuthorize("hasRole('ADMIN') or @userSecurity.hasUserId(authentication, #userId)")
   public ResponseEntity<User> getUserById(@PathVariable("id") Long userId) {
      logger.debug("Request to get user by id: {}", userId);
      User user = userService.getUserById(userId);
      if (user != null) {
         return new ResponseEntity<>(user, HttpStatus.OK);
      } else {
         logger.debug("User not found with id: {}", userId);
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }

   // Build Get All Users REST API
   // http://localhost:8080/api/users
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @GetMapping
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<List<User>> getAllUsers() {
      logger.debug("Request to get all users");
      List<User> users = userService.getAllUsers();
      return new ResponseEntity<>(users, HttpStatus.OK);
   }

   // Build Update User REST API
   // http://localhost:8080/api/users/1
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PutMapping("{id}")
   @PreAuthorize("hasRole('ADMIN') or @userSecurity.hasUserId(authentication, #userId)")
   public ResponseEntity<User> updateUser(@PathVariable("id") Long userId,
                                          @RequestBody User user) {
      logger.debug("Request to update user with id: {}", userId);
      User updatedUser = userService.updateUser(user);
      if (updatedUser != null) {
         logger.info("User with id {} updated successfully.", userId);
         return new ResponseEntity<>(updatedUser, HttpStatus.OK);
      } else {
         logger.warn("Failed to update. User not found with id: {}", userId);
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }

   // Build Delete User REST API
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @DeleteMapping("{id}")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<String> deleteUser(@PathVariable("id") Long userId) {
      logger.debug("Request to delete user with id: {}", userId);
      userService.deleteUser(userId);
      logger.info("User with id {} deleted successfully.", userId);
      return new ResponseEntity<>("User successfully deleted!", HttpStatus.OK);
   }


   // get user id by email
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PostMapping("/byemail")
   public ResponseEntity<String> getUserIdByEmail(@RequestBody EmailAdress email, BindingResult bindingResult) {
      logger.debug("Request to get user id by email: {}", email.getEmail());
      //input validation
      if (bindingResult.hasErrors()) {
         List<String> errors = bindingResult.getFieldErrors().stream()
                 .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                 .collect(Collectors.toList());
         logger.warn("Validation failed for getUserIdByEmail: {}", errors);

         JsonArray arr = new JsonArray();
         errors.forEach(arr::add);
         JsonObject obj = new JsonObject();
         obj.add("message", arr);
         String json = new Gson().toJson(obj);

         return ResponseEntity.badRequest().body(json);
      }

      logger.debug("Input validation passed for email {}", email.getEmail());

      User user = userService.findByEmail(email.getEmail());
      if (user == null) {
         logger.debug("No user found with email: {}", email.getEmail());
         JsonObject obj = new JsonObject();
         obj.addProperty("message", "No user found with this email");
         String json = new Gson().toJson(obj);

         return ResponseEntity.badRequest().body(json);
      }
      logger.debug("User found for email {}", email.getEmail());
      JsonObject obj = new JsonObject();
      obj.addProperty("answer", user.getId());
      String json = new Gson().toJson(obj);
      return ResponseEntity.accepted().body(json);
   }

}
