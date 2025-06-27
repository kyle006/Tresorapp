package ch.bbw.pr.tresorbackend.controller;

import ch.bbw.pr.tresorbackend.config.jwt.JwtService;
import ch.bbw.pr.tresorbackend.model.AuthRequest;
import ch.bbw.pr.tresorbackend.model.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
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
        // Aufgabe: Authentifizierung mit Email & Passwort.
        logger.info("Login-Request erhalten für Email: {}", request.getEmail());
        // 1. Authentifizierung mit Spring Security durchführen.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        // 2. Bei Erfolg: User-Details laden.
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        logger.info("UserDetails geladen für Email: {}", request.getEmail());
        // 3. JWT für den User generieren und zurücksenden.
        final String jwt = jwtService.generateToken(userDetails);
        logger.info("JWT generiert für Email: {}", request.getEmail());
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
