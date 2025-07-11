# Authentifizierung und Autorisierung Implementierung

Diese Dokumentation erklärt, wie die Anmeldung und Berechtigung in der Tresor-Anwendung funktioniert.

## Anmeldeprozess

Die Anwendung verwendet ein Token-basiertes Anmeldesystem mit JSON Web Tokens (JWT).

1. **Anmeldung mit Benutzerdaten**:
   - Der Benutzer gibt seine `E-Mail` und sein `Passwort` ein
   - Diese werden an den Server gesendet (`POST` Request an `/api/auth/login`)
   - Der `AuthController` prüft die Daten
   - Das Passwort wird mit `BCryptPasswordEncoder` überprüft

2. **JWT Token erstellen**:
   - Bei erfolgreicher Anmeldung erstellt der `JwtService` einen JWT Token
   - Der Token enthält:
     - E-Mail des Benutzers
     - Rolle des Benutzers (ADMIN oder USER)
     - Ablaufzeit (konfiguriert in `application.properties`)

3. **Token für weitere Anfragen**:
   - Der Token wird an das Frontend zurückgeschickt
   - Das Frontend speichert den Token (z.B. im `localStorage`)
   - Bei jeder weiteren Anfrage wird der Token im Header mitgeschickt: `Authorization: Bearer <token>`

## Token Überprüfung

- Der `JwtAuthenticationFilter` prüft jeden Request
- Er schaut, ob ein `Bearer` Token im `Authorization` Header vorhanden ist
- Wenn ja, wird der Token überprüft:
  1. E-Mail aus dem Token extrahieren
  2. Token-Signatur mit dem geheimen Schlüssel prüfen
  3. Prüfen, ob der Token noch gültig ist (nicht abgelaufen)
- Ist der Token gültig, wird der Benutzer für diesen Request angemeldet

## Rollen-basierte Berechtigung

Die Berechtigung funktioniert über Rollen, die bestimmen, wer auf welche Bereiche zugreifen darf.

1. **Rollen Definition**:
   - Jeder Benutzer hat eine Rolle in der Datenbank: "ADMIN" oder "USER"
   - Der erste registrierte Benutzer wird automatisch zum `ADMIN`
   - Alle weiteren Benutzer werden zu `USER`

2. **Rollen im System**:
   - Der `UserServiceImpl` wandelt die Rolle in ein `GrantedAuthority` Objekt um
   - "ADMIN" wird zu `ROLE_ADMIN`, "USER" wird zu `ROLE_USER`

3. **Zugriffskontrolle**:
   - In der `SecurityConfig.java` wird festgelegt, wer auf welche Bereiche zugreifen darf:
     - `POST /api/users` (Registrierung): Für alle zugänglich
     - `/api/users/**` (Alle Benutzer anzeigen): Nur für `ROLE_ADMIN`
     - `/api/secrets/**` (Geheimnisse verwalten): Für `ROLE_USER` und `ROLE_ADMIN`

## Einfach erklärt

1. **Anmelden**: Benutzer gibt E-Mail und Passwort ein → bekommt Token zurück
2. **Token verwenden**: Bei jeder Anfrage Token mitschicken → Server erkennt, wer du bist
3. **Berechtigung**: Je nach Rolle (ADMIN/USER) darfst du verschiedene Sachen machen