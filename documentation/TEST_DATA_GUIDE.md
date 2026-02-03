# 📊 Données de Test - Guide Complet

**Date**: 26 janvier 2026  
**Fichier SQL**: `scripts/test-data.sql`

---

## 🔐 Credentials de Test

### Mot de Passe Universel pour Tous les Comptes
```
Mot de passe: password123
Hash BCrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7Oy3RB0DvgvB/wk4Q8H8/ire
```

---

## 👥 Comptes Utilisateurs Créés

### 1️⃣ UTILISATEUR NORMAL - Jean Dupont
```
Email:        jean.dupont@example.com
Mot de passe: password123
Rôle:         USER (Citoyen)
Téléphone:    +261 32 1234567
Statut:       ✅ Actif (non bloqué)
```
**Scénarios de test**: 
- Créer signalements
- Voir la carte
- Consulter stats

---

### 2️⃣ UTILISATEUR NORMAL - Marie Martin
```
Email:        marie.martin@example.com
Mot de passe: password123
Rôle:         USER (Citoyenne)
Téléphone:    +261 33 9876543
Statut:       ✅ Actif (non bloqué)
```
**Scénarios de test**:
- Multiple signalements (plus que Jean)
- Vérifier ses signalements

---

### 3️⃣ UTILISATEUR BLOQUÉ - Pierre Bernard
```
Email:        blocked.user@example.com
Mot de passe: password123
Rôle:         USER
Téléphone:    +261 34 5555555
Statut:       🔒 BLOQUÉ (après 3 tentatives)
```
**Scénarios de test**:
- Essayer de se connecter → Compte bloqué
- Manager débloque le compte
- Reconnexion réussit

---

### 4️⃣ MANAGER - Robert Durand (Gestionnaire Principal)
```
Email:        manager.antananarivo@example.com
Mot de passe: password123
Rôle:         MANAGER
Téléphone:    +261 32 1111111
Statut:       ✅ Actif
```
**Accès**:
- Dashboard manager complet
- Débloquer utilisateurs
- Voir tous les signalements
- Synchroniser Firebase
- Gestion statistiques

---

### 5️⃣ MANAGER - Sophie Laurent (Admin Seconde)
```
Email:        admin.roads@example.com
Mot de passe: password123
Rôle:         MANAGER
Téléphone:    +261 33 2222222
Statut:       ✅ Actif
```
**Accès**: Mêmes droits que Robert (accès complet)

---

## 🗺️ Signalements de Test (10 au total)

### Issue 1: 🚨 NOUVEAU - Nid de Poule
```
Titre:        Nid de poule Avenue de l'Indépendance
Signalant:    Jean Dupont
Localisation: -18.8747, 47.5292 (Centre-ville)
Statut:       NEW (Nouveau)
Surface:      2.5 m²
Budget:       50,000 Ar
Entreprise:   Voirie Antananarivo
Créé:         Il y a 5 jours
Description:  Grand nid de poule devant le marché, danger pour véhicules
```

---

### Issue 2: 🔨 EN COURS - Chaussée Défoncée
```
Titre:        Chaussée défoncée Rue Rainilaiarivony
Signalant:    Marie Martin
Localisation: -18.8756, 47.5310
Statut:       IN_PROGRESS (En cours)
Surface:      50.0 m²
Budget:       2,500,000 Ar (Gros travaux!)
Entreprise:   Entreprise BTP Solimena
Créé:         Il y a 10 jours
Mis à jour:   Il y a 3 jours
Description:  Section de 50m complètement dégradée. Besoin réfection complète.
```

---

### Issue 3: ✅ TERMINÉ - Trou Boulevard de l'Europe
```
Titre:        Trou dans Boulevard de l'Europe
Signalant:    Jean Dupont
Localisation: -18.8720, 47.5250 (Zone touristique)
Statut:       COMPLETED (Complété)
Surface:      5.0 m²
Budget:       150,000 Ar
Entreprise:   Maintenance Urbaine
Créé:         Il y a 20 jours
Complété:     Il y a 2 jours
Description:  Effondrement partiel, risque d'accident. Zone touristique.
```

---

### Issue 4: 🔨 EN COURS - Pavés Soulevés
```
Titre:        Pavés soulevés Rue Andohalo
Signalant:    Marie Martin
Localisation: -18.8800, 47.5200
Statut:       IN_PROGRESS (En cours)
Surface:      15.0 m²
Budget:       300,000 Ar
Entreprise:   Services Municipaux
Créé:         Il y a 8 jours
Mis à jour:   Il y a 1 jour
Description:  Les pavés se soulèvent progressivement, passants trébuchent
```

