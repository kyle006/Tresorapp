### Google reCAPTCHA v3 Integration

#### Konzept und Hintergrund

Um die Anwendung vor Bots und automatisierten Angriffen zu schützen, wurde Google reCAPTCHA v3 implementiert. Im Gegensatz zu früheren Versionen, die oft eine aktive Nutzerinteraktion erforderten (z.B. das Anklicken von "Ich bin kein Roboter"), arbeitet reCAPTCHA v3 im Hintergrund. Es analysiert das Nutzerverhalten und bewertet, wie wahrscheinlich es ist, dass der Nutzer ein Mensch ist.

##### Vorteile von reCAPTCHA v3

*   **Nahtlose User Experience**: Keine Unterbrechung für legitime Nutzer.
*   **Kontinuierliche Bewertung**: Bietet eine Risikobewertung für jede Aktion, nicht nur bei einem bestimmten Ereignis wie dem Login.
*   **Flexibilität**: Die Anwendung kann basierend auf dem Score entscheiden, welche Maßnahmen ergriffen werden sollen (z.B. zusätzliche Verifizierung oder Blockierung).

#### Verwendetes Verfahren: Google reCAPTCHA v3

Ich habe Google reCAPTCHA v3 verwendet, um die Interaktionen der Benutzer zu validieren. Die clientseitige Implementierung sendet ein Token an das Backend, das dann mit den Google-Servern verifiziert wird.

#### Umsetzung in der Tresor-Applikation

Die Logik zur Überprüfung des reCAPTCHA-Tokens ist im `RecaptchaService` implementiert. Dieser Service wird von den Controllern aufgerufen, die geschützt werden sollen, wie z.B. bei der Registrierung oder beim Login.

##### Ablauf bei der Überprüfung

1.  **Frontend**: Das Frontend (die React-Applikation) lädt das reCAPTCHA-Skript von Google und erhält ein Token für die jeweilige Benutzeraktion.
2.  **Token-Übermittlung**: Dieses Token wird zusammen mit den Formulardaten an das Backend gesendet.
3.  **Backend-Verifizierung**:
    *   Der `RecaptchaService` im Backend empfängt das Token.
    *   Es wird eine POST-Anfrage an den Google reCAPTCHA API-Endpunkt (`https://www.google.com/recaptcha/api/siteverify`) gesendet. Diese Anfrage enthält den geheimen Schlüssel der Anwendung und das vom Client erhaltene Token.
    *   Google antwortet mit einem JSON-Objekt, das unter anderem einen `success`-Status und einen `score` (eine Zahl zwischen 0.0 und 1.0) enthält.
4.  **Bewertung und Entscheidung**:
    *   Der Service prüft, ob die Anfrage erfolgreich war (`success: true`).
    *   Anschliessend wird der `score` mit einem vordefinierten Schwellenwert (z.B. 0.5) verglichen.
    *   Wenn der Score über dem Schwellenwert liegt, wird die Aktion als legitim angesehen und die Verarbeitung der Anfrage (z.B. das Anlegen eines neuen Benutzers) wird fortgesetzt. Andernfalls wird die Anfrage abgelehnt. 