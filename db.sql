-- db relazionale per brickcaveau

DROP SCHEMA IF EXISTS BrickCaveau;
CREATE SCHEMA BrickCaveau;
USE BrickCaveau;

CREATE TABLE Utente(
	ID_Utente INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(30) NOT NULL,
    Cognome VARCHAR(30) NOT NULL,
    Email VARCHAR(35) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Telefono VARCHAR(15) NOT NULL UNIQUE,
    is_Admin BOOLEAN
);




