# 📋 Données de Test - Identity Provider

## 👥 Utilisateurs de Test

### 1️⃣ Utilisateur Manager (Administrateur)
```
Email: manager@example.com
Mot de passe: Manager123!
Nom: Jean
Prénom: Dupont
Téléphone: +261 20 22 222 222
Rôle: MANAGER
```

### 2️⃣ Utilisateur Standard (USER)
```
Email: user@example.com
Mot de passe: User123!
Nom: Marie
Prénom: Martin
Téléphone: +261 33 33 333 333
Rôle: USER
```

### 3️⃣ Deuxième Utilisateur (USER)
```
Email: reporter@example.com
Mot de passe: Reporter123!
Nom: Pierre
Prénom: Dubois
Téléphone: +261 34 44 444 444
Rôle: USER
```

### 4️⃣ Visiteur (VISITOR - Pas de compte)
```
Accès: Lecture seule
Pas de connexion requise
Voir la carte et les signalements publics
```

---

## 🧪 Scénarios de Test

### Scénario 1: Inscription d'un nouvel utilisateur
**Objectif**: Tester la création de compte
```
POST http://localhost:8080/api/auth/register
Body:
{
  "email": "newuser@example.com",
  "password": "NewUser123!",
  "firstName": "Alice",
  "lastName": "Rousseau",
  "phoneNumber": "+261 32 32 323 232"
}

Résultat attendu: 
- Code 201 (Created)
- Message: "User registered successfully"
- L'utilisateur peut ensuite se connecter
```

---

### Scénario 2: Connexion (LOGIN)
**Objectif**: Tester l'authentification JWT

#### A) Connexion réussie
```
POST http://localhost:8080/api/auth/login
Body:
{
  "email": "user@example.com",
  "password": "User123!"
}

Résultat attendu:
- Code 200 (OK)
- Réponse:
{
  "id": 2,
  "email": "user@example.com",
  "firstName": "Marie",
  "lastName": "Martin",
  "phoneNumber": "+261 33 33 333 333",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

#### B) Connexion avec mauvais mot de passe
```
POST http://localhost:8080/api/auth/login
Body:
{
  "email": "user@example.com",
  "password": "WrongPassword123!"
}

Résultat attendu:
- Code 401 (Unauthorized)
- Message: "Invalid credentials"
- Tentative échouée: 1/3
```

#### C) Blocage après 3 tentatives échouées
```
Effectuer 3 connexions échouées de suite
À la 3ème tentative:
- Code 401
- Message: "Account is locked. Try again later"
- failed_login_attempts = 3 en BD
- is_blocked = true en BD
```

---

### Scénario 3: Déblocage d'un utilisateur (Manager)
**Objectif**: Tester la gestion des comptes bloqués

```
1. Se connecter comme MANAGER:
POST http://localhost:8080/api/auth/login
{
  "email": "manager@example.com",
  "password": "Manager123!"
}
→ Récupérer le TOKEN

2. Débloquer un utilisateur:
POST http://localhost:8080/api/auth/unblock/2
Header: Authorization: Bearer TOKEN

Résultat attendu:
- Code 200 (OK)
- is_blocked = false en BD
- failed_login_attempts = 0 en BD
- Message: "User unblocked successfully"
```

---

### Scénario 4: Créer un signalement (Road Issue)
**Objectif**: Tester la création de signalements

#### A) Créer un signalement simple
```
POST http://localhost:8080/api/road-issues?reporterId=2
Header: Authorization: Bearer TOKEN
Body:
{
  "latitude": -18.8747,
  "longitude": 47.5292,
  "description": "Nid de poule dangereux sur la rue de Tananarive",
  "surfaceM2": 15.5,
  "budget": 5000000.00,
  "companyName": "Entreprise Route Malagasy"
}

Résultat attendu:
- Code 201 (Created)
- Signalement créé avec:
  - status: NOUVEAU
  - createdAt: maintenant
  - reporter_id: 2
```

#### B) Créer plusieurs signalements (pour tester la carte)
```
Signalement 2:
- latitude: -18.8772, longitude: 47.5206
- description: "Chaussée effondrée Avenue Kely"
- surfaceM2: 25.0, budget: 8000000.00

Signalement 3:
- latitude: -18.8850, longitude: 47.5400
- description: "Pont endommagé Route d'Analamanga"
- surfaceM2: 120.0, budget: 50000000.00

Signalement 4:
- latitude: -18.8600, longitude: 47.5100
- description: "Manque d'asphalte Rue d'Ampefiloha"
- surfaceM2: 8.0, budget: 3000000.00
```

---

### Scénario 5: Afficher les signalements
**Objectif**: Tester la lecture et les statistiques

#### A) Récupérer tous les signalements
```
GET http://localhost:8080/api/road-issues
Header: Authorization: Bearer TOKEN

Résultat attendu:
- Code 200
- Liste de tous les signalements créés
- Chaque signalement contient: id, latitude, longitude, description, status, etc.
```

#### B) Filtrer par statut
```
GET http://localhost:8080/api/road-issues?status=NOUVEAU
Header: Authorization: Bearer TOKEN

Résultat attendu:
- Code 200
- Seulement les signalements avec status = NOUVEAU
```

#### C) Filtrer par reporterId
```
GET http://localhost:8080/api/road-issues?reporterId=2
Header: Authorization: Bearer TOKEN

Résultat attendu:
- Code 200
- Seulement les signalements créés par l'utilisateur 2
```

#### D) Obtenir les statistiques
```
GET http://localhost:8080/api/road-issues/stats
Header: Authorization: Bearer TOKEN

Résultat attendu:
- Code 200
- Réponse:
{
  "totalIssues": 4,
  "totalSurfaceM2": 168.5,
  "totalBudget": 66000000.00,
  "completedIssues": 0,
  "pendingIssues": 4
}
```

---

### Scénario 6: Mettre à jour un signalement (Manager)
**Objectif**: Tester la modification du statut

```
PUT http://localhost:8080/api/road-issues/1
Header: Authorization: Bearer TOKEN (Manager)
Body:
{
  "status": "EN_COURS",
  "companyName": "Nouvelle Entreprise Construction"
}

Résultat attendu:
- Code 200
- Signalement modifié:
  - status = EN_COURS
  - companyName = "Nouvelle Entreprise Construction"
  - updatedAt = maintenant
```

---

### Scénario 7: Supprimer un signalement (Manager)
**Objectif**: Tester la suppression

```
DELETE http://localhost:8080/api/road-issues/1
Header: Authorization: Bearer TOKEN (Manager)

Résultat attendu:
- Code 204 (No Content)
- Signalement supprimé de la BD
```

---

### Scénario 8: Déconnexion (LOGOUT)
**Objectif**: Tester la fin de session

```
POST http://localhost:8080/api/auth/logout
Header: Authorization: Bearer TOKEN

Résultat attendu:
- Code 200
- Message: "Logged out successfully"
- Session marquée comme inactive en BD
- Token plus valide pour futures requêtes
```

---

### Scénario 9: Test de la carte (Frontend Web)
**Objectif**: Vérifier l'intégration frontend

```
1. Aller sur http://localhost:3000
2. Cliquer sur "Voir la carte"
3. Vérifier que:
   - La carte affiche Antananarivo
   - Les 4 marqueurs sont visibles
   - Cliquer sur un marqueur affiche les détails
   - Le filtre par statut fonctionne
   - Les statistiques s'affichent à droite
```

---

### Scénario 10: Dashboard Manager (Frontend Web)
**Objectif**: Tester le dashboard administrateur

```
1. Se connecter avec:
   - Email: manager@example.com
   - Mot de passe: Manager123!