---

### Issue 5: 🔨 EN COURS - Fuite d'Eau
```
Titre:        Dégâts causés par fuite d'eau
Signalant:    Jean Dupont
Localisation: -18.8680, 47.5330
Statut:       IN_PROGRESS (En cours)
Surface:      30.0 m²
Budget:       800,000 Ar
Entreprise:   Eau et Assainissement Tn
Créé:         Il y a 3 jours
Description:  Fuite d'eau principale a endommagé route. Urgence sanitaire.
```

---

### Issue 6: 🚨 NOUVEAU - Affaissement Rue Joffre
```
Titre:        Affaissement de la chaussée Rue Joffre
Signalant:    Marie Martin
Localisation: -18.8750, 47.5180
Statut:       NEW (Nouveau)
Surface:      8.0 m²
Budget:       400,000 Ar
Entreprise:   Géotechnique Experts
Créé:         Il y a 1 jour
Description:  Affaissement progressif indiquant un vide sous-terrain. À investiguer.
```

---

### Issue 7: 🚨 NOUVEAU URGENT - Pont du Roi
```
Titre:        Structure du Pont du Roi dégradée
Signalant:    Jean Dupont
Localisation: -18.8650, 47.5100
Statut:       NEW (Nouveau) **URGENT**
Surface:      20.0 m²
Budget:       5,000,000 Ar (Très gros budget!)
Entreprise:   Travaux Publics Madagascar
Créé:         Il y a 2 jours
Description:  Fissures dans les piliers, nécessite expertise structurale. URGENT.
```

---

### Issue 8: ✅ TERMINÉ - Marquage Routier
```
Titre:        Marquage routier effacé - Sécurité
Signalant:    Marie Martin
Localisation: -18.8730, 47.5400
Statut:       COMPLETED (Complété)
Surface:      100.0 m² (Grande surface!)
Budget:       150,000 Ar
Entreprise:   Signalisation Urbaine
Créé:         Il y a 15 jours
Complété:     Il y a 5 jours
Description:  Les lignes blanches et passages piétons ne sont plus visibles
```

---

### Issue 9: 🔨 EN COURS - Débris Routier
```
Titre:        Débris et gravats sur la chaussée
Signalant:    Jean Dupont
Localisation: -18.8770, 47.5320
Statut:       IN_PROGRESS (En cours)
Surface:      3.0 m²
Budget:       75,000 Ar
Entreprise:   Nettoyage Urbain
Créé:         Il y a 6 heures (TRÈS RÉCENT!)
Description:  Construction abandonnée, débris bloquent la circulation
```

---

### Issue 10: 🚨 NOUVEAU - Route Inondée
```
Titre:        Route complètement inondée - Saison pluies
Signalant:    Marie Martin
Localisation: -18.8900, 47.5450
Statut:       NEW (Nouveau)
Surface:      25.0 m²
Budget:       600,000 Ar
Entreprise:   Drainage et Assainissement
Créé:         Il y a 12 heures (TRÈS RÉCENT!)
Description:  Section non drainée, eau stagne depuis 3 jours
```

---

## 📊 Statistiques Attendues

Après insertion des données:

```
TOTAL SIGNALEMENTS:        10
├─ Nouveaux (NEW):         4 signalements
├─ En cours (IN_PROGRESS): 4 signalements
└─ Complétés (COMPLETED):  2 signalements

SUPERFICIE TOTALE:         258.5 m²
BUDGET TOTAL:              9,225,000 Ar
POURCENTAGE COMPLÉTÉS:     20%

DISTRIBUTION PAR SIGNALANT:
├─ Jean Dupont:            5 signalements (NEW: 1, IN_PROGRESS: 2, COMPLETED: 1)
└─ Marie Martin:            5 signalements (NEW: 3, IN_PROGRESS: 2, COMPLETED: 2)
```

---

## 🧪 Scénarios de Test Recommandés

### Scénario 1: Test Authentification
```
1. Se connecter avec: jean.dupont@example.com / password123
2. Vérifier le token JWT dans localStorage
3. Se déconnecter
4. Vérifier que le token est supprimé
5. Essayer d'accéder à la map → Redirection login
```

### Scénario 2: Test Blocage de Compte
```
1. Se connecter avec: blocked.user@example.com / password123
2. Message: "Compte bloqué. Veuillez contacter un manager."
3. Se connecter en tant que manager
4. Débloquer le compte dans le Dashboard
5. Vérifier: blocked.user peut maintenant se connecter
```

