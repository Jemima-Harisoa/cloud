-- ============================================
-- Données de test - Identity Provider
-- ============================================

-- NETTOYER LES DONNÉES EXISTANTES
TRUNCATE TABLE road_issues, sessions, users RESTART IDENTITY CASCADE;

-- ============================================
-- 1. UTILISATEURS DE TEST
-- ============================================
-- Note: Les mots de passe sont hachés avec BCrypt
-- Format: $2a$10$... (BCrypt avec 10 rounds)

-- Mot de passe pour tous: "Password123!"
-- Hash BCrypt: $2a$10$iayay4dxDl20Ew3rYZetP.rHyLbs6veopw1lpc0w2wDYeDMTLADqK

INSERT INTO users (email, password, first_name, last_name, phone_number, role, is_active, is_blocked, failed_login_attempts, created_at, updated_at, last_login)
VALUES
-- Manager (gestionnaire des travaux)
(
  'manager@roadworks.mg',
  '$2a$10$iayay4dxDl20Ew3rYZetP.rHyLbs6veopw1lpc0w2wDYeDMTLADqK', -- Password123!
  'Rakoto',
  'ANDRIANASOLO',
  '+261 34 12 345 67',
  'MANAGER',
  true,
  false,
  0,
  NOW() - INTERVAL '6 months',
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '1 hour'
),

-- Utilisateur actif (signale régulièrement des problèmes)
(
  'jean.rasoa@gmail.com',
  '$2a$10$iayay4dxDl20Ew3rYZetP.rHyLbs6veopw1lpc0w2wDYeDMTLADqK', -- Password123!
  'Jean',
  'RASOA',
  '+261 32 11 222 33',
  'USER',
  true,
  false,
  0,
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),

-- Utilisateur récent
(
  'marie.ravelo@yahoo.fr',
  '$2a$10$iayay4dxDl20Ew3rYZetP.rHyLbs6veopw1lpc0w2wDYeDMTLADqK', -- Password123!
  'Marie',
  'RAVELO',
  '+261 33 44 555 66',
  'USER',
  true,
  false,
  0,
  NOW() - INTERVAL '2 weeks',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
),

-- Visiteur (compte de base)
(
  'visitor.test@example.com',
  '$2a$10$iayay4dxDl20Ew3rYZetP.rHyLbs6veopw1lpc0w2wDYeDMTLADqK', -- Password123!
  'Test',
  'VISITOR',
  '+261 34 99 888 77',
  'VISITOR',
  true,
  false,
  0,
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 week',
  NULL
),

-- Utilisateur bloqué (trop de tentatives échouées)
(
  'blocked.user@test.mg',
  '$2a$10$iayay4dxDl20Ew3rYZetP.rHyLbs6veopw1lpc0w2wDYeDMTLADqK', -- Password123!
  'Blocked',
  'USER',
  '+261 32 77 666 55',
  'USER',
  false,
  true,
  5,
  NOW() - INTERVAL '1 month',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '1 week'
);

-- ============================================
-- 2. SIGNALEMENTS DE PROBLÈMES DE ROUTE
-- ============================================
-- Coordonnées réelles d'Antananarivo, Madagascar
-- Centre ville: -18.8792, 47.5079

INSERT INTO road_issues (latitude, longitude, description, status, surface_m2, budget, company_name, photo_url, reporter_id, created_at, updated_at, synced_to_firebase)
VALUES

-- NOUVEAUX SIGNALEMENTS (NEW)
(
  -18.8792,
  47.5079,
  'Nid de poule dangereux Avenue de l''Indépendance, en face du Palais de la Reine. Trou profond d''environ 30cm qui endommage les véhicules.',
  'NOUVEAU',
  3.5,
  180000.00,
  NULL,
  '/uploads/photos/pothole_independence_001.jpg',
  2,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days',
  false
),

(
  -18.8850,
  47.5100,
  'Chaussée affaissée Rue Rainibetsimisaraka, urgent car zone scolaire. Risque d''accident pour les enfants.',
  'NOUVEAU',
  12.0,
  450000.00,
  NULL,
  '/uploads/photos/subsidence_school_002.jpg',
  3,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  false
),

(
  -18.8910,
  47.5280,
  'Caniveau bouché causant des inondations. L''eau stagne sur la route lors des pluies.',
  'NOUVEAU',
  8.5,
  320000.00,
  NULL,
  NULL,
  2,
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '3 hours',
  false
),

-- TRAVAUX EN COURS (IN_PROGRESS)
(
  -18.8720,
  47.5150,
  'Route dégradée Boulevard de l''Europe sur 100 mètres. Multiples nids de poule nécessitant réfection complète.',
  'EN_COURS',
  85.0,
  2500000.00,
  'TRAVAUX PUBLICS MADAGASCAR',
  '/uploads/photos/boulevard_europe_003.jpg',
  2,
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '1 day',
  true
),

(
  -18.8650,
  47.5050,
  'Réparation des marquages au sol effacés Tunnel d''Ampefiloha. Passages piétons et lignes de circulation à refaire.',
  'EN_COURS',
  45.0,
  650000.00,
  'ENTREPRISE ROUTIÈRE NATIONALE',
  '/uploads/photos/tunnel_markings_004.jpg',
  3,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '2 days',
  true
),

(
  -18.8580,
  47.4980,
  'Trottoir cassé Avenue Grandidier, plusieurs dalles soulevées et dangereuses pour les piétons.',
  'EN_COURS',
  28.0,
  890000.00,
  'SARL BÂTIMENT PLUS',
  '/uploads/photos/sidewalk_grandidier_005.jpg',
  2,
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '3 days',
  true
),

-- TRAVAUX TERMINÉS (COMPLETED)
(
  -18.9000,
  47.5320,
  'Nid de poule Rue Rabearivelo. Réparé avec du goudron neuf.',
  'TERMINE',
  2.5,
  125000.00,
  'TRAVAUX COMMUNAUX',
  '/uploads/photos/rabearivelo_completed_006.jpg',
  2,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '5 days',
  true
),

(
  -18.8450,
  47.5200,
  'Réfection complète intersection Route Circulaire. Travaux de nivellement et asphaltage terminés.',
  'TERMINE',
  120.0,
  4200000.00,
  'COLAS MADAGASCAR',
  '/uploads/photos/circular_road_007.jpg',
  3,
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '7 days',
  true
),

(
  -18.8920,
  47.5400,
  'Réparation d''un petit trou Rue de Liège. Intervention rapide effectuée.',
  'TERMINE',
  1.8,
  75000.00,
  'SERVICE MUNICIPAL',
  NULL,
  2,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '15 days',
  true
),

-- SIGNALEMENTS ANNULÉS (CANCELLED)
(
  -18.8680,
  47.5120,
  'Affaissement signalé Avenue Général de Gaulle - Fausse alerte, simple ombre sur la chaussée.',
  'TERMINE',
  0,
  0,
  NULL,
  NULL,
  3,
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '11 days',
  false
),

-- SIGNALEMENTS RÉCENTS
(
  -18.8825,
  47.5185,
  'Fissure importante apparue après les pluies. Route nationale 2 direction Toamasina.',
  'NOUVEAU',
  15.5,
  780000.00,
  NULL,
  '/uploads/photos/rn2_fissure_008.jpg',
  3,
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours',
  false
),

(
  -18.8550,
  47.5350,
  'Dos d''âne endommagé près de l''hôpital. Ralentisseur cassé, dangereux pour les motos.',
  'NOUVEAU',
  6.0,
  250000.00,
  NULL,
  '/uploads/photos/speed_bump_009.jpg',
  2,
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '12 hours',
  false
);

-- ============================================
-- 3. SESSIONS ACTIVES
-- ============================================
-- Sessions JWT pour les utilisateurs connectés

INSERT INTO sessions (user_id, token, created_at, expires_at, is_active, ip_address, user_agent)
VALUES
-- Session du manager
(
  1,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IlJha290byBBTkRSSUFOQVNPTE8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTUxNjIzOTAyMn0.example_token_manager',
  NOW() - INTERVAL '2 hours',
  NOW() + INTERVAL '22 hours',
  true,
  '192.168.1.100',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),

-- Session de Jean RASOA
(
  2,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IkplYW4gUkFTT0EiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTUxNjIzOTAyMn0.example_token_user1',
  NOW() - INTERVAL '5 hours',
  NOW() + INTERVAL '19 hours',
  true,
  '102.16.32.45',
  'Mozilla/5.0 (Linux; Android 12; SM-G991B) Mobile Safari/537.36'
),

-- Session expirée (pour test)
(
  3,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6Ik1hcmllIFJBVkVMTyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNTE2MjM5MDIyfQ.example_token_expired',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day',
  false,
  '105.235.12.88',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
);

-- ============================================
-- 4. VÉRIFICATION DES DONNÉES
-- ============================================

-- Statistiques des utilisateurs
SELECT 
  '========== UTILISATEURS ==========' as section,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'MANAGER' THEN 1 END) as managers,
  COUNT(CASE WHEN role = 'USER' THEN 1 END) as users,
  COUNT(CASE WHEN role = 'VISITOR' THEN 1 END) as visitors,
  COUNT(CASE WHEN is_blocked = true THEN 1 END) as blocked_users
FROM users;

-- Liste des utilisateurs
SELECT 
  id,
  email,
  first_name || ' ' || last_name as full_name,
  role,
  is_active,
  is_blocked
FROM users
ORDER BY id;

-- Statistiques des signalements
SELECT 
  '========== SIGNALEMENTS ==========' as section,
  COUNT(*) as total_issues,
  COUNT(CASE WHEN status = 'NOUVEAU' THEN 1 END) as nouveaux,
  COUNT(CASE WHEN status = 'EN_COURS' THEN 1 END) as en_cours,
  COUNT(CASE WHEN status = 'TERMINE' THEN 1 END) as termines,
  ROUND(SUM(surface_m2)::numeric, 2) as surface_totale_m2,
  SUM(budget) as budget_total_ar
FROM road_issues;

-- Top 5 des signaleurs
SELECT 
  '========== TOP SIGNALEURS ==========' as section;

SELECT 
  u.first_name || ' ' || u.last_name as signaleur,
  u.email,
  COUNT(ri.id) as nb_signalements,
  ROUND(AVG(ri.surface_m2)::numeric, 2) as surface_moyenne_m2,
  SUM(ri.budget) as budget_total
FROM users u
LEFT JOIN road_issues ri ON u.id = ri.reporter_id
GROUP BY u.id, u.first_name, u.last_name, u.email
HAVING COUNT(ri.id) > 0
ORDER BY nb_signalements DESC;

-- Sessions actives
SELECT 
  '========== SESSIONS ACTIVES ==========' as section;

SELECT 
  s.id,
  u.email as user_email,
  u.role,
  s.is_active,
  s.created_at,
  s.expires_at,
  CASE 
    WHEN s.expires_at > NOW() THEN 'Valide'
    ELSE 'Expirée'
  END as statut
FROM sessions s
JOIN users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- Signalements par statut
SELECT 
  '========== DÉTAILS PAR STATUT ==========' as section;

SELECT 
  status,
  COUNT(*) as nombre,
  ROUND(SUM(surface_m2)::numeric, 2) as surface_totale,
  SUM(budget) as budget_total,
  ROUND(AVG(budget)::numeric, 2) as budget_moyen
FROM road_issues
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'NOUVEAU' THEN 1
    WHEN 'EN_COURS' THEN 2
    WHEN 'TERMINE' THEN 3
  END;
