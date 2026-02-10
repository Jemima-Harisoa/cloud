# 👥 Données de Test - Utilisateurs et Scénarios

## 📋 Utilisateurs de Test

### 1. **Administrateur / Manager**
```
Email:    manager@example.com
Password: Manager@123
Rôle:     MANAGER
Statut:   Actif
```
**Permissions**: 
- ✅ Dashboard complet
- ✅ Gérer tous les signalements
- ✅ Débloquer les utilisateurs
- ✅ Voir les statistiques
- ✅ Synchroniser Firebase

---

### 2. **Utilisateur Validé (USER)**
```
Email:    user@example.com
Password: User@123456
Rôle:     USER
Statut:   Actif
```
**Permissions**:
- ✅ Voir la carte
- ✅ Créer des signalements
- ✅ Voir les statistiques
- ❌ Accès admin

---

### 3. **Deuxième Utilisateur**
```
Email:    john.doe@example.com
Password: JohnDoe@2025
Rôle:     USER
Statut:   Actif
```
**Permissions**: Même que USER

---

### 4. **Visiteur (Sans Compte)**
```
Status: VISITOR (pas d'authentification)
```
**Permissions**:
- ✅ Voir la carte
- ❌ Créer signalements
- ❌ Accès dashboard
- ⚠️ Redirection vers login si création

---

## 🧪 Scénarios de Test

### **SCÉNARIO 1: Inscription et Première Connexion**

**Objectif**: Vérifier le flux d'inscription complet

**Étapes**:
1. Accéder à http://localhost:3000
2. Cliquer sur "Register" 
3. Remplir le formulaire:
   ```
   Email:        newtester@gmail.com
   Password:     TestPass@123
   Confirm Pwd:  TestPass@123
   First Name:   Jean
   Last Name:    Test
   Phone:        +261 34 12 34 567
   ```
4. Cliquer "Register"

**Résultats Attendus**:
- ✅ Message de succès
- ✅ Redirection vers Login
- ✅ Utilisateur créé en base de données
- ✅ Mot de passe hashé (pas visible en clair)

**Vérification en Base**:
```sql
SELECT id, email, first_name, last_name, role, is_blocked FROM users 
WHERE email = 'newtester@gmail.com';
```

---

### **SCÉNARIO 2: Connexion Réussie (USER)**

**Objectif**: Vérifier l'authentification JWT

**Étapes**:
1. Aller à http://localhost:3000/login
2. Remplir:
   ```
   Email:    user@example.com
   Password: User@123456
   ```
3. Cliquer "Login"

**Résultats Attendus**:
- ✅ Token JWT généré et stocké dans localStorage
- ✅ Redirection vers `/map`
- ✅ Affichage de la carte
- ✅ Sidebar avec stats visibles

**Vérification**:
- Ouvrir DevTools (F12)
- Aller dans Application > LocalStorage > http://localhost:3000
- Vérifier les clés:
  ```
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  user: {"id": 2, "email": "user@example.com", "role": "USER"}
  ```

---

### **SCÉNARIO 3: Accès Manager Dashboard**

**Objectif**: Vérifier les droits d'accès MANAGER

**Étapes**:
1. Connexion avec manager@example.com / Manager@123
2. Cliquer sur "Manager Dashboard"
3. Voir les trois onglets: Overview, Issues, Users

**Résultats Attendus**:
- ✅ Tableau de bord avec statistiques
- ✅ Liste complète des signalements
- ✅ Section "Blocked Users" avec bouton débloquer
- ✅ Bouton "Sync with Firebase"

**Accès Refusé si**:
- Non authentifié (USER):
  - Message d'erreur 403 ou redirection login
  - Accès à /manager-dashboard → redirection vers /map

---

### **SCÉNARIO 4: Créer un Signalement (NEW ISSUE)**

**Objectif**: Vérifier la création de signalement

