### Überprüfung der Passwortstärke

#### Konzept und Hintergrund

Starke Passwörter sind ein fundamentaler Bestandteil der Account-Sicherheit. Um Benutzer zu ermutigen, sichere Passwörter zu wählen, ist es entscheidend, die Komplexität der gewählten Passwörter direkt bei der Eingabe zu überprüfen und dem Benutzer Feedback zu geben. Dies hilft, schwache und leicht zu erratende Passwörter zu verhindern.

##### Kriterien für ein starkes Passwort

Ein starkes Passwort erfüllt typischerweise mehrere Kriterien:
*   **Länge**: Eine ausreichende Mindestlänge (z.B. 8 oder 12 Zeichen).
*   **Komplexität**: Eine Mischung aus verschiedenen Zeichentypen:
    *   Großbuchstaben (A-Z)
    *   Kleinbuchstaben (a-z)
    *   Zahlen (0-9)
    *   Sonderzeichen (!, @, #, $, %, etc.)

#### Verwendetes Verfahren: `zxcvbn`

Für die Überprüfung der Passwortstärke habe ich die JavaScript-Bibliothek `zxcvbn` verwendet. `zxcvbn` ist ein von Dropbox entwickelter Passwort-Stärke-Schätzer. Anstatt nur die Komplexität basierend auf Zeichenmustern zu bewerten, verwendet die Bibliothek einen Algorithmus, der das Passwort mit bekannten Mustern, Wörterbüchern und häufig verwendeten Passwörtern abgleicht.

##### Vorteile von `zxcvbn`

*   **Realistische Einschätzung**: Gibt eine Schätzung ab, wie lange ein Brute-Force-Angriff dauern würde.
*   **Detailliertes Feedback**: Liefert nicht nur einen Score, sondern auch Hinweise, wie das Passwort verbessert werden kann.
*   **Einfache Integration**: Lässt sich unkompliziert in Frontend-Anwendungen einbinden.

#### Umsetzung in der Tresor-Applikation

Die Überprüfung der Passwortstärke erfolgt in Echtzeit im Frontend (der React-Applikation), während der Benutzer sein Passwort im Registrierungsformular eingibt.

##### Funktionsweise

1.  **Einbindung**: Die `zxcvbn`-Bibliothek wird in die entsprechende React-Komponente importiert.
2.  **Echtzeit-Analyse**: Bei jeder Änderung im Passwort-Eingabefeld wird die `zxcvbn()`-Funktion aufgerufen und das aktuelle Passwort übergeben.
3.  **Ergebnis-Verarbeitung**: Die Funktion gibt ein Ergebnisobjekt zurück, das unter anderem einen `score` von 0 bis 4 enthält (0 = schwach, 4 = sehr stark).
4.  **Visuelles Feedback**:
    *   Basierend auf dem `score` wird dem Benutzer ein visueller Indikator (z.B. ein farbiger Balken) angezeigt, der die Stärke des Passworts darstellt.
    *   Die Farbe des Balkens ändert sich je nach Stärke (z.B. von Rot über Gelb zu Grün).
5.  **Validierung**: Bei der Absendung des Formulars wird geprüft, ob das Passwort eine Mindeststärke (z.B. Score >= 2) erreicht hat. Ist dies nicht der Fall, wird die Registrierung verhindert und der Benutzer aufgefordert, ein stärkeres Passwort zu wählen. 