### Scénario 3: Test Carte et Filtres
```
1. Se connecter (USER)
2. Voir tous les 10 marqueurs sur la carte
3. Filtrer par: Status = "NEW" → 4 marqueurs visibles
4. Filtrer par: Status = "IN_PROGRESS" → 4 marqueurs visibles
5. Filtrer par: Status = "COMPLETED" → 2 marqueurs visibles
6. Voir stats en temps réel
```

### Scénario 4: Test Dashboard Manager
```
1. Se connecter en tant que manager: manager.antananarivo@example.com / password123
2. Onglet "Aperçu": Voir statistiques
   - Total: 10, Nouveaux: 4, Budget total: 9,225,000 Ar
3. Onglet "Signalements": Voir la liste
4. Onglet "Utilisateurs bloqués": Voir Pierre Bernard bloqué
5. Débloquer Pierre Bernard
6. Vérifier qu'il peut se connecter
```

### Scénario 5: Test Création de Signalement
```
1. Se connecter avec: jean.dupont@example.com
2. Créer nouveau signalement:
   - Titre: "Test Nid de Poule"
   - Description: "Testant la création"
   - Localisation: Cliquer sur carte
   - Surface: 5 m²
   - Budget: 100,000 Ar
3. Vérifier qu'il apparaît sur la carte
4. Se connecter en tant que manager
5. Vérifier que le nouveau signalement est visible
```

### Scénario 6: Test Synchronisation Firebase
```
1. Se connecter en tant que manager
2. Cliquer sur "Synchroniser avec Firebase"
3. Vérifier que les données sont mises à jour
4. Vérifier les logs du backend
```

---

## 📥 Installation des Données

### Option 1: Via PostgreSQL CLI (Recommandé)

```bash
# Connectez-vous à PostgreSQL
sudo -u postgres psql identity_provider

# Exécutez le script
\i /chemin/vers/scripts/test-data.sql

# Vérifiez l'insertion
SELECT COUNT(*) FROM users;        -- Doit afficher 5
SELECT COUNT(*) FROM road_issues;  -- Doit afficher 10
```

### Option 2: Via DBeaver
```
1. Clic droit sur "identity_provider" database
2. SQL Editor → Open SQL Script
3. Copier le contenu de test-data.sql
4. F5 ou Execute
```

### Option 3: Via Command Line
```bash
# Depuis le répertoire cloud/
sudo -u postgres psql identity_provider < scripts/test-data.sql
```

---

## 🔍 Requêtes de Vérification

Après insertion, vérifiez les données:

```sql
-- Voir tous les utilisateurs
SELECT id, email, role, is_blocked FROM users;

-- Voir tous les signalements
SELECT id, title, status, budget FROM road_issues;

-- Voir les signalements par utilisateur
SELECT u.email, COUNT(r.id) as nombre_signalements
FROM users u
LEFT JOIN road_issues r ON u.id = r.reporter_id
GROUP BY u.id, u.email;

-- Voir les statistiques
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN status='NEW' THEN 1 ELSE 0 END) as new,
  SUM(CASE WHEN status='IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN status='COMPLETED' THEN 1 ELSE 0 END) as completed
FROM road_issues;
```

---

## ✅ Checklist Avant de Tester

- [ ] PostgreSQL est en cours d'exécution
- [ ] Base de données `identity_provider` existe
- [ ] Backend Java est démarré (port 8080)
- [ ] Script `test-data.sql` a été exécuté
- [ ] 5 utilisateurs sont créés dans la base
- [ ] 10 signalements sont visibles
- [ ] Frontend web est démarré (port 3000)
- [ ] Vous pouvez accéder à http://localhost:3000

---

## 🎯 Points de Test Critiques

| Fonctionnalité | Utilisateur | Résultat Attendu |
|---|---|---|
| Login | jean.dupont@example.com | ✅ Connexion réussie, redirection Map |
| Login Bloqué | blocked.user@example.com | ❌ "Compte bloqué" |
| Déblocage | manager (Robert) | ✅ Pierre peut se connecter |
| Voir Carte | USER | ✅ 10 marqueurs visibles |
| Filtrer NEW | USER | ✅ 4 marqueurs visibles |
| Créer Signalement | USER | ✅ Nouveau marqueur apparaît |
| Dashboard Manager | manager | ✅ Stats correctes (9,225,000 Ar) |
| Débloquer Utilisateur | manager | ✅ Utilisateur peut se connecter |

---

**Status**: ✅ Données de test complètes et prêtes pour les tests!
