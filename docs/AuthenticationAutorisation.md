# Authentication and Authorization Implementation

This document outlines the implementation of authentication and authorization in the Tresor-Application.

## Authentication Flow

The application uses a token-based authentication system with JSON Web Tokens (JWT).

1.  **Login with Credentials**:
    - A user submits their `email` and `password` via a `POST` request to the `/api/auth/login` endpoint.
    - The `AuthController` receives the request.
    - It uses Spring Security's `AuthenticationManager` to validate the credentials against the user data stored in the database. The password check is performed using the `BCryptPasswordEncoder`.

2.  **JWT Generation**:
    - Upon successful authentication, the `JwtService` generates a JWT.
    - This token contains the user's email as the subject, the user's roles as a custom claim, and an expiration date.
    - The expiration time is configured in the `application.properties` file (`jwt.expiration.ms`).

3.  **Token-based Subsequent Requests**:
    - The generated JWT is returned to the frontend.
    - The frontend stores this token (e.g., in `localStorage`) and includes it in the `Authorization` header for all subsequent requests to protected endpoints (e.g., `Authorization: Bearer <jwt>`).

## JWT Validation

- The `JwtAuthenticationFilter` is a custom filter that runs for every incoming request.
- It checks for the presence of a `Bearer` token in the `Authorization` header.
- If a token is found, `JwtService` is used to:
    1.  Parse the token and extract the user's email.
    2.  Validate the token's signature using the secret key (`jwt.secret`).
    3.  Check if the token has expired.
- If the token is valid, the filter sets the user's identity in the Spring Security `SecurityContext`, authenticating them for the duration of the request.

## Role-based Authorization

Authorization is handled using roles, restricting access to certain endpoints based on the authenticated user's role.

1.  **Role Definition**:
    - The `User` entity in the database has a `role` field (e.g., "ADMIN", "USER").
    - The first user to register is automatically assigned the `ADMIN` role. All subsequent users are assigned the `USER` role.

2.  **Authorities in Security Context**:
    - When a user is loaded via `UserServiceImpl` (which implements `UserDetailsService`), their role string is converted into a `GrantedAuthority` object (e.g., "ADMIN" becomes `ROLE_ADMIN`). This is the standard format required by Spring Security.

3.  **Enforcing Authorization**:
    - Endpoint access is configured in `SecurityConfig.java` using `authorizeHttpRequests`.
    - **Examples**:
        - `POST /api/users` (Registration): Open to everyone (`permitAll`).
        - `/api/users/**` (Get all users): Requires `ROLE_ADMIN`.
        - `/api/secrets/**`: Requires either `ROLE_USER` or `ROLE_ADMIN`.
    - This ensures that only authenticated users with the correct roles can access protected resources. 