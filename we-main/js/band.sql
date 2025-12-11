CREATE DATABASE band CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE band;

CREATE TABLE korisnici (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ime VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  lozinka VARCHAR(255),
  uloga ENUM('admin','fan') DEFAULT 'fan'
);

CREATE TABLE albumi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naziv VARCHAR(100),
  godina INT,
  opis TEXT,
  slika VARCHAR(255)
);

INSERT INTO albumi (naziv, godina, opis, slika)
VALUES 
('Please Please Me', 1969, 'Debut album from the Beatles', 'images/pleaseplease.jpg'),
('Abbey Road', 1969, 'Last Recorded album from the Beatles', 'images/abbey.jpg');

CREATE TABLE pjesme (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album_id INT,
  naziv VARCHAR(100),
  trajanje VARCHAR(10),
  ocjene INT DEFAULT 0,
  FOREIGN KEY (album_id) REFERENCES albumi(id) ON DELETE CASCADE
);

CREATE TABLE aktivnosti (
  id INT AUTO_INCREMENT PRIMARY KEY,
  korisnik_id INT,
  akcija VARCHAR(100),
  datum DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (korisnik_id) REFERENCES korisnici(id)
);

INSERT INTO pjesme (album_id, naziv, trajanje, ocjene)
VALUES
(1, 'Please Please Me', '2:01', 5),

CREATE TABLE clanovi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ime VARCHAR(100),
  instrument VARCHAR(50),
  biografija TEXT,
  slika VARCHAR(255)
);

CREATE TABLE citati (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clan_id INT,
  tekst TEXT,
  FOREIGN KEY (clan_id) REFERENCES clanovi(id) ON DELETE CASCADE
);

INSERT INTO clanovi (ime, instrument, biografija, slika) VALUES
('John Lennon', 'Vocal, Guitar, Piano', 'Frontman, songwriter', 'images/lennon.jpg'),

INSERT INTO citati (clan_id, tekst) VALUES
(1, 'You"re host for this evening, the Rolling Stones')