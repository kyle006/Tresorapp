package ch.bbw.pr.tresorbackend.config.security;

import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
        
        // Allow access if user is admin or if it's their own data
        return userOptional.map(user -> 
            user.getId().equals(userId) || 
            authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))
        ).orElse(false);
    }

    public boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    public boolean isUser(Authentication authentication) {
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER"));
    }
} 