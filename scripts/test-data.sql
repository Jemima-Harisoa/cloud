-- ============================================================================
-- Script d'insertion des données de test
-- Base de données: identity_provider
-- Date: 26 janvier 2026
-- ============================================================================

-- Nettoyer les anciennes données (si besoin)
-- DELETE FROM road_issues;
-- DELETE FROM sessions;
-- DELETE FROM users;

-- ============================================================================
-- 1. UTILISATEURS DE TEST
-- ============================================================================
-- Note: Les mots de passe sont hashés avec BCrypt en production
-- Pour les tests, on va insérer des hashes BCrypt valides

INSERT INTO users (email, password, first_name, last_name, phone_number, role, is_blocked, failed_login_attempts, created_at, last_login)
VALUES
-- VISITOR (Pas d'identifiant, accès consultatif seulement)

-- USER 1: Citoyen normal
('jean.dupont@example.com', 
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7Oy3RB0DvgvB/wk4Q8H8/ire',  -- password: "password123"
 'Jean', 'Dupont', '+261 32 1234567', 'USER', false, 0, NOW(), NOW()),

-- USER 2: Autre citoyen
('marie.martin@example.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7Oy3RB0DvgvB/wk4Q8H8/ire',  -- password: "password123"
 'Marie', 'Martin', '+261 33 9876543', 'USER', false, 0, NOW(), NOW()),

-- USER 3: Citoyen bloqué (pour tester déblocage)
('blocked.user@example.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7Oy3RB0DvgvB/wk4Q8H8/ire',  -- password: "password123"
 'Pierre', 'Bernard', '+261 34 5555555', 'USER', true, 3, NOW() - INTERVAL '1 day', NULL),

-- MANAGER 1: Gestionnaire principal
('manager.antananarivo@example.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7Oy3RB0DvgvB/wk4Q8H8/ire',  -- password: "password123"
 'Robert', 'Durand', '+261 32 1111111', 'MANAGER', false, 0, NOW(), NOW()),

-- MANAGER 2: Gestionnaire secondaire
('admin.roads@example.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7Oy3RB0DvgvB/wk4Q8H8/ire',  -- password: "password123"
 'Sophie', 'Laurent', '+261 33 2222222', 'MANAGER', false, 0, NOW(), NOW());

-- ============================================================================
-- 2. SESSIONS DE TEST (optionnel - créées automatiquement à la connexion)
-- ============================================================================
-- INSERT INTO sessions (user_id, token, is_active, expires_at)
-- SELECT id, 'test-token-' || id, true, NOW() + INTERVAL '24 hours'
-- FROM users WHERE role = 'USER' OR role = 'MANAGER';

-- ============================================================================
-- 3. SIGNALEMENTS DE TRAVAUX ROUTIERS (Road Issues)
-- ============================================================================

INSERT INTO road_issues (title, description, latitude, longitude, surface_area, budget, company, status, reporter_id, created_at, updated_at, completed_at)
VALUES

-- Issue 1: Nid de poule Avenue de l'Indépendance
(
  'Nid de poule Avenue de l''Indépendance',
  'Grand nid de poule devant le marché, danger pour véhicules. Profondeur estimée 15cm.',
  -18.8747, 47.5292,
  2.5, 50000, 'Voirie Antananarivo',
  'NEW', 
  (SELECT id FROM users WHERE email = 'jean.dupont@example.com' LIMIT 1),
  NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NULL
),

-- Issue 2: Chaussée défoncée Rue Rainilaiarivony
(
  'Chaussée défoncée Rue Rainilaiarivony',
  'Section de 50m complètement dégradée. Besoin de réfection complète.',
  -18.8756, 47.5310,
  50.0, 2500000, 'Entreprise BTP Solimena',
  'IN_PROGRESS',
  (SELECT id FROM users WHERE email = 'marie.martin@example.com' LIMIT 1),
  NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days', NULL
),

-- Issue 3: Trou dans Boulevard de l'Europe
(
  'Trou dans Boulevard de l''Europe',
  'Effondrement partiel, risque d''accident. Zone touristique.',
  -18.8720, 47.5250,
  5.0, 150000, 'Maintenance Urbaine',
  'COMPLETED',
  (SELECT id FROM users WHERE email = 'jean.dupont@example.com' LIMIT 1),
  NOW() - INTERVAL '20 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'
),

-- Issue 4: Pavés soulevés Rue Andohalo
(
  'Pavés soulevés Rue Andohalo',
  'Les pavés se soulèvent progressivement, passants trébuchent régulièrement.',
  -18.8800, 47.5200,
  15.0, 300000, 'Services Municipaux',
  'IN_PROGRESS',
  (SELECT id FROM users WHERE email = 'marie.martin@example.com' LIMIT 1),
  NOW() - INTERVAL '8 days', NOW() - INTERVAL '1 day', NULL
),

-- Issue 5: Dégâts eau Rue de Madagascar
(
  'Dégâts causés par fuite d''eau',
  'Une fuite d''eau principale a endommagé 30m² de route. Urgence sanitaire.',
  -18.8680, 47.5330,
  30.0, 800000, 'Eau et Assainissement Tn',
  'IN_PROGRESS',
  (SELECT id FROM users WHERE email = 'jean.dupont@example.com' LIMIT 1),
  NOW() - INTERVAL '3 days', NOW(), NULL
),

-- Issue 6: Affaissement Rue Joffre
(
  'Affaissement de la chaussée Rue Joffre',
  'Affaissement progressif indiquant un vide sous-terrain. À investiguer.',
  -18.8750, 47.5180,
  8.0, 400000, 'Géotechnique Experts',
  'NEW',
  (SELECT id FROM users WHERE email = 'marie.martin@example.com' LIMIT 1),
  NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL
),

-- Issue 7: Pont dégradé Pont du Roi
(
  'Structure du Pont du Roi dégradée',
  'Fissures dans les piliers, nécessite expertise structurale. URGENT.',
  -18.8650, 47.5100,
  20.0, 5000000, 'Travaux Publics Madagascar',
  'NEW',
  (SELECT id FROM users WHERE email = 'jean.dupont@example.com' LIMIT 1),
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL
),

-- Issue 8: Marquage routier effacé Avenue Mère Thérésa
(
  'Marquage routier effacé - Sécurité',
  'Les lignes blanches et passages piétons ne sont plus visibles. Risque d''accident.',
  -18.8730, 47.5400,
  100.0, 150000, 'Signalisation Urbaine',
  'COMPLETED',
  (SELECT id FROM users WHERE email = 'marie.martin@example.com' LIMIT 1),
  NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'
),

-- Issue 9: Débris routier Boulevard de la République
(
  'Débris et gravats sur la chaussée',
  'Construction abandonnée, débris bloquent la circulation. Dégagement urgent.',
  -18.8770, 47.5320,
  3.0, 75000, 'Nettoyage Urbain',
  'IN_PROGRESS',
  (SELECT id FROM users WHERE email = 'jean.dupont@example.com' LIMIT 1),
  NOW() - INTERVAL '6 hours', NOW(), NULL
),

-- Issue 10: Route inondée Rue de la Gare
(
  'Route complètement inondée - Saison pluies',
  'Section non drainée, eau stagne depuis 3 jours. Impossible de circuler.',
  -18.8900, 47.5450,
  25.0, 600000, 'Drainage et Assainissement',
  'NEW',
  (SELECT id FROM users WHERE email = 'marie.martin@example.com' LIMIT 1),
  NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', NULL
);

-- ============================================================================
-- 4. STATISTIQUES ATTENDUES
-- ============================================================================
-- Total signalements: 10
-- Nouveaux (NEW): 4
-- En cours (IN_PROGRESS): 4
-- Complétés (COMPLETED): 2
-- Superficie totale: 258.5 m²
-- Budget total: 9,225,000 Ar

-- ============================================================================
-- 5. VÉRIFICATION DES DONNÉES
-- ============================================================================

SELECT '=== STATISTIQUES UTILISATEURS ===' as info;
SELECT role, COUNT(*) as nombre, 
  (CASE WHEN role = 'USER' AND is_blocked = true THEN '(bloqués)' ELSE '' END) as note
FROM users 
GROUP BY role, is_blocked;

SELECT '' as info;
SELECT '=== STATISTIQUES SIGNALEMENTS ===' as info;
SELECT status, COUNT(*) as nombre
FROM road_issues
GROUP BY status
ORDER BY 
  CASE status 
    WHEN 'NEW' THEN 1
    WHEN 'IN_PROGRESS' THEN 2
    WHEN 'COMPLETED' THEN 3
  END;

SELECT '' as info;
SELECT '=== RÉSUMÉS FINANCIERS ===' as info;
SELECT 
  COUNT(*) as total_issues,
  ROUND(SUM(surface_area), 2) as surface_totale_m2,
  SUM(budget) as budget_total_ar,
  COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_count,
  ROUND(100.0 * COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) / COUNT(*), 1) as completion_percent
FROM road_issues;
