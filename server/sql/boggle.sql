-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 27 jan. 2023 à 13:02
-- Version du serveur : 5.7.33
-- Version de PHP : 7.4.19
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;
--
-- Base de données : `boggle`
--
-- --------------------------------------------------------
--
-- Structure de la table `chat`
--
CREATE TABLE `chat` (
  `idMessage` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `idPlayer` int(11) NOT NULL,
  `idGame` int(11) NOT NULL,
  `sendAt` timestamp NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- --------------------------------------------------------
--
-- Structure de la table `games`
--
CREATE TABLE `games` (
  `idGame` int(11) NOT NULL,
  `grid` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL,
  `startedAt` timestamp NULL DEFAULT NULL,
  `endedAt` timestamp NULL DEFAULT NULL,
  `isPrivateGame` tinyint(1) NOT NULL,
  `publicId` varchar(255) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- --------------------------------------------------------
--
-- Structure de la table `gamesplayers`
--
CREATE TABLE `gamesplayers` (
  `idPlayer` int(11) NOT NULL,
  `idGame` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- --------------------------------------------------------
--
-- Structure de la table `history`
--
CREATE TABLE `history` (
  `idHistory` int(11) NOT NULL,
  `idGame` int(11) NOT NULL,
  `idPlayer` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `hasWin` tinyint(1) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- --------------------------------------------------------
--
-- Structure de la table `players`
--
CREATE TABLE `players` (
  `idPlayer` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `passkey` json DEFAULT NULL,
  `emailVerifiedLastTimeAt` date DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `profilPicUrl` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL,
  `lastConnection` timestamp NOT NULL,
  `isPrivateAccount` tinyint(1) NOT NULL,
  `websocketToken` varchar(255) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- --------------------------------------------------------
--
-- Structure de la table `wordsfound`
--
CREATE TABLE `wordsfound` (
  `idWord` int(11) NOT NULL,
  `idGame` int(11) NOT NULL,
  `idPlayer` int(11) NOT NULL,
  `word` varchar(255) NOT NULL,
  `foundAt` timestamp NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
-- Index pour les tables déchargées
--
--
-- Index pour la table `chat`
--
ALTER TABLE `chat`
ADD PRIMARY KEY (`idMessage`),
  ADD KEY `idGame` (`idGame`),
  ADD KEY `idPlayer` (`idPlayer`);
--
-- Index pour la table `games`
--
ALTER TABLE `games`
ADD PRIMARY KEY (`idGame`);
--
-- Index pour la table `gamesplayers`
--
ALTER TABLE `gamesplayers`
ADD KEY `idGame` (`idGame`),
  ADD KEY `idPlayer` (`idPlayer`);
--
-- Index pour la table `history`
--
ALTER TABLE `history`
ADD PRIMARY KEY (`idHistory`),
  ADD KEY `idGame` (`idGame`),
  ADD KEY `idPlayer` (`idPlayer`);
--
-- Index pour la table `players`
--
ALTER TABLE `players`
ADD PRIMARY KEY (`idPlayer`);
--
-- Index pour la table `wordsfound`
--
ALTER TABLE `wordsfound`
ADD PRIMARY KEY (`idWord`),
  ADD KEY `idGame` (`idGame`),
  ADD KEY `idPlayer` (`idPlayer`);
--
-- AUTO_INCREMENT pour les tables déchargées
--
--
-- AUTO_INCREMENT pour la table `chat`
--
ALTER TABLE `chat`
MODIFY `idMessage` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `games`
--
ALTER TABLE `games`
MODIFY `idGame` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `history`
--
ALTER TABLE `history`
MODIFY `idHistory` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `players`
--
ALTER TABLE `players`
MODIFY `idPlayer` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `wordsfound`
--
ALTER TABLE `wordsfound`
MODIFY `idWord` int(11) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables déchargées
--
--
-- Contraintes pour la table `chat`
--
ALTER TABLE `chat`
ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`idGame`) REFERENCES `games` (`idGame`),
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`idPlayer`) REFERENCES `players` (`idPlayer`);
--
-- Contraintes pour la table `gamesplayers`
--
ALTER TABLE `gamesplayers`
ADD CONSTRAINT `gamesplayers_ibfk_1` FOREIGN KEY (`idGame`) REFERENCES `games` (`idGame`),
  ADD CONSTRAINT `gamesplayers_ibfk_2` FOREIGN KEY (`idPlayer`) REFERENCES `players` (`idPlayer`);
--
-- Contraintes pour la table `history`
--
ALTER TABLE `history`
ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`idGame`) REFERENCES `games` (`idGame`),
  ADD CONSTRAINT `history_ibfk_2` FOREIGN KEY (`idPlayer`) REFERENCES `players` (`idPlayer`);
--
-- Contraintes pour la table `wordsfound`
--
ALTER TABLE `wordsfound`
ADD CONSTRAINT `wordsfound_ibfk_1` FOREIGN KEY (`idGame`) REFERENCES `games` (`idGame`),
  ADD CONSTRAINT `wordsfound_ibfk_2` FOREIGN KEY (`idPlayer`) REFERENCES `players` (`idPlayer`);
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;