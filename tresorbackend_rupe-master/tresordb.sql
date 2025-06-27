--
-- Datenbank: `tresordb`
--

DROP DATABASE IF EXISTS tresordb;
CREATE DATABASE tresordb;
USE tresordb;

-- --------------------------------------------------------

--
-- table user
--

CREATE TABLE user (
    id int NOT NULL AUTO_INCREMENT,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    email varchar(30) NOT NULL UNIQUE,
    password longtext NOT NULL,
    salt varchar(60) NOT NULL,
    role varchar(20) NOT NULL,
    PRIMARY KEY (id)
);

--
-- table user content
--

-- Passwords are "Admin123!" and "User123!"
INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `password`, `salt`, `role`) VALUES
(1, 'Admin', 'Admin', 'admin@tresor.ch', '$2a$10$vQ3gV4i/aU8aF7a.s8D6e.9eR.y/y5Z.xZ3e.uN/e.tA5vV/e.tA', 'dummySalt', 'ADMIN'),
(2, 'User', 'User', 'user@tresor.ch', '$2a$10$t.Vd4h1g.4F6a.s8D6e.xZ3e.uN/e.tA5vV/e.tA5vV/e.tA', 'dummySalt', 'USER');

--
-- table secret
--

CREATE TABLE secret (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    content text NOT NULL,
    salt varchar(60) NOT NULL,
    iv blob NOT NULL,
    PRIMARY KEY (id)
);

--
-- table secret content
--

-- INSERT INTO `secret` (`id`, `user_id`, `content`) VALUES
--     (1, 1, '{"kindid":1,"kind":"credential","userName":"muster","password":"1234","url":"www.bbw.ch"}'),
--     (2, 1, '{"kindid":2,"kind":"creditcard","cardtype":"Visa","cardnumber":"4242 4242 4242 4241","expiration":"12/27","cvv":"789"}'),
--     (3, 1, '{"kindid":3,"kind":"note","title":"Eragon","content":"Und Eragon ging auf den Drachen zu."}');