package ch.bbw.pr.tresorbackend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * PasswordEncryptionService
 * @author Kyle Meier
 */
@Service
public class PasswordEncryptionService {
   private final String pepper = "staticPepperValue";

   public String hashPassword(String password) {
      // BCrypt automatically handles salting
      String saltedPassword = password + pepper;
      return new BCryptPasswordEncoder().encode(saltedPassword);
   }

   public boolean checkPassword(String rawPassword, String encodedPassword) {
      String saltedPassword = rawPassword + pepper;
      return new BCryptPasswordEncoder().matches(saltedPassword, encodedPassword);
   }
}
