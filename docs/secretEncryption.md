### Verschlüsselung von Secrets mit AES-256

#### Konzept und Hintergrund

Benutzer speichern sensible Daten, auch **Secrets** genannt (z. B. Passwörter, Notizen, Zugangsdaten). Diese dürfen **nicht im Klartext** in der Datenbank gespeichert werden, da sonst bei einem Datenbank Leak vertrauliche Informationen geleakt werden.


#### Verwendetes Verfahren: AES-256

Ich habe das **AES-256-Verschlüsselungsverfahren** verwendet. AES (Advanced Encryption Standard) ist ein Standard zur symmetrischen Verschlüsselung. Die Umsetzung erfolgt mit Hilfe der Klasse `EncryptUtil`. Ich habe weiter auch iv (Initialisierungsvektor) und salt (Zufallswert) verwendet, um die Sicherheit zu erhöhen.

##### Eigenschaften von AES-256

*   Symmetrische Verschlüsselung (gleicher Schlüssel zum Ver- und Entschlüsseln)
*   Hohe Sicherheit bei korrekt implementierter Schlüsselverwaltung
*   Schnell und effizient in der Anwendung

#### Umsetzung in der Tresor-Applikation

Die Verschlüsselungslogik ist in der Klasse `EncryptUtil` implementiert. Bei der Entwicklung wurde die Webseite, die als Hilfe bei der Secret Aufgabe angegeben war, verwendet. Durch stundenlange Arbeit, Recherche und Experimentieren, teilweise unterstützt durch AI Tools, konnte ich die Verschlüsselungsfunktionalität umsetzen. Dabei habe ich mich intensiv mit der Generierung und Verwendung von Initialisierungsvektoren (IV) auseinandergesetzt, um die Sicherheit der Verschlüsselung zu gewährleisten.

##### Funktionsweise

1.  Beim Speichern eines Secrets wird ein zufälliger Salt generiert und ein Initialisierungsvektor (IV) erzeugt.
2.  Der Klartext wird mit AES-256 unter Verwendung eines Schlüssels, des Salts und des IVs verschlüsselt.
3.  Der verschlüsselte Text, der Salt und der IV werden in der Datenbank gespeichert.
4.  Beim Abrufen wird der verschlüsselte Text mit dem gleichen Schlüssel, dem Salt und dem IV wieder entschlüsselt.