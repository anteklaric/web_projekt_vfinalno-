-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2025 at 12:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `band`
--

-- --------------------------------------------------------

--
-- Table structure for table `aktivnosti`
--

CREATE TABLE `aktivnosti` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) DEFAULT NULL,
  `akcija` varchar(100) DEFAULT NULL,
  `datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `aktivnosti`
--

INSERT INTO `aktivnosti` (`id`, `korisnik_id`, `akcija`, `datum`) VALUES
(5, 4, 'registracija', '2025-11-19 23:25:35'),
(6, 11, 'registracija', '2025-12-09 20:28:11'),
(7, 12, 'registracija', '2025-12-09 20:29:52'),
(8, 12, 'login', '2025-12-09 20:34:29'),
(9, 10, 'login', '2025-12-09 20:42:32'),
(10, 9, 'login', '2025-12-09 20:42:55'),
(11, 9, 'login', '2025-12-09 20:52:46'),
(12, 10, 'login', '2025-12-09 21:06:20'),
(13, 10, 'login', '2025-12-10 16:32:20'),
(14, 10, 'login', '2025-12-10 19:15:14'),
(15, 9, 'login', '2025-12-10 19:34:45'),
(16, 10, 'login', '2025-12-10 19:39:44'),
(17, 9, 'login', '2025-12-10 19:40:18');

-- --------------------------------------------------------

--
-- Table structure for table `albumi`
--

CREATE TABLE `albumi` (
  `id` int(11) NOT NULL,
  `naziv` varchar(100) DEFAULT NULL,
  `godina` int(11) DEFAULT NULL,
  `opis` text DEFAULT NULL,
  `slika` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `albumi`
--

INSERT INTO `albumi` (`id`, `naziv`, `godina`, `opis`, `slika`) VALUES
(1, 'Please Please Me', 1969, 'Debut album from the Beatles', 'images/pleaseplease.jpg'),
(2, 'Abbey Road', 1969, 'Last Recorded album from the Beatles', 'images/abbey.jpg'),
(6, 'With The Beatles', 1962, 'Snimano davno', 'https://upload.wikimedia.org/wikipedia/en/5/52/With_the_Beatles.png');

-- --------------------------------------------------------

--
-- Table structure for table `citati`
--

CREATE TABLE `citati` (
  `id` int(11) NOT NULL,
  `clan_id` int(11) DEFAULT NULL,
  `tekst` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `citati`
--

INSERT INTO `citati` (`id`, `clan_id`, `tekst`) VALUES
(8, 2, 'When you were young, and your heart, was an open book. You used to say, live and let live.'),
(9, 4, 'Your host for this evening, the Rolling Stones');

-- --------------------------------------------------------

--
-- Table structure for table `clanovi`
--

CREATE TABLE `clanovi` (
  `id` int(11) NOT NULL,
  `ime` varchar(100) DEFAULT NULL,
  `instrument` varchar(50) DEFAULT NULL,
  `biografija` text DEFAULT NULL,
  `slika` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clanovi`
--

INSERT INTO `clanovi` (`id`, `ime`, `instrument`, `biografija`, `slika`) VALUES
(2, 'Paul Mccartney', 'Vocal, Bass, Piano', 'Songwriter', 'images/mccartney.jpg'),
(4, 'John Lennon', 'Vocal, Guitar, Piano', 'John Winston Ono Lennon (1940–1980) was an English singer, songwriter, and peace activist. He co-founded The Beatles, the most commercially successful band in history, and became a leading figure in the 1960s counterculture. After the Beatles disbanded in 1970, Lennon pursued a solo career, releasing iconic songs such as \"Imagine\" and \"Give Peace a Chance.\" He was married to artist Yoko Ono and was tragically assassinated in New York City on December 8, 1980.', 'images/lennon.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('song','album','quote') NOT NULL,
  `item_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `type`, `item_id`, `created_at`) VALUES
(102, 10, 'song', 3, '2025-12-09 19:09:58'),
(111, 10, 'album', 1, '2025-12-09 19:14:38'),
(113, 10, 'song', 6, '2025-12-09 20:00:12'),
(118, 12, 'song', 5, '2025-12-09 20:34:41'),
(119, 12, 'song', 2, '2025-12-09 20:34:41'),
(120, 12, 'song', 1, '2025-12-09 20:34:42'),
(121, 12, 'album', 2, '2025-12-09 20:34:43'),
(125, 10, 'song', 1, '2025-12-09 21:23:42'),
(143, 10, 'quote', 9, '2025-12-10 17:39:54'),
(146, 10, 'album', 6, '2025-12-10 19:20:03'),
(151, 10, 'song', 7, '2025-12-10 19:29:12'),
(152, 10, 'album', 2, '2025-12-10 19:29:13'),
(153, 10, 'quote', 8, '2025-12-10 19:29:30');

-- --------------------------------------------------------

--
-- Table structure for table `komentari`
--

CREATE TABLE `komentari` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) NOT NULL,
  `tip` enum('album','quote','member') NOT NULL,
  `item_id` int(11) NOT NULL,
  `tekst` text NOT NULL,
  `datum` datetime DEFAULT current_timestamp(),
  `odobren` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `komentari`
--

INSERT INTO `komentari` (`id`, `korisnik_id`, `tip`, `item_id`, `tekst`, `datum`, `odobren`) VALUES
(1, 10, 'quote', 9, 'Pero', '2025-12-10 16:44:28', 0),
(2, 10, 'member', 4, 'Pero', '2025-12-10 16:44:44', 0),
(3, 10, 'member', 4, 'Pero', '2025-12-10 16:47:39', 0),
(4, 10, 'member', 4, 'Kome', '2025-12-10 16:48:57', 0),
(5, 10, 'member', 4, 'Piii', '2025-12-10 16:51:55', 1),
(8, 10, 'member', 2, 'adasa', '2025-12-10 17:25:40', 1),
(9, 10, 'quote', 9, 'sdfds', '2025-12-10 17:25:56', 1),
(10, 10, 'quote', 8, 'fff', '2025-12-10 17:30:52', 1),
(11, 10, 'member', 4, 'a', '2025-12-10 17:35:59', 1),
(12, 10, 'quote', 9, 'asd', '2025-12-10 19:19:11', 1),
(13, 10, 'quote', 9, 'ej', '2025-12-10 19:40:00', 1),
(14, 10, 'quote', 8, 'ehija', '2025-12-10 19:40:10', 1);

-- --------------------------------------------------------

--
-- Table structure for table `korisnici`
--

CREATE TABLE `korisnici` (
  `id` int(11) NOT NULL,
  `ime` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `lozinka` varchar(255) DEFAULT NULL,
  `uloga` enum('admin','fan') DEFAULT 'fan',
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `korisnici`
--

INSERT INTO `korisnici` (`id`, `ime`, `email`, `lozinka`, `uloga`, `last_login`) VALUES
(4, 'Pero', 'pero@example.com', '$2y$10$sbh/vEO4UIpN2SN6MrPKuOKwP.owb9ODDP8vah1.7TRkjJo0W.BBS', 'fan', NULL),
(9, 'admin', 'admin@beatles.com', '$2y$10$sbh/vEO4UIpN2SN6MrPKuOKwP.owb9ODDP8vah1.7TRkjJo0W.BBS', 'admin', '2025-12-09 20:18:49'),
(10, 'fan', 'fan@beatles.com', '$2y$10$sbh/vEO4UIpN2SN6MrPKuOKwP.owb9ODDP8vah1.7TRkjJo0W.BBS', 'fan', '2025-12-09 20:08:48'),
(11, 'Pero', 'pero@ff.hr', '$2y$10$sbh/vEO4UIpN2SN6MrPKuOKwP.owb9ODDP8vah1.7TRkjJo0W.BBS', 'fan', NULL),
(12, 'mihajlo', 'mihajlo@ff.hr', '$2y$10$sbh/vEO4UIpN2SN6MrPKuOKwP.owb9ODDP8vah1.7TRkjJo0W.BBS', 'fan', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pjesme`
--

CREATE TABLE `pjesme` (
  `id` int(11) NOT NULL,
  `album_id` int(11) DEFAULT NULL,
  `naziv` varchar(100) DEFAULT NULL,
  `trajanje` varchar(10) DEFAULT NULL,
  `ocjene` int(11) DEFAULT 0,
  `tekst` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pjesme`
--

INSERT INTO `pjesme` (`id`, `album_id`, `naziv`, `trajanje`, `ocjene`, `tekst`) VALUES
(1, 1, 'Please Please Me', '2:01', 23, NULL),
(2, 1, 'I Saw Her Standing There', '2:01', 16, 'Well, she was just seventeen,\r\nYou know what I mean,\r\nAnd the way she looked was way beyond compare,\r\nSo how could I dance with another,\r\nOh when I saw her standing there\r\nWell she looked at me,\r\nAnd I, I could see,\r\nThat before too long I\'d fall in love with her,\r\nShe wouldn\'t dance with another,\r\nOh when I saw her standing there.\r\nWell my heart went boom when I crossed that room,\r\nAnd I held her hand in mine.\r\nOh we danced through the night,\r\nAnd we held each other tight,\r\nAnd before too long I fell in love with her,\r\nNow I\'ll never dance with another,\r\nOh when I saw her standing there.\r\nWell my heart went boom when I crossed that room,\r\nAnd I held her hand in mine.\r\nOh we danced through the night,\r\nAnd we held each other tight,\r\nAnd before too long I fell in love with her,\r\nNow I\'ll never dance with another,\r\nOh since I saw her standing there.\r\nOh since I saw her standing there.'),
(7, 2, 'Golden Slumbers', '1:20', 1, 'Once, there was a way\r\nTo get back homeward\r\nOnce, there was a way\r\nTo get back home\r\nSleep, pretty darling, do not cry\r\nAnd I will sing a lullaby\r\nGolden slumbers fill your eyes\r\nSmiles awake you when you rise\r\nSleep, pretty darling, do not cry\r\nAnd I will sing a lullaby\r\nOnce, there was a way\r\nTo get back homeward\r\nOnce, there was a way\r\nTo get back home\r\nSleep, pretty darling, do not cry\r\nAnd I will sing a lullaby');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aktivnosti`
--
ALTER TABLE `aktivnosti`
  ADD PRIMARY KEY (`id`),
  ADD KEY `korisnik_id` (`korisnik_id`);

--
-- Indexes for table `albumi`
--
ALTER TABLE `albumi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `citati`
--
ALTER TABLE `citati`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clan_id` (`clan_id`);

--
-- Indexes for table `clanovi`
--
ALTER TABLE `clanovi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_fav` (`user_id`,`type`,`item_id`);

--
-- Indexes for table `komentari`
--
ALTER TABLE `komentari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `korisnik_id` (`korisnik_id`);

--
-- Indexes for table `korisnici`
--
ALTER TABLE `korisnici`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `pjesme`
--
ALTER TABLE `pjesme`
  ADD PRIMARY KEY (`id`),
  ADD KEY `album_id` (`album_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aktivnosti`
--
ALTER TABLE `aktivnosti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `albumi`
--
ALTER TABLE `albumi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `citati`
--
ALTER TABLE `citati`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `clanovi`
--
ALTER TABLE `clanovi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT for table `komentari`
--
ALTER TABLE `komentari`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `korisnici`
--
ALTER TABLE `korisnici`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `pjesme`
--
ALTER TABLE `pjesme`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aktivnosti`
--
ALTER TABLE `aktivnosti`
  ADD CONSTRAINT `aktivnosti_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnici` (`id`);

--
-- Constraints for table `citati`
--
ALTER TABLE `citati`
  ADD CONSTRAINT `citati_ibfk_1` FOREIGN KEY (`clan_id`) REFERENCES `clanovi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `korisnici` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `komentari`
--
ALTER TABLE `komentari`
  ADD CONSTRAINT `komentari_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnici` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pjesme`
--
ALTER TABLE `pjesme`
  ADD CONSTRAINT `pjesme_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `albumi` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
