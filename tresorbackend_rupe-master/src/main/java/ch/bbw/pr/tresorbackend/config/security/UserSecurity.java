package ch.bbw.pr.tresorbackend.config.security;

import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("userSecurity")
public class UserSecurity {

    private final UserRepository userRepository;

    public UserSecurity(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean hasUserId(Authentication authentication, Long userId) {
        String username = authentication.getName();
        Optional<User> userOptional = userRepository.findByEmail(username);
        return userOptional.map(user -> user.getId().equals(userId)).orElse(false);
    }
} 