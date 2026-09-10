-- ============================================
-- Script MySQL Workbench - Base de données vente_db
-- ============================================

CREATE DATABASE IF NOT EXISTS vente_db;
USE vente_db;

-- ===== Table Categorie =====
CREATE TABLE IF NOT EXISTS categorie (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    image_url VARCHAR(500)
);

-- ===== Table Produit =====
CREATE TABLE IF NOT EXISTS produit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description VARCHAR(1000),
    prix DOUBLE NOT NULL,
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    categorie_id BIGINT,
    FOREIGN KEY (categorie_id) REFERENCES categorie(id) ON DELETE SET NULL
);

-- ===== Table Utilisateur =====
CREATE TABLE IF NOT EXISTS utilisateur (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
);

-- ============================================
-- Données de démonstration
-- ============================================

INSERT INTO categorie (nom, description, image_url) VALUES
('Électronique', 'Smartphones, ordinateurs, accessoires', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
('Mode', 'Vêtements et accessoires', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400'),
('Maison & Jardin', 'Décoration et équipement maison', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400'),
('Sport & Loisirs', 'Équipements sportifs', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400');

INSERT INTO produit (nom, description, prix, image_url, stock, categorie_id) VALUES
('Smartphone X200', 'Écran 6.5", 128 Go, double SIM, appareil photo 48MP', 399.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 25, 1),
('Casque Bluetooth', 'Casque sans fil, réduction de bruit active', 89.90, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 40, 1),
('Veste en cuir', 'Veste homme en cuir véritable, coupe moderne', 149.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 15, 2),
('Robe d’été', 'Robe légère à motifs floraux', 45.50, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 30, 2),
('Lampe design', 'Lampe de salon LED, design scandinave', 59.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', 20, 3),
('Kit de jardinage', 'Outils essentiels pour jardin', 34.90, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 18, 3),
('Vélo VTT', 'Vélo tout-terrain 21 vitesses', 599.00, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400', 8, 4),
('Ballon de football', 'Ballon officiel taille 5', 24.99, 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400', 50, 4);