**Étapes**:
1. Se connecter avec user@example.com
2. Aller sur la carte
3. Cliquer sur "Report New Issue" ou bouton flottant
4. Remplir le formulaire:
   ```
   Title:        Nid de poule rue de la Paix
   Description:  Grand trou d'environ 2m de largeur
   Latitude:     -18.8747
   Longitude:    47.5292
   Surface:      4.5  (en m²)
   Budget:       150000  (en Ariary)
   Company:      Public Works
   Status:       NEW
   ```
5. Cliquer "Create"

**Résultats Attendus**:
- ✅ Nouveau marqueur sur la carte
- ✅ Stats mises à jour
- ✅ Notification de succès
- ✅ Signalement visible dans la liste

**Vérification en Base**:
```sql
SELECT id, title, status, latitude, longitude, surface_area, reporter_id 
FROM road_issues 
ORDER BY created_at DESC LIMIT 1;
```

---

### **SCÉNARIO 5: Filtrer les Signalements**

**Objectif**: Vérifier les filtres de statut

**Étapes**:
1. Aller sur la carte
2. Cliquer sur le bouton "Status" avec les options:
   - NEW
   - IN_PROGRESS
   - COMPLETED

**Résultats Attendus**:
- ✅ Carte affiche seulement les signalements du statut sélectionné
- ✅ Stats mises à jour selon le filtre
- ✅ Liste des issues filtrée

**Test des Filtres**:
```
Filtre: NEW       → Affiche seulement statut NEW
Filtre: IN_PROGRESS → Affiche seulement statut IN_PROGRESS
Filtre: COMPLETED → Affiche seulement statut COMPLETED
Filtre: ALL       → Affiche tous les signalements
```

---

### **SCÉNARIO 6: Blocage Automatique après 3 Tentatives**

**Objectif**: Vérifier le système de sécurité (account lockout)

**Étapes**:
1. Aller à http://localhost:3000/login
2. Essayer 3 fois avec:
   ```
   Email:    user@example.com
   Password: MAUVAIS_MOT_DE_PASSE (3 fois)
   ```
3. Après la 3e tentative, essayer une 4e fois

**Résultats Attendus**:
- Tentative 1-3: ❌ "Invalid credentials"
- Tentative 4: ❌ "Account locked. Contact admin."
- Le bouton login reste désactivé

**Vérification en Base**:
```sql
SELECT id, email, is_blocked, failed_login_attempts FROM users 
WHERE email = 'user@example.com';
-- Doit afficher: is_blocked = true, failed_login_attempts = 3
```

---

### **SCÉNARIO 7: Déblocage par Manager**

**Objectif**: Vérifier la fonction déblocage admin

**Étapes**:
1. Se connecter comme manager@example.com
2. Aller au Dashboard > onglet "Users"
3. Voir la liste des utilisateurs bloqués
4. Cliquer "Unlock" pour user@example.com

**Résultats Attendus**:
- ✅ Utilisateur retiré de la liste des bloqués
- ✅ Notification de succès
- ✅ user@example.com peut se reconnecter

**Vérification en Base** (avant déblocage):
```sql
UPDATE users SET is_blocked = true, failed_login_attempts = 3 
WHERE email = 'user@example.com';

-- Après déblocage:
SELECT is_blocked, failed_login_attempts FROM users 
WHERE email = 'user@example.com';
-- Doit afficher: is_blocked = false, failed_login_attempts = 0
```

---

### **SCÉNARIO 8: Mise à jour du Profil**

**Objectif**: Vérifier la modification des données utilisateur

**Étapes**:
1. Se connecter avec user@example.com
2. Cliquer sur "Profile" ou icône utilisateur
3. Modifier:
   ```
   First Name:   Jean
   Last Name:    Utilisateur
   Phone:        +261 32 54 32 165
   New Password: NewPass@2025
   ```
4. Cliquer "Save"

**Résultats Attendus**:
- ✅ Profil mis à jour
- ✅ Message de succès
- ✅ Token JWT toujours valide
- ✅ Peut se reconnecter avec ancien mot de passe? ❌ NON
- ✅ Peut se reconnecter avec nouveau mot de passe? ✅ OUI

---

### **SCÉNARIO 9: Pagination et Statistiques**

**Objectif**: Vérifier l'affichage des stats

