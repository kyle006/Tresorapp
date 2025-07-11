# Logging Implementation

This document outlines the essential aspects of the logging implementation for the Tresor application, covering both the backend and frontend.

## Backend Logging (Spring Boot / SLF4J + Logback)

The backend uses a centralized logging framework as required.

### 1. Framework and Configuration

- **Framework:** We use **SLF4J** as the logging facade and **Logback** as the concrete implementation. These are the standard choices provided by Spring Boot's `spring-boot-starter-logging`.
- **Configuration:** All logging is configured in `src/main/resources/logback-spring.xml`.
- **Log Levels:** The configuration supports `DEBUG`, `INFO`, `WARN`, and `ERROR` levels. The root logger is set to `INFO`, while the application-specific logger `ch.bbw.pr.tresorbackend` is set to `DEBUG`.

### 2. Log Output

- **Console:** Logs are printed to the console with a pattern that includes a timestamp, log level, thread name, logger name (class), and the message.
  - `Pattern: %d{ISO8601} %-5level [%thread] %logger{36} - %msg%n`
- **Files (Rolling):** Logs are also written to files.
  - **Location:** `logs/spring-boot-logger.log`
  - **Rotation Policy:** A new log file is created daily or when the file size exceeds **10MB**.
  - **History:** A maximum of **10** old log files are kept.
  - **Total Size:** The total size of all log archives is capped at **100MB**.

### 3. Logged Events

Logging has been implemented in key areas of the application to record user interactions, system events, and security-relevant events.

- **`AuthController`:**
  - `INFO`: Successful user authentication.
  - `WARN`: Failed authentication attempts (bad credentials). This is a critical security event.
  - `ERROR`: Unexpected errors during the login process.
- **`UserController`:**
  - `INFO`: Successful user creation or deletion. Promotion of the first user to ADMIN.
  - `WARN`: Validation errors during user registration or when a user already exists.
  - `DEBUG`: General process flow, such as requests to get or update a user.
- **`SecretController`:**
  - `INFO`: Successful creation, update, or deletion of secrets.
  - `WARN`: Security-sensitive events such as failed decryption attempts (incorrect password), access denied, or validation failures.
  - `DEBUG`: General process flow, such as requests to get or create secrets.

### 4. Security Considerations

- **No Sensitive Data:** Care has been taken to prevent sensitive data from being logged. The `toString()` methods of `RegisterUser` and `NewSecret` models have been modified using `@ToString.Exclude` to ensure that passwords are not accidentally logged.

## Frontend Logging (React)

A lightweight logging solution has been implemented in the frontend.

### 1. Framework

- **Library:** We use the **`loglevel`** library, which is lightweight and provides simple, effective logging capabilities in the browser.

### 2. Centralized Logging Service

- **Abstraction:** To promote code reuse and centralize control, a logging service was created at `src/comunication/LoggerService.js`.
- **Configuration:** This service configures `loglevel` based on the environment.
  - **Development:** The log level is set to `trace` to show all messages.
  - **Production:** The log level is set to `warn` to only show warnings and errors, reducing noise in the browser console.

### 3. Usage Example (`LoginUser.js`)

- The logger is imported from the central service: `import log from "../../comunication/LoggerService";`
- It is used to log key events in the user login flow:
  - `log.info("Login page loaded");`
  - `log.info("User logged in successfully:", email);`
  - `log.warn("Login failed for user:", email, "Reason:", error);`
  - `log.error("An error occurred during login...", error);` 