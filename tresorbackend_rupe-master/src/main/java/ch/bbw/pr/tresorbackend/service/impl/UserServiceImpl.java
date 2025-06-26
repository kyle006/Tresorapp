package ch.bbw.pr.tresorbackend.service.impl;

import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.repository.UserRepository;
import ch.bbw.pr.tresorbackend.service.UserService;

import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.ArrayList;
import java.util.regex.Pattern;

/**
 * UserServiceImpl
 * @author Peter Rutschmann
 */
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

   private UserRepository userRepository;

   @Override
   public User createUser(User user) {
      return userRepository.save(user);
   }

   @Override
   public User getUserById(Long userId) {
      Optional<User> optionalUser = userRepository.findById(userId);
      return optionalUser.orElse(null);
   }

   @Override
   public User findByEmail(String email) {
      Optional<User> optionalUser = userRepository.findByEmail(email);
      return optionalUser.orElse(null);
   }

   @Override
   public List<User> getAllUsers() {
      return (List<User>) userRepository.findAll();
   }

   @Override
   public User updateUser(User user) {
      User existingUser = userRepository.findById(user.getId()).orElse(null);
      if(existingUser == null) {
         return null;
      }
      existingUser.setFirstName(user.getFirstName());
      existingUser.setLastName(user.getLastName());
      existingUser.setEmail(user.getEmail());
      User updatedUser = userRepository.save(existingUser);
      return updatedUser;
   }

   @Override
   public void deleteUser(Long userId) {
      userRepository.deleteById(userId);
   }

   @Override
   public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
      User user = userRepository.findByEmail(email)
              .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

      GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());

      return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), Collections.singleton(authority));
   }

   @Override
   public List<String> validatePassword(String password) {
      List<String> errors = new ArrayList<>();
      if (password == null || password.length() < 8) {
         errors.add("Password must be at least 8 characters long.");
      }
      if (!Pattern.compile("[A-Z]").matcher(password).find()) {
         errors.add("Password must contain at least one uppercase letter.");
      }
      if (!Pattern.compile("[a-z]").matcher(password).find()) {
         errors.add("Password must contain at least one lowercase letter.");
      }
      if (!Pattern.compile("[0-9]").matcher(password).find()) {
         errors.add("Password must contain at least one digit.");
      }
      if (!Pattern.compile("[^a-zA-Z0-9]").matcher(password).find()) {
         errors.add("Password must contain at least one special character.");
      }
      return errors;
   }
}
