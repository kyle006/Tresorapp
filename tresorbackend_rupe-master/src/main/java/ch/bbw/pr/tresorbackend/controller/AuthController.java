package ch.bbw.pr.tresorbackend.controller;

import ch.bbw.pr.tresorbackend.config.jwt.JwtService;
import ch.bbw.pr.tresorbackend.model.AuthRequest;
import ch.bbw.pr.tresorbackend.model.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            logger.debug("Login attempt for user '{}'", request.getEmail());
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            final String jwt = jwtService.generateToken(userDetails);
            logger.info("User '{}' successfully authenticated.", request.getEmail());
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (BadCredentialsException e) {
            logger.warn("Authentication failed for user '{}'. Invalid credentials.", request.getEmail());
            return ResponseEntity.status(401).build();
        } catch (Exception e) {
            logger.error("An unexpected error occurred during login for user '{}'", request.getEmail(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
