# 📱 Documentation - Module Web - Système de Suivi des Travaux Routiers

**Date**: 2 février 2026  
**Projet**: Identity Provider - Gestion des Travaux Routiers  
**Plateforme**: Web (React + Leaflet)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [3 Profils Utilisateurs](#3-profils-utilisateurs)
3. [Fonctionnalités Visiteur](#fonctionnalités-visiteur)
4. [Fonctionnalités Utilisateur](#fonctionnalités-utilisateur)
5. [Fonctionnalités Manager](#fonctionnalités-manager)
6. [Structure Technique](#structure-technique)
7. [Routes et Navigation](#routes-et-navigation)
8. [API Backend Utilisée](#api-backend-utilisée)
9. [Données de Test](#données-de-test)
10. [Guide d'Utilisation](#guide-dutilisation)

---

## 🎯 Vue d'ensemble

### Objectif Principal
Le module web permet de signaler et de suivre les travaux routiers sur la ville d'Antananarivo à travers 3 profils distincts.

### Accès
- **Visiteur** (Public): `http://localhost:3000/` ou `/visitor` - Pas d'authentification requise
- **Utilisateur** (Authentifié): `/login` → `/dashboard` - Création de compte
- **Manager** (Administrateur): `/login` → `/manager` - Rôle spécial

### Technologies
- **Frontend**: React 18.2.0 avec Vite
- **Cartographie**: Leaflet + React-Leaflet
- **API Client**: Axios
- **Authentification**: JWT (Bearer Token)
- **État Global**: useState, useEffect (React Hooks)
- **Routage**: React Router v6
- **CSS**: CSS personnalisé + CSS Grid/Flexbox

---

## 👥 3 Profils Utilisateurs

### 1️⃣ Visiteur (Sans Compte)

**Accès**: `http://localhost:3000/`  
**Authentification**: ❌ Non requise  
**Routes accessibles**:
- `/visitor` - Page publique
- `/login` - Connexion
- `/register` - Inscription

**Fonctionnalités**:
✅ Voir la carte interactive d'Antananarivo  
✅ Voir les points représentant les problèmes routiers  
✅ Survol des points pour voir les infos (date, status, surface, budget, entreprise)  
✅ Voir le tableau de récapitulation (nb points, surface totale, avancement, budget)  
❌ Pas de modification possible  
❌ Pas de création de signalements

**Composant**: `VisitorPage.js` → utilise `RoadWorkMap` avec `userRole="visitor"`

---

### 2️⃣ Utilisateur (Compte Personnel)

**Accès**: Après inscription et connexion  
**Routes accessibles**:
- `/dashboard` - Tableau de bord utilisateur
- `/map` - Vue carte détaillée
- `/profile` - Modification du profil
- `/manager` - ❌ Non accessible (Admin only)

**Fonctionnalités**:
✅ **Authentification**: 
  - Inscription avec email, mot de passe, nom, prénom, téléphone
  - Connexion sécurisée (JWT)
  - Modification du profil (nom, prénom, téléphone)
  - Déconnexion

✅ **Accès à la Carte**:
  - Voir tous les signalements
  - Filtre: "Afficher uniquement mes signalements"
  - Voir les infos au survol des points

✅ **Tableau de Récapitulation**:
  - Nombre total de signalements
  - Surface totale en m²
  - Budget total en Ariary
  - Pourcentage d'avancement

❌ **Gestion des Signalements**: Lecture seule (créer serait une extension)

**Composants**:
- `Login.js` - Connexion
- `Register.js` - Inscription
- `Dashboard.js` - Tableau de bord utilisateur
- `Profile.js` - Modification du profil
- `RoadWorkMap.js` avec `userRole="user"`

---

### 3️⃣ Manager (Administrateur)

**Accès**: Compte préconfiguré (voir données de test)  
**Email**: `manager@example.com`  
**Password**: `Manager123!`

**Routes accessibles**:
- `/manager` - Dashboard manager
- `/dashboard` - Accès à la carte (optionnel)
- `/profile` - Modification du profil
- Toutes les fonctionnalités utilisateur

**Fonctionnalités Exclusives**:

✅ **Déblocage d'Utilisateurs**:
  - Page "👥 Utilisateurs bloqués" sur `/manager`
  - Liste tous les utilisateurs avec `isBlocked = true`
  - Tableau avec: ID, Email, Nom, Tentatives, Actions
  - Bouton "Débloquer" pour réinitialiser:
    - `isBlocked = false`
    - `failedLoginAttempts = 0`

✅ **Gestion des Signalements**:
  - Voir tous les signalements sur la carte
  - **Cliquer sur un point** → Popup avec infos
  - **Bouton "Modifier"** dans la popup → Modal d'édition
  - **Modifier les champs**:
    - 🔴 **Statut**: NOUVEAU → EN_COURS → TERMINE
    - 📏 **Surface (m²)**: Valeur numérique
    - 💰 **Budget (Ar)**: Valeur numérique
    - 🏢 **Entreprise**: Nom de l'entreprise
  - **Bouton "Supprimer"** dans la popup → Suppression avec confirmation

✅ **Synchronisation Firebase**:
  - Bouton "🔄 Synchroniser" en haut à droite de la carte
  - Récupère les données du backend (si Firebase configuré)
  - Envoie les données Firebase pour affichage sur mobile
  - Logs de succès/erreur

**Composants**:
- `ManagerDashboard.js` - Dashboard principal
- `RoadWorkMap.js` avec `userRole="manager"`
- Modal de modification des signalements (dans RoadWorkMap)

---

## ✅ Fonctionnalités Visiteur

### 1. Vue Carte

**Localisation**: `http://localhost:3000/` ou `/visitor`  
**Affichage**: Carte centrée sur Antananarivo [-18.8792, 47.5079]  
**Zoom**: Niveau 13

**Points sur la Carte**:
- 🔴 Rouge: Status "NOUVEAU"
- 🟠 Orange: Status "EN_COURS"
- 🟢 Vert: Status "TERMINE"

**Interaction**:
- Clic sur un point → Popup d'information
- Zoom/Pan: Contrôles Leaflet standards

### 2. Information au Survol / Popup

**Affichage à la sélection d'un point**:
```
Signalement #123
[🔴 Nouveau]
Date: 02/02/2026
Surface: 2.5 m²
Budget: 5,000,000 Ar
Entreprise: Construction Mada
Description: Nid de poule Rue Rakoto
```

### 3. Tableau de Récapitulation

**4 Cartes de Statistiques**:

| Métrique | Affichage | Calcul |
|----------|-----------|---------|
| Nombre de signalements | `stats.totalIssues` | COUNT(*) |
| Surface totale | `stats.totalSurfaceM2` | SUM(surfaceM2) |
| Budget total | `stats.totalBudget` | SUM(budget) |
| Avancement | `stats.completionPercentage` | (TERMINE/total)*100 |

**Origine des données**: Endpoint `/api/road-issues/stats`

### 4. Navigation Visiteur

```
┌─────────────────────────────────────────┐
│ 🗺️ Suivi des Travaux Routiers            │
│                    [Se connecter] [S'inscrire] │
└─────────────────────────────────────────┘
│
├─ Titre: Carte des Travaux Routiers
├─ Infos: Visualisez les problèmes et suivez les travaux
│
├─ 3 Cartes d'info (Visiteur, Compte, Manager)
│
├─ CARTE (Leaflet)
│  ├─ Points colorés (NOUVEAU, EN_COURS, TERMINE)
│  ├─ Popup au clic
│  └─ Zoom/Pan
│
└─ STATISTIQUES
   ├─ Nb signalements
   ├─ Surface totale
   ├─ Budget total
   └─ Avancement %
```

---

## ✅ Fonctionnalités Utilisateur

### 1. Inscription

**Route**: `/register`  
**Champs requis**:
- Email (valide, unique)
- Mot de passe (min 6 caractères)
- Prénom
- Nom
- Téléphone

**Comportement**:
- Validation des champs
- Appel API: `POST /api/auth/register`
- Succès → Redirection `/login`
- Erreur → Message d'erreur affiché

### 2. Connexion

**Route**: `/login`  
**Champs**:
- Email
- Mot de passe

**Comportement**:
- Appel API: `POST /api/auth/login`
- Réponse contient: `{ token, user: { id, email, role, ... } }`
- Stockage localStorage:
  - `localStorage.setItem('token', response.token)`
  - `localStorage.setItem('user', JSON.stringify(response.user))`
- Redirection selon rôle:
  - `role='USER'` → `/dashboard`
  - `role='MANAGER'` → `/manager`

### 3. Dashboard Utilisateur

**Route**: `/dashboard`  
**Affichage**:
```
┌─────────────────────────────────────────┐
│ Navbar: [Tableau de bord] [Carte] [Profil] [Déconnexion] │
└─────────────────────────────────────────┘

Titre: Bienvenue [Prénom] !
Sous-titre: Signalement et suivi des travaux routiers

┌─────────────┬─────────────┬─────────────┐
│ 👤 Profil   │ 🗺️ Carte     │ 📊 Signalements │
│ Gérez infos │ Consultez   │ Consultez  │
│ [Voir]      │ [Voir]      │ [Voir]     │
└─────────────┴─────────────┴─────────────┘

Informations du compte:
  Email: [user@example.com]
  Nom: [Prénom Nom]
  Statut: Actif

┌─────────────────────────────────────────┐
│ CARTE + STATISTIQUES + FILTRES          │
│ [Afficher mes signalements]             │
│ Nb: 10 | Surface: 25.5m² | Avancement: 40% │
└─────────────────────────────────────────┘
```

### 4. Vue Carte Utilisateur

**Route**: `/map`  
**Fonctionnalités**:
- Affichage complète de RoadWorkMap
- Filtre: ☑️ "Afficher uniquement mes signalements"
- Voir tous les signalements OU juste les siens

### 5. Profil Utilisateur

**Route**: `/profile`  
**Affichage en lecture**:
- Email
- Prénom
- Nom
- Téléphone

**Mode édition** (bouton "Modifier"):
- Formulaire pour: Prénom, Nom, Téléphone
- Bouton "Enregistrer" → `PUT /api/auth/user/{userId}`
- Succès → Recharge les données
- Bouton "Annuler" → Retour à la lecture

### 6. Déconnexion

**Comportement**:
- Suppression localStorage: `token` et `user`
- Redirect: `/login`
- Destruction de la session serveur: `POST /api/auth/logout`

---

## ✅ Fonctionnalités Manager

### 1. Dashboard Manager

**Route**: `/manager`  
**Affichage**:
```
┌──────────────────────────────────────────────┐
│ Manager Dashboard              [Déconnexion] │
└──────────────────────────────────────────────┘

Titre: Tableau de bord Manager
Sous-titre: Gestion des signalements et des utilisateurs

┌──────────────────────────────────────────────┐
│ 👥 UTILISATEURS BLOQUÉS                      │
├──────────────────────────────────────────────┤
│ ID | Email | Nom | Tentatives | Action      │
├─────────────────────────────────────────────┤
│ 1  | user@example.com | User U | Bloqué | [Débloquer] │
│ 2  | reporter@ex.com  | Pierre D | Bloqué | [Débloquer] │
├──────────────────────────────────────────────┤
│ Aucun utilisateur bloqué (si liste vide)    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ CARTE + GESTION SIGNALEMENTS                 │
│ [🔄 Synchroniser]                           │
│                                             │
│ ┌─ STATISTIQUES ──────────────────────────┐ │
│ │ Nb: 10 | Surface: 25.5m² | Budget: 50M Ar │
│ │ Avancement: 40%                          │
│ └────────────────────────────────────────┘ │
│                                             │
│ ┌─ CARTE (Leaflet) ──────────────────────┐ │
│ │ [Points colorés]                        │
│ │ Clic → Popup avec [Modifier] [Supprimer]│
│ └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### 2. Déblocage d'Utilisateurs

**Processus**:
1. Page `/manager` charge auto les utilisateurs bloqués
2. Appel API: `GET /api/auth/blocked-users`
3. Affichage dans tableau
4. Bouton "Débloquer" pour chaque utilisateur
5. Clic → Appel API: `POST /api/auth/unblock/{userId}`
6. Réponse: "Utilisateur débloqué avec succès"
7. Rechargement de la liste

**Effet côté serveur**:
```java
user.setIsBlocked(false);
user.setFailedLoginAttempts(0);
user.save();
```

### 3. Modification des Signalements

**Processus**:
1. Vue carte affiche tous les signalements
2. Clic sur un point → Popup s'affiche
3. Popup contient 2 boutons: [Modifier] [Supprimer]
4. Clic [Modifier] → Modal d'édition s'ouvre

**Modal d'Édition**:
```
┌──────────────────────────────────────────┐
│ Modifier le signalement #123            │
├──────────────────────────────────────────┤
│ Statut:        [NOUVEAU ▼]              │
│                 NOUVEAU                  │
│                 EN_COURS                │
│                 TERMINE                 │
│                                          │
│ Surface (m²):  [2.5           ]         │
│                                          │
│ Budget (Ar):   [5000000      ]         │
│                                          │
│ Entreprise:    [Construction Mada]     │
│                                          │
│              [Enregistrer] [Annuler]    │
└──────────────────────────────────────────┘
```

**Champs Modifiables**:
| Champ | Type | Exemples | API |
|-------|------|----------|-----|
| Statut | Enum | NOUVEAU, EN_COURS, TERMINE | `status` |
| Surface | Number | 2.5, 10.25 | `surfaceM2` |
| Budget | Number | 5000000, 1000000 | `budget` |
| Entreprise | String | "Construction Mada" | `companyName` |

**Soumission**:
- Appel API: `PUT /api/road-issues/{issueId}` avec formData
- Succès → Modal se ferme, carte recharge, stats mises à jour
- Erreur → Message d'erreur affiché

### 4. Suppression de Signalements

**Processus**:
1. Popup de point → Bouton [Supprimer]
2. Confirmation: "Êtes-vous sûr de vouloir supprimer ce signalement ?"
3. Si OUI:
   - Appel API: `DELETE /api/road-issues/{issueId}`
   - Succès → Point disparaît de la carte, stats mises à jour
4. Si NON: Rien ne se passe

### 5. Synchronisation Firebase

**Bouton**: En haut à droite de la carte - [🔄 Synchroniser]

**Processus**:
1. Clic sur bouton
2. Appel API: `POST /api/road-issues/sync`
3. Backend:
   - Récupère tous les signalements
   - Envoie vers Firebase
   - Met à jour `syncedToFirebase = true`
4. Réponse: "Synchronisation effectuée avec succès"
5. Carte recharge les données

**Visibilité**: Bouton visible uniquement si `userRole === 'manager'`

---

## 🏗️ Structure Technique

### Hiérarchie des Composants

```
App.js
├── Router
│   ├── Routes
│   │   ├── /visitor → VisitorPage
│   │   ├── /login → Login
│   │   ├── /register → Register
│   │   ├── /dashboard → PrivateRoute → Dashboard
│   │   │   └── RoadWorkMap (userRole="user")
│   │   ├── /map → PrivateRoute → Dashboard + MapView
│   │   ├── /profile → PrivateRoute → Dashboard + Profile
│   │   └── /manager → PrivateRoute → ManagerDashboard
│   │       └── RoadWorkMap (userRole="manager")
│   │
│   └── PrivateRoute (Wrapper)
│       └── Vérifie localStorage.token
│           Sinon → Navigate /login

Services
├── api.js (Axios instance + intercepteurs)
├── authService (login, register, getUser, updateUser)
└── roadIssueService (getAll, getById, create, update, delete, stats, sync)

Composants
├── Login.js
├── Register.js
├── Dashboard.js
├── Profile.js
├── MapView.js
├── ManagerDashboard.js
├── VisitorPage.js (NEW)
└── RoadWorkMap.js (Réutilisable)

Styles
├── index.css (Styles globaux)
├── Auth.css
├── Dashboard.css
└── MapView.css
```

### Fichiers Clés

| Fichier | Ligne | Description |
|---------|------|-------------|
| App.js | 1-70 | Routeur principal, PrivateRoute |
| VisitorPage.js | 1-100 | Page publique visiteur |
| RoadWorkMap.js | 1-381 | Composant carte réutilisable |
| ManagerDashboard.js | 1-148 | Dashboard manager |
| Dashboard.js | 1-150 | Dashboard utilisateur |
| Profile.js | 1-174 | Profil utilisateur |
| Login.js | 1-104 | Authentification |
| Register.js | - | Inscription |
| api.js | 1-100 | Client API Axios |

---

## 🛣️ Routes et Navigation

### Routes Publiques (Sans Authentification)

| Route | Composant | Accès | Description |
|-------|-----------|-------|-------------|
| `/` | Redirect | Public | Redirige vers `/visitor` |
| `/visitor` | VisitorPage | Public | Page accueil + carte visiteur |
| `/login` | Login | Public | Formulaire connexion |
| `/register` | Register | Public | Formulaire inscription |

### Routes Protégées (Authentification Requise)

| Route | Composant | Rôles | Description |
|-------|-----------|-------|-------------|
| `/dashboard` | Dashboard | USER, MANAGER | Tableau de bord |
| `/map` | MapView | USER, MANAGER | Carte détaillée |
| `/profile` | Profile | USER, MANAGER | Modification profil |
| `/manager` | ManagerDashboard | MANAGER | Dashboard administrateur |

### Protection des Routes

**Composant PrivateRoute**:
```javascript
function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}
```

**Effet**:
- Token absent → Redirect `/login`
- Token présent → Accès autorisé
- Logout → Token supprimé, `useEffect` → Redirect `/login`

---

## 🔌 API Backend Utilisée

### 1. Authentification

#### Inscription
```
POST /api/auth/register
Body: {
  email: "user@example.com",
  password: "Password123!",
  firstName: "Jean",
  lastName: "Dupont",
  phoneNumber: "+261 20 222 222"
}
Response: {
  token: "jwt_token_here",
  user: { id, email, firstName, ... }
}
```

#### Connexion
```
POST /api/auth/login
Body: {
  email: "user@example.com",
  password: "Password123!"
}
Response: {
  token: "jwt_token_here",
  user: { id, email, role, ... }
}
```

#### Récupérer Utilisateur
```
GET /api/auth/user/{userId}
Headers: Authorization: Bearer {token}
Response: {
  id, email, firstName, lastName, phoneNumber,
  role, isActive, isBlocked, createdAt, lastLogin
}
```

#### Modifier Utilisateur
```
PUT /api/auth/user/{userId}
Headers: Authorization: Bearer {token}
Body: {
  firstName: "Jean",
  lastName: "Dupont",
  phoneNumber: "+261 20 222 222"
}
Response: { ... user mis à jour ... }
```

#### Débloquer Utilisateur
```
POST /api/auth/unblock/{userId}
Headers: Authorization: Bearer {token}
Response: "Utilisateur débloqué avec succès"
```

#### Récupérer Utilisateurs Bloqués
```
GET /api/auth/blocked-users
Headers: Authorization: Bearer {token}
Response: [ { id, email, firstName, lastName, ... }, ... ]
```

#### Déconnexion
```
POST /api/auth/logout
Headers: Authorization: Bearer {token}
Response: "Déconnexion réussie"
```

### 2. Signalements Routiers

#### Récupérer Tous les Signalements
```
GET /api/road-issues
Query: ?reporterId={userId} (optionnel, pour mes signalements)
Response: [ { id, latitude, longitude, description, status, ... }, ... ]
```

#### Récupérer Statistiques
```
GET /api/road-issues/stats
Response: {
  totalIssues: 10,
  totalSurfaceM2: 25.5,
  totalBudget: 50000000,
  completionPercentage: 40.0,
  byStatus: { NOUVEAU: 3, EN_COURS: 4, TERMINE: 3 }
}
```

#### Modifier Signalement
```
PUT /api/road-issues/{issueId}
Headers: Authorization: Bearer {token}
Body: {
  status: "EN_COURS",
  surfaceM2: 2.5,
  budget: 5000000,
  companyName: "Construction Mada"
}
Response: { ... signalement mis à jour ... }
```

#### Supprimer Signalement
```
DELETE /api/road-issues/{issueId}
Headers: Authorization: Bearer {token}
Response: "Signalement supprimé"
```

#### Synchroniser Firebase
```
POST /api/road-issues/sync
Headers: Authorization: Bearer {token}
Response: "Synchronisation effectuée"
```

---

## 🧪 Données de Test

### Utilisateurs Pré-configurés

#### Visiteur
- **Accès**: `http://localhost:3000/` (pas de login)
- **Fonctionnalités**: Voir carte, infos, stats

#### Utilisateur Standard
```
Email:       user@example.com
Password:    User123!
Prénom:      Marie
Nom:         Martin
Téléphone:   +261 33 33 333 333
Rôle:        USER
```

#### Reporter
```
Email:       reporter@example.com
Password:    Reporter123!
Prénom:      Pierre
Nom:         Dubois
Téléphone:   +261 34 44 444 444
Rôle:        USER
```

#### Manager
```
Email:       manager@example.com
Password:    Manager123!
Prénom:      Jean
Nom:         Dupont
Téléphone:   +261 20 22 222 222
Rôle:        MANAGER
```

### Signalements de Test

| ID | Description | Latitude | Longitude | Status | Surface | Budget | Entreprise |
|----|-------------|----------|-----------|--------|---------|--------|------------|
| 1 | Nid de poule Rue Rakoto | -18.8792 | 47.5079 | NOUVEAU | 2.5 | 5,000,000 | Construction Mada |
| 2 | Crevasse Rue Ravelo | -18.8750 | 47.5150 | EN_COURS | 5.0 | 10,000,000 | BTP Solutions |
| 3 | Asphalt endommagé Rue Jean | -18.8800 | 47.5050 | TERMINE | 1.8 | 3,000,000 | Travaux Publics |

---

## 📘 Guide d'Utilisation

### 👤 Scénario Visiteur

**But**: Consulter la carte et voir les signalements

1. Ouvrir `http://localhost:3000/`
2. Page d'accueil s'affiche avec:
   - Titre "Carte des Travaux Routiers - Antananarivo"
   - 3 cartes d'info (Visiteur, Créer compte, Manager)
   - Boutons "Se connecter" et "S'inscrire"
3. Vue carte centrée sur Antananarivo (niveau zoom 13)
4. Points colorés visibles:
   - 🔴 Rouges (NOUVEAU)
   - 🟠 Oranges (EN_COURS)
   - 🟢 Vertes (TERMINE)
5. Clic sur un point → Popup avec infos:
   - ID du signalement
   - Status avec couleur
   - Date de création
   - Description
   - Surface m²
   - Budget Ar
   - Entreprise concernée
6. Zoom/Pan avec contrôles Leaflet
7. Voir stats en haut:
   - Nombre de signalements
   - Surface totale
   - Budget total
   - Avancement %

✅ **Résultat attendu**: Voir la carte, infos au survol, stats visibles

---

### 📝 Scénario Utilisateur - Inscription et Connexion

**But**: Créer un compte et accéder à la carte authentifiée

#### Étape 1: Inscription
1. Depuis `/visitor` → Bouton "S'inscrire"
2. Remplir le formulaire:
   - Email: `newuser@example.com`
   - Mot de passe: `SecurePass123!`
   - Prénom: `Jean`
   - Nom: `Dupont`
   - Téléphone: `+261 20 222 222`
3. Clic "S'inscrire"
4. Redirection `/login` → Message "Inscription réussie"

#### Étape 2: Connexion
1. Remplir:
   - Email: `newuser@example.com`
   - Mot de passe: `SecurePass123!`
2. Clic "Connexion"
3. Redirection `/dashboard`

#### Étape 3: Dashboard Utilisateur
1. Voir titre "Bienvenue Jean!"
2. Navbar avec: [Tableau de bord] [Carte] [Profil] [Déconnexion]
3. 3 cartes: Mon Profil, Carte, Mes Signalements
4. Infos du compte affichées
5. Carte + Stats en bas

#### Étape 4: Vue Carte Complète
1. Clic "Voir la carte" ou lien Navbar "Carte"
2. Route `/map` chargée
3. Vue complète de la carte avec RoadWorkMap
4. Filtre: ☑️ "Afficher uniquement mes signalements" (si l'utilisateur a créé des signalements)

#### Étape 5: Profil Utilisateur
1. Clic Navbar "Profil" ou lien "Voir le profil"
2. Route `/profile` chargée
3. Affichage en lecture:
   - Email
   - Prénom
   - Nom
   - Téléphone
4. Clic "Modifier":
   - Activer mode édition
   - Changer Prénom en `Jean` → `Pierre`
   - Clic "Enregistrer"
   - Message succès
   - Recharger et afficher `Pierre`
5. Clic "Annuler" → Retour à la lecture

#### Étape 6: Déconnexion
1. Clic Navbar "Déconnexion"
2. Suppression localStorage
3. Redirection `/login`

✅ **Résultat attendu**: Création compte OK, connexion OK, accès carte, modification profil OK, déconnexion OK

---

### 👨‍💼 Scénario Manager - Déblocage et Gestion

**But**: Débloquer des utilisateurs et gérer les signalements

#### Étape 1: Connexion Manager
1. `/login`
2. Email: `manager@example.com`
3. Password: `Manager123!`
4. Clic Connexion → `/manager` (détection auto du rôle MANAGER)

#### Étape 2: Dashboard Manager
1. Titre "Tableau de bord Manager"
2. Section "👥 Utilisateurs bloqués"
3. Tableau avec utilisateurs bloqués:
   - ID | Email | Nom | Tentatives | Action
   - Ex: 1 | user@example.com | Marie M. | Bloqué | [Débloquer]

#### Étape 3: Débloquer Utilisateur
1. Clic [Débloquer] pour user@example.com
2. Appel API: POST /api/auth/unblock/1
3. Message: "Utilisateur débloqué avec succès"
4. Tableau recharge auto
5. Utilisateur disparaît de la liste

✅ **Résultat attendu**: Utilisateur débloqué, tableau mis à jour

#### Étape 4: Gestion Signalements - Vue Carte
1. Section "CARTE + GESTION SIGNALEMENTS"
2. Affichage RoadWorkMap avec userRole="manager"
3. Voir tous les signalements
4. Bouton [🔄 Synchroniser] en haut à droite

#### Étape 5: Modifier Signalement
1. Clic sur point → Popup s'affiche
2. Voir boutons [Modifier] [Supprimer]
3. Clic [Modifier] → Modal d'édition s'ouvre
4. Voir formulaire pré-rempli:
   - Statut: NOUVEAU ▼
   - Surface (m²): 2.5
   - Budget (Ar): 5000000
   - Entreprise: Construction Mada

5. **Scénario A - Modifier tous les champs**:
   - Statut: NOUVEAU → EN_COURS
   - Surface: 2.5 → 3.0
   - Budget: 5000000 → 6000000
   - Entreprise: Construction Mada → BTP Solutions
   - Clic [Enregistrer]
   - API: PUT /api/road-issues/1 avec nouvelles données
   - Message: "Signalement mis à jour avec succès"
   - Modal se ferme, carte recharge, couleur du point change (orange)

6. **Scénario B - Modifier status**:
   - EN_COURS → TERMINE
   - Clic [Enregistrer]
   - Point devient vert (TERMINE)
   - Stats se mettent à jour (avancement %)

#### Étape 6: Supprimer Signalement
1. Clic [Supprimer] → Confirmation
2. "Êtes-vous sûr de vouloir supprimer ce signalement ?"
3. Clic OK:
   - API: DELETE /api/road-issues/1
   - Point disparaît de la carte
   - Stats réactualisées
4. Clic Annuler → Rien ne se passe

#### Étape 7: Synchronisation Firebase
1. Clic [🔄 Synchroniser]
2. API: POST /api/road-issues/sync
3. Backend:
   - Récupère tous les signalements
   - Envoie Firebase
   - Met à jour `syncedToFirebase = true`
4. Message: "Synchronisation effectuée avec succès"
5. Carte recharge (optionnel)

✅ **Résultat attendu**: Déblocage OK, modification signalements OK, suppression OK, sync Firebase OK

---

## 🚀 Démarrage Rapide

### Démarrer les Services

```bash
# 1. Docker (PostgreSQL + Tile Server)
cd /path/to/cloud
docker-compose up -d

# 2. Backend
cd identity-provider-backend
mvn clean install
mvn spring-boot:run
# Swagger: http://localhost:8080/swagger-ui.html

# 3. Frontend Web
cd identity-provider-web
npm install
npm start
# http://localhost:3000/
```

### Tester les 3 Profils

| Profil | URL | Login | Fonctionnalités |
|--------|-----|-------|-----------------|
| Visiteur | `http://localhost:3000/` | ❌ Public | Voir carte, stats |
| Utilisateur | `/login` | `user@example.com` / `User123!` | Carte, profil, filtre |
| Manager | `/login` | `manager@example.com` / `Manager123!` | Débloquer, modifier, sync |

---

## ✅ Checklist Conformité

### ✅ Module Visiteur
- [x] Accès public sans authentification
- [x] Vue carte Antananarivo
- [x] Points signalements colorés
- [x] Infos au survol: date, status, surface, budget, entreprise
- [x] Tableau stats: nb points, surface totale, avancement %, budget

### ✅ Module Utilisateur
- [x] Inscription email/mot de passe/infos
- [x] Connexion sécurisée JWT
- [x] Modification profil
- [x] Accès carte authentifiée
- [x] Filtre mes signalements
- [x] Déconnexion

### ✅ Module Manager
- [x] Déblocage utilisateurs
- [x] Liste utilisateurs bloqués
- [x] Gestion infos signalements (surface, budget, entreprise)
- [x] Modification statuts (NOUVEAU → EN_COURS → TERMINE)
- [x] Suppression signalements
- [x] Synchronisation Firebase

### ✅ Infrastructure
- [x] Routes publiques et protégées
- [x] PrivateRoute pour authentification
- [x] Intercepteurs Axios pour token
- [x] Gestion erreurs 401
- [x] LocalStorage pour persistance

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2 février 2026  
**Statut**: ✅ COMPLET ET FONCTIONNEL