2. Aller sur le Dashboard Manager
3. Vérifier les 3 onglets:
   - Vue d'ensemble: Stats globales
   - Signalements: Table avec tous les signalements
   - Utilisateurs bloqués: Liste des comptes verrouillés
4. Cliquer sur "Débloquer" pour un utilisateur bloqué
5. Cliquer sur "Synchroniser Firebase"
```

---

## 📊 Colonnes de la Base de Données

### Table: users
```
id (BIGSERIAL PRIMARY KEY)
email (VARCHAR UNIQUE)
password (VARCHAR - hashé BCrypt)
first_name (VARCHAR)
last_name (VARCHAR)
phone_number (VARCHAR)
role (VARCHAR: VISITOR, USER, MANAGER)
is_blocked (BOOLEAN)
failed_login_attempts (INTEGER)
created_at (TIMESTAMP)
last_login (TIMESTAMP)
```

### Table: sessions
```
id (BIGSERIAL PRIMARY KEY)
user_id (BIGINT FOREIGN KEY)
token (VARCHAR UNIQUE)
is_active (BOOLEAN)
expires_at (TIMESTAMP)
```

### Table: road_issues
```
id (BIGSERIAL PRIMARY KEY)
latitude (DOUBLE PRECISION)
longitude (DOUBLE PRECISION)
description (VARCHAR)
status (VARCHAR: NOUVEAU, EN_COURS, TERMINE)
surface_m2 (DOUBLE PRECISION)
budget (DOUBLE PRECISION)
company_name (VARCHAR)
photo_url (VARCHAR)
reporter_id (BIGINT FOREIGN KEY)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
firebase_id (VARCHAR)
synced_to_firebase (BOOLEAN)
```

---

## 🛠️ Commandes Utiles

### Vérifier les utilisateurs en BD
```bash
sudo -u postgres psql identity_provider -c "SELECT id, email, role, is_blocked FROM users;"
```

### Vérifier les signalements
```bash
sudo -u postgres psql identity_provider -c "SELECT id, description, status, reporter_id FROM road_issues;"
```

### Vérifier les sessions actives
```bash
sudo -u postgres psql identity_provider -c "SELECT id, user_id, is_active FROM sessions WHERE is_active = true;"
```

### Réinitialiser un utilisateur bloqué
```bash
sudo -u postgres psql identity_provider -c "UPDATE users SET is_blocked = false, failed_login_attempts = 0 WHERE id = 2;"
```

### Supprimer tous les signalements (reset)
```bash
sudo -u postgres psql identity_provider -c "DELETE FROM road_issues;"
```

### Supprimer tous les utilisateurs (reset complet)
```bash
sudo -u postgres psql identity_provider -c "DELETE FROM sessions; DELETE FROM road_issues; DELETE FROM users;"
```

---

## ✅ Checklist de Test

- [ ] Inscription d'un nouvel utilisateur
- [ ] Connexion avec bonnes identifiants
- [ ] Tentative de connexion avec mauvais mot de passe (3x)
- [ ] Vérification du blocage du compte
- [ ] Déblocage du compte par Manager
- [ ] Créer 4 signalements à différentes coordonnées
- [ ] Voir les signalements sur la carte
- [ ] Modifier un signalement (change status)
- [ ] Voir les statistiques
- [ ] Filtrer par statut
- [ ] Tester le Dashboard Manager
- [ ] Déconnexion
- [ ] Vérifier les données en BD

---

## 🎯 Points Clés

1. **JWT Token**: Valide 24h, stocké dans localStorage
2. **Blocage**: 3 tentatives échouées = blocage 1h
3. **Rôles**: VISITOR (lecture), USER (créer/voir), MANAGER (tout)
4. **Coordonnées**: Antananarivo [-18.8747, 47.5292]
5. **Statuts**: NOUVEAU → EN_COURS → TERMINE

---

**Bon testing! 🚀**
