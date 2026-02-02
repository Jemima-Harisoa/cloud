-- Script d'insertion des données de test
-- À exécuter dans PostgreSQL

-- 1. NETTOYER LES DONNÉES EXISTANTES (optionnel)
-- DELETE FROM road_issues;
-- DELETE FROM sessions;
-- DELETE FROM users;
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- 2. INSÉRER LES UTILISATEURS DE TEST
-- Mots de passe: Tous les mots de passe sont hachés avec BCrypt
-- Password: Manager@123 (sera remplacé par le vrai hash)
-- Password: User@123456 (sera remplacé par le vrai hash)
-- Password: JohnDoe@2025 (sera remplacé par le vrai hash)

INSERT INTO users (email, password, first_name, last_name, phone_number, role, is_blocked, failed_login_attempts, created_at, last_login)
VALUES
(
  'manager@example.com',
  '$2y$10$PLACEHOLDER_MANAGER',
  'Admin',
  'Manager',
  '+261 34 12 34 567',
  'MANAGER',
  false,
  0,
  NOW(),
  NOW()
),
(
  'user@example.com',
  '$2y$10$PLACEHOLDER_USER',
  'Jean',
  'Utilisateur',
  '+261 32 11 22 333',
  'USER',
  false,
  0,
  NOW(),
  NOW()
),
(
  'john.doe@example.com',
  '$2y$10$PLACEHOLDER_JOHN',
  'John',
  'Doe',
  '+261 33 44 55 666',
  'USER',
  false,
  0,
  NOW(),
  NOW()
),
(
  'marie.dupont@example.com',
  '$2y$10$PLACEHOLDER_MARIE',
  'Marie',
  'Dupont',
  '+261 34 99 88 777',
  'USER',
  false,
  0,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '3 days'
);

-- 3. INSÉRER LES SIGNALEMENTS DE TEST
-- Antananarivo: Centre -18.8747, 47.5292

INSERT INTO road_issues (title, description, latitude, longitude, surface_area, budget, company, status, reporter_id, created_at, updated_at, completed_at)
VALUES
(
  'Nid de poule rue de la Paix',
  'Grand trou d''environ 2m de largeur, très dangereux pour la circulation',
  -18.8747,
  47.5292,
  4.5,
  150000,
  'Public Works',
  'NEW',
  2,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days',
  NULL
),
(
  'Route dégradée avenue de l''Indépendance',
  'Chaussée cassée, trous multiples sur 50 mètres',
  -18.8765,
  47.5310,
  50.0,
  500000,
  'Ministry of Transport',
  'IN_PROGRESS',
  2,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '1 day',
  NULL
),
(
  'Marquage au sol effacé rue Colbert',
  'Les marquages blancs sont complètement usés, danger pour la nuit',
  -18.8820,
  47.5250,
  15.0,
  75000,
  'City Council',
  'COMPLETED',
  3,
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
),
(
  'Trottoir cassé devant école primaire',
  'Danger pour les enfants, plusieurs dalles soulevées',
  -18.8690,
  47.5340,
  25.0,
  200000,
  'Education Ministry',
  'NEW',
  4,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days',
  NULL
),
(
  'Pont endommagé route vers Périphérique Nord',
  'Fissures importantes, passage dangereux',
  -18.8500,
  47.5100,
  80.0,
  1500000,
  'National Road Authority',
  'IN_PROGRESS',
  3,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '2 days',
  NULL
),
(
  'Poterie rue Razafimahefa',
  'Petit trou à réparer avant que ça s''aggrave',
  -18.8900,
  47.5400,
  2.0,
  50000,
  'Local Authority',
  'COMPLETED',
  2,
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days'
),
(
  'Glissière de sécurité manquante route de l''Est',
  'Danger particulièrement la nuit et par mauvais temps',
  -18.9000,
  47.5500,
  40.0,
  300000,
  'Safety Commission',
  'NEW',
  4,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  NULL
),
(
  'Signalisation routière effacée',
  'Les stops et cédez-le-passage ne sont plus visibles',
  -18.8600,
  47.5200,
  5.0,
  30000,
  'Traffic Control',
  'IN_PROGRESS',
  3,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '3 days',
  NULL
);

-- 4. VÉRIFICATION DES DONNÉES INSÉRÉES

-- Voir les utilisateurs:
SELECT '=== UTILISATEURS ===' as info;
SELECT id, email, first_name, last_name, role, is_blocked FROM users ORDER BY id;

-- Voir les signalements:
SELECT '' as info;
SELECT '=== SIGNALEMENTS ===' as info;
SELECT id, title, status, latitude, longitude, surface_area, budget, reporter_id FROM road_issues ORDER BY id;

-- Statistiques:
SELECT '' as info;
SELECT '=== STATISTIQUES ===' as info;
SELECT 
  COUNT(*) as total_issues,
  COUNT(CASE WHEN status = 'NEW' THEN 1 END) as new_issues,
  COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress,
  COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed,
  SUM(surface_area) as total_surface,
  SUM(budget) as total_budget
FROM road_issues;
