### Passwort-Hashing mit Salt und Pepper Methode

#### Konzept und Hintergrund

Bei der Speicherung von Passwörtern ist es wichtig, dass diese nicht im Klartext in der Datenbank abgelegt werden. Hashing ist ein Einweg-Verschlüsselungsverfahren, das bedeutet, dass das ursprüngliche Passwort nicht mehr direkt aus dem Hash rekonstruiert werden kann.

##### Warum nur Hashing nicht reicht

Angreifer können **Rainbow Tables** verwenden, um bekannte Hashes wieder in Passwörter zurückzuwandeln. Um dies zu verhindern, werden folgende Methoden eingesetzt:

*   **Salt**: Ein zufälliger Wert, der für jedes Passwort individuell generiert und in der Datenbank gespeichert wird. Dieser wird vor dem Hashing mit dem Passwort kombiniert und verhindert, dass zwei gleiche Passwörter zu gleichen Hashes führen.
*   **Pepper**: Ein zusätzlicher geheimer Wert, der global für die Anwendung festgelegt wird und ebenfalls zum Passwort hinzugefügt wird. Im Gegensatz zum Salt wird der Pepper **nicht** in der Datenbank gespeichert.

##### Verwendetes Hash-Verfahren: BCrypt

Ich habe das Verfahren **BCrypt** verwendet.

#### Umsetzung in der Tresor-Applikation

Die Logik für das Passwort-Hashing habe ich im Service `PasswordEncryptionService` implementiert. Dieser ist für das **Hashen** bei der Registrierung sowie das **Vergleichen** beim Login zuständig.

##### Ablauf bei der Registrierung

1.  Der Benutzer gibt ein Passwort ein.
2.  Vor dem Hashing wird ein fester **Pepper** an das Passwort angehängt.
3.  Das Ergebnis wird mit `BCrypt` gehashed.
4.  Der erzeugte Hash wird in der Datenbank gespeichert.

##### Ablauf beim Login

1.  Der Benutzer gibt sein Passwort erneut ein.
2.  Wieder wird der gleiche Pepper angehängt.
3.  Das Passwort wird mit `BCrypt.matches()` gegen den gespeicherten Hash geprüft.
