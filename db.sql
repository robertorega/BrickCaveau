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
    is_Admin BOOLEAN NOT NULL
);

CREATE TABLE Set_Lego(
	Codice_Set INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Anno_Uscita DATE NOT NULL,
    Anno_Ritiro DATE,
    N_Pezzi INT NOT NULL,
    Descrizione VARCHAR(1000) NOT NULL,
    Prezzo INT NOT NULL,
    Tema VARCHAR(50) NOT NULL,
    Quantita_Magazzino INT NOT NULL
);

CREATE TABLE Indirizzo(
	ID INT PRIMARY KEY,
    N_Civico INT NOT NULL,
    Via VARCHAR(75) NOT NULL,
    Citta VARCHAR(50) NOT NULL,
    CAP INT NOT NULL,
    Provincia VARCHAR(15) NOT NULL,
    Nazione VARCHAR(20) NOT NULL,
    Utente_ID INT NOT NULL,
    
    FOREIGN KEY (Utente_ID)
    REFERENCES Utente(ID_Utente)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE MetodoPagamento(
	ID INT PRIMARY KEY,
    Scadenza DATE, -- solo cc
    Tipo VARCHAR(20) NOT NULL,
    Ultime4Cifre INT, -- solo cc
    Utente_ID INT NOT NULL,
    
    FOREIGN KEY (Utente_ID)
    REFERENCES Utente(ID_Utente)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Immagine(
	ID INT PRIMARY KEY,
    URL VARCHAR(100) NOT NULL,
    is_Principale BOOLEAN NOT NULL,
    Codice_Set INT NOT NULL,
    
    FOREIGN KEY (Codice_Set)
    REFERENCES Set_Lego(Codice_Set)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Ordine(
	ID INT PRIMARY KEY,
    Totale DECIMAL(10,2) NOT NULL,
    Stato_Spedizione VARCHAR(40) NOT NULL,
    Data_Acquisto DATE NOT NULL,
    Utente_ID INT NOT NULL,
    Indirizzo_ID INT NOT NULL,
    
    FOREIGN KEY (Utente_ID)
    REFERENCES Utente(ID_Utente)
		ON DELETE CASCADE
        ON UPDATE CASCADE,

	FOREIGN KEY (Indirizzo_ID)
    REFERENCES Indirizzo(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);








