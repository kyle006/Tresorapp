package ch.bbw.pr.tresorbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * PasswordEncryptionService
 * @author Kyle Meier
 */
@Service
@RequiredArgsConstructor
public class PasswordEncryptionService {
   private final PasswordEncoder passwordEncoder;

   public String hashPassword(String password) {
      // BCrypt is handled by the PasswordEncoder bean
      return passwordEncoder.encode(password);
   }

   public boolean checkPassword(String rawPassword, String encodedPassword) {
      return passwordEncoder.matches(rawPassword, encodedPassword);
   }
}