**Étapes**:
1. Aller sur la carte avec manager
2. Vérifier le sidebar avec les stats:
   ```
   Total Issues: [nombre]
   Total Surface: [m²]
   Total Budget: [Ar]
   Completed: [%]
   ```

**Résultats Attendus**:
- ✅ Stats correctes selon les signalements
- ✅ Mise à jour en temps réel après création
- ✅ Filtres changent les stats

**Calculs Attendus**:
```
Total Issues = COUNT(*) de tous les signalements
Total Surface = SUM(surface_area)
Total Budget = SUM(budget)
Completed % = (COUNT(status='COMPLETED') / COUNT(*)) * 100
```

---

### **SCÉNARIO 10: Déconnexion et Session Expirée**

**Objectif**: Vérifier la gestion des sessions

**Étapes**:
1. Se connecter avec user@example.com
2. Cliquer "Logout" dans le menu
3. Vérifier redirection vers /login

**Après Déconnexion**:
- ✅ Token supprimé du localStorage
- ✅ User data supprimée du localStorage
- ✅ Accès à /map → redirection vers /login
- ✅ Nouveau token génération à la prochaine connexion

**Vérification du Token Expiré**:
```
Changer le token dans localStorage à un token invalide
Cliquer sur un bouton qui nécessite l'API
Résultat attendu: Redirection auto vers /login
```

---

## 🗄️ Vérification en Base de Données

### Requête pour voir tous les utilisateurs:
```sql
SELECT id, email, first_name, last_name, role, is_blocked, failed_login_attempts, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Voir tous les signalements:
```sql
SELECT id, title, status, latitude, longitude, surface_area, budget, created_at 
FROM road_issues 
ORDER BY created_at DESC;
```

### Voir les sessions actives:
```sql
SELECT s.id, s.token, s.is_active, s.expires_at, u.email 
FROM sessions s 
JOIN users u ON s.user_id = u.id 
WHERE s.is_active = true;
```

### Statistiques:
```sql
SELECT 
  COUNT(*) as total_issues,
  SUM(surface_area) as total_surface,
  SUM(budget) as total_budget,
  COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_count
FROM road_issues;
```

---

## 🔐 Notes de Sécurité pour Tests

⚠️ **Important**: Ces mots de passe sont pour test uniquement!

En production:
- ✅ Utiliser des mots de passe forts
- ✅ Changer le JWT_SECRET dans application.yml
- ✅ Utiliser HTTPS (pas HTTP)
- ✅ Configurer CORS pour domaines approuvés
- ✅ Activer rate limiting
- ✅ Configurer HTTPS certificate

---

## 📱 Tester via CURL (Terminal)

### Inscription:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl@test.com",
    "password": "CurlTest@123",
    "firstName": "Test",
    "lastName": "Curl",
    "phoneNumber": "+261 XX XXX XXX"
  }'
```

### Connexion:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "User@123456"
  }'
```

### Créer un Signalement (remplacer TOKEN):
```bash
curl -X POST http://localhost:8080/api/road-issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_JWT_ICI" \
  -d '{
    "title": "Test Issue",
    "description": "Test via curl",
    "latitude": -18.8747,
    "longitude": 47.5292,
    "surfaceArea": 10,
    "budget": 200000,
    "company": "Test Co"
  }'
```

### Obtenir les Signalements:
```bash
curl http://localhost:8080/api/road-issues \
  -H "Authorization: Bearer TOKEN_JWT_ICI"
```

---

## ✅ Checklist de Validation Complète

- [ ] Inscription d'un nouvel utilisateur réussie
- [ ] Connexion avec les bonnes credentials
- [ ] Token JWT stocké en localStorage
- [ ] Carte affichée après connexion
- [ ] Création de signalement
- [ ] Filtrage par statut fonctionne
- [ ] Statistiques correctes
- [ ] 3 tentatives = blocage
- [ ] Manager peut débloquer
- [ ] Modification profil fonctionne
- [ ] Déconnexion efface le token
- [ ] Données en base correctes

---

**🎯 Maintenant, tu peux tester chaque scénario pour valider le système!**
