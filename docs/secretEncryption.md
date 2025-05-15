# Verschlüsselung von Secrets mit AES-256

## Konzept und Hintergrund

Benutzer speichern sensible Daten, sogenannte **Secrets** (z. B. Passwörter, Notizen, Zugangsdaten). Diese dürfen **nicht im Klartext** in der Datenbank gespeichert werden, da sonst bei einem Datenbank Leak vertrauliche Informationen geleaked werden.

### Ziel ist

- Secrets werden **verschlüsselt gespeichert**.
- Beim Abruf werden sie **entschlüsselt** und im Klartext angezeigt.
- Der Verschlüsselungsschlüssel darf **nicht direkt in der Datenbank gespeichert** sein.
- Jeder Benutzer hat **einen eigenen Schlüssel** (z. b. abgeleitet aus Benutzerinformationen oder Session-Kontext).


## Verwendetes Verfahren: AES-256 mit Jasypt

Ich habe das **AES-256-Verschlüsselungsverfahren** verwendet. AES (Advanced Encryption Standard) ist ein Standard zur symmetrischen Verschlüsselung. Die Umsetzung erfolgt mit Hilfe der Bibliothek **Jasypt**, die das Arbeiten mit verschlüsseltem Text vereinfacht.

### Eigenschaften von AES-256

- Symmetrische Verschlüsselung (gleicher Schlüssel zum Ver- und Entschlüsseln)
- Hohe Sicherheit bei korrekt implementierter Schlüsselverwaltung
- Schnell und effizient in der Anwendung


## Umsetzung in der Tresor-Applikation

Die Verschlüsselungslogik ist in der Klasse `EncryptUtil`. Diese nutzt `AES256TextEncryptor` aus der Jasypt Library, um beliebige Texte zu verschlüsseln und zu entschlüsseln.

### Funktionsweise

1. Beim Speichern eines Secrets wird der Klartext mit AES-256 verschlüsselt.
2. Der verschlüsselte Text wird in der Datenbank gespeichert.
3. Beim Abrufen wird der verschlüsselte Text mit dem gleichen Schlüssel wieder entschlüsselt.
