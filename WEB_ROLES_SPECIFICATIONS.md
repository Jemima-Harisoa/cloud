# 📋 Spécification des Rôles et Fonctionnalités - Module Web

**Date**: 2 février 2026  
**Projet**: Identity Provider - Gestion des Travaux Routiers  
**Clarification**: Structure des rôles et fonctionnalités

---

## 👥 3 Catégories d'Utilisateurs

### 1️⃣ VISITEURS (Sans Compte)
**Profil**: Utilisateur public, pas d'inscription requise

#### Fonctionnalités
✅ **Voir la Carte**
- Voir la carte interactive d'Antananarivo
- Voir les différents points représentant les problèmes routiers
- Points colorés selon status:
  - 🔴 NOUVEAU
  - 🟠 EN_COURS
  - 🟢 TERMINE

✅ **Infos au Survol/Clic**
- Lorsqu'on survole/clique sur un point:
  - Date du signalement
  - Status (nouveau, en cours, terminé)
  - Surface en m²
  - Budget en Ariary
  - Entreprise concernée

✅ **Tableau de Récapitulation**
- Voir un tableau avec:
  - Nombre de points total
  - Surface totale en m²
  - Avancement en % (TERMINE / total * 100)
  - Budget total en Ariary

#### Accès
- **URL**: `http://localhost:3000/`
- **Route**: `/visitor`
- **Authentication**: ❌ Non requise
- **Compte**: Pas nécessaire

#### Composant
- `VisitorPage.js` → Affiche `RoadWorkMap` avec `userRole="visitor"`

---

### 2️⃣ UTILISATEURS ou CLIENTS (Avec Compte)
**Profil**: Utilisateur enregistré qui signale et suit les travaux

#### Fonctionnalités
✅ **Signaler et Suivre les Travaux Routiers**
- Accès complet à la plateforme
- Voir la carte avec tous les signalements
- Voir les informations détaillées des signalements
- Suivre les travaux en cours

✅ **Inscription et Connexion**
- Créer un compte avec email et mot de passe
- Se connecter de manière sécurisée (JWT)
- Modifier son profil personnel

✅ **Vue Personnalisée**
- Tableau de bord avec accueil personnalisé
- Accès à la carte complète
- Filtre pour voir uniquement ses signalements
- Gestion du profil

#### Accès
- **Routes**: `/dashboard`, `/map`, `/profile`
- **Authentication**: ✅ Email + Mot de passe requise
- **Compte**: Création requise via `/register`

#### Composants
- `Login.js` → Connexion
- `Register.js` → Inscription
- `Dashboard.js` → Tableau de bord utilisateur
- `Profile.js` → Gestion profil
- `MapView.js` → Carte
- `RoadWorkMap.js` avec `userRole="user"`

---

### 3️⃣ MANAGER ou ADMIN
**Profil**: Administrateur avec pouvoirs de gestion

#### Fonctionnalités

##### 🔄 Synchronisation Firebase
✅ **Bouton Synchronisation**
- Bouton dédié pour synchroniser les données

✅ **Récupérer les Signalements en Ligne (Firebase)**
- Récupère les données depuis Firebase
- Affiche les signalements synchronisés
- Mise à jour automatique

✅ **Envoi les Données en Ligne (Firebase)**
- Envoie les signalements vers Firebase
- Disponible pour affichage sur mobile
- Synchronisation bidirectionnelle

##### 👥 Gestion des Utilisateurs Bloqués
✅ **Page pour Débloquer les Utilisateurs Bloqués**
- Affichage liste des utilisateurs bloqués
- Informations: ID, Email, Nom, Tentatives
- Bouton de déblocage pour chaque utilisateur
- Déblocage réinitialise:
  - `isBlocked = false`
  - `failedLoginAttempts = 0`

##### 📊 Gestion des Signalements
✅ **Gestion des Infos Nécessaires sur Chaque Signalement**
- Modifier surface en m²
- Modifier budget en Ariary
- Modifier entreprise concernée
- Modifier autres infos nécessaires
- Validation et sauvegarde des modifications

✅ **Modifier les Statuts de Chaque Signalement**
- Changement de statut: NOUVEAU → EN_COURS → TERMINE
- Visualisation de l'avancement (TERMINE/total * 100)
- Couleur des points change selon status:
  - 🔴 NOUVEAU → Rouge
  - 🟠 EN_COURS → Orange
  - 🟢 TERMINE → Vert

#### Accès
- **Route**: `/manager`
- **Authentication**: ✅ Compte admin requis
- **Compte**: `manager@example.com` / `Manager123!`

#### Composants
- `ManagerDashboard.js` → Dashboard admin
- `RoadWorkMap.js` avec `userRole="manager"`
- Modal d'édition signalements

---

## 📊 Matrice des Fonctionnalités par Rôle

| Fonctionnalité | Visiteur | Utilisateur | Manager |
|----------------|----------|-------------|---------|
| **Voir la carte** | ✅ | ✅ | ✅ |
| **Voir points signalements** | ✅ | ✅ | ✅ |
| **Infos au survol (date, status, surface, budget, entreprise)** | ✅ | ✅ | ✅ |
| **Tableau récapitulation (nb, surface, budget, avancement %)** | ✅ | ✅ | ✅ |
| **S'inscrire** | ❌ | ✅ | - |
| **Se connecter** | ❌ | ✅ | ✅ |
| **Modifier profil** | ❌ | ✅ | ✅ |
| **Déconnexion** | ❌ | ✅ | ✅ |
| **Filtre mes signalements** | ❌ | ✅ | ❌ |
| **Voir utilisateurs bloqués** | ❌ | ❌ | ✅ |
| **Débloquer utilisateurs** | ❌ | ❌ | ✅ |
| **Modifier surface signalement** | ❌ | ❌ | ✅ |
| **Modifier budget signalement** | ❌ | ❌ | ✅ |
| **Modifier entreprise signalement** | ❌ | ❌ | ✅ |
| **Modifier status signalement** | ❌ | ❌ | ✅ |
| **Supprimer signalement** | ❌ | ❌ | ✅ |
| **Synchroniser Firebase** | ❌ | ❌ | ✅ |
| **Récupérer données Firebase** | ❌ | ❌ | ✅ |
| **Envoyer données Firebase** | ❌ | ❌ | ✅ |

---

## 🎯 Détail des Fonctionnalités par Rôle

### VISITEUR - Détail Complet

#### 1. Voir la Carte
```
URL: http://localhost:3000/
- Carte centrée sur Antananarivo
- Zoom niveau 13
- Interactions: Pan, Zoom (contrôles Leaflet)
- Source: Tile Server Docker local (http://localhost:8081)
```

#### 2. Points Signalements avec Couleurs
```
🔴 NOUVEAU:   Rouge
🟠 EN_COURS:  Orange
🟢 TERMINE:   Vert

Chaque point est cliquable
```

#### 3. Infos au Clic sur un Point
```
Popup affichée avec:
├─ ID du signalement: "Signalement #123"
├─ Status: [🔴 Nouveau]
├─ Date: "02/02/2026"
├─ Description: "Nid de poule Rue Rakoto"
├─ Surface: "2.5 m²"
├─ Budget: "5,000,000 Ar"
└─ Entreprise: "Construction Mada"
```

#### 4. Tableau Récapitulation
```
4 Cartes affichées:
┌─────────────────────────────┐
│ Nombre de signalements      │
│ Total: 10 points            │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Surface totale (m²)         │
│ Total: 25.5 m²              │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Budget total (Ar)           │
│ Total: 50,000,000 Ar        │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Avancement (%)              │
│ Total: 40%                  │
└─────────────────────────────┘
```

**Calculs**:
- Nombre: COUNT(*)
- Surface: SUM(surface_m2)
- Budget: SUM(budget)
- Avancement: (COUNT(status=TERMINE) / COUNT(*)) * 100

#### 5. Navigation Visiteur
```
Bouton "Se connecter" → /login
Bouton "S'inscrire" → /register
```

---

### UTILISATEUR - Détail Complet

#### 1. S'inscrire et Se Connecter
```
Inscription (/register):
- Email (validation)
- Mot de passe
- Prénom
- Nom
- Téléphone
- Validation et création compte
- Redirection /login

Connexion (/login):
- Email
- Mot de passe
- JWT Token retourné
- Stockage localStorage
- Redirection /dashboard
```

#### 2. Tableau de Bord Personnalisé
```
URL: /dashboard
Affiche:
- Titre: "Bienvenue [Prénom]!"
- Navigation: [Tableau de bord] [Carte] [Profil] [Déconnexion]
- 3 Cartes: Mon Profil, Carte, Mes Signalements
- Infos du compte
- Carte intégrée avec stats
```

#### 3. Vue Carte Authentifiée
```
URL: /map
Affiche:
- Carte complète
- Tous les signalements
- Filtre: ☑️ "Afficher uniquement mes signalements"
  - Coche → Affiche que ses signalements
  - Décoche → Affiche tous les signalements
- Stats actualisées selon filtre
```

#### 4. Gestion du Profil
```
URL: /profile
Mode Lecture:
- Email
- Prénom
- Nom
- Téléphone
- Bouton "Modifier"

Mode Édition (après clic "Modifier"):
- Champ Prénom (éditable)
- Champ Nom (éditable)
- Champ Téléphone (éditable)
- Bouton "Enregistrer" → API PUT
- Bouton "Annuler" → Retour mode lecture
```

#### 5. Déconnexion
```
Clic "Déconnexion":
- Suppression localStorage (token, user)
- Appel API logout
- Redirection /login
- Session détruite
```

---

### MANAGER - Détail Complet

#### 1. Page Déblocage Utilisateurs Bloqués
```
URL: /manager
Section: "👥 Utilisateurs Bloqués"

Affichage:
┌────────────────────────────────────────────┐
│ ID | Email | Nom | Tentatives | Action    │
├────────────────────────────────────────────┤
│ 1  | user@ex.com | Marie M. | Bloqué | [Débloquer] │
│ 2  | reporter@ex | Pierre D | Bloqué | [Débloquer] │
└────────────────────────────────────────────┘

Processus:
1. API GET /api/auth/blocked-users
2. Affichage tableau
3. Clic [Débloquer] pour chaque utilisateur
4. API POST /api/auth/unblock/{userId}
5. Tableau recharge automatiquement
6. Utilisateur dispara de la liste
```

#### 2. Vue Carte Manager - Tous les Signalements
```
URL: /manager (carte intégrée)
Affiche:
- Tous les signalements (pas de filtre)
- Points colorés (NOUVEAU/EN_COURS/TERMINE)
- Stats complètes (nb, surface, budget, avancement)
- Bouton [🔄 Synchroniser] en haut à droite
```

#### 3. Modification des Infos Signalements
```
Processus:
1. Clic sur point → Popup
2. Popup affiche: Info + [Modifier] [Supprimer]
3. Clic [Modifier] → Modal s'ouvre

Modal d'édition:
┌──────────────────────────────┐
│ Modifier le signalement #123 │
├──────────────────────────────┤
│ Statut:        [EN_COURS ▼]  │
│                 NOUVEAU      │
│                 EN_COURS     │
│                 TERMINE      │
│                              │
│ Surface (m²):  [2.5        ] │
│                              │
│ Budget (Ar):   [5000000    ] │
│                              │
│ Entreprise:    [Construction│
│                 Mada        ] │
│                              │
│            [Enregistrer]      │
│            [Annuler]         │
└──────────────────────────────┘

Champs éditables:
- Surface (m²): Valeur numérique
- Budget (Ar): Valeur numérique
- Entreprise: Texte libre
- Status: Enum (NOUVEAU, EN_COURS, TERMINE)

Soumission:
- Clic [Enregistrer]
- API PUT /api/road-issues/{id}
- Envoi: {status, surfaceM2, budget, companyName}
- Succès: Modal ferme, point change couleur, stats mises à jour
```

#### 4. Modification des Statuts
```
Options disponibles:
1. NOUVEAU → EN_COURS
2. EN_COURS → TERMINE
3. TERMINE → NOUVEAU (optionnel, cyclique)

Effet visuel:
- Couleur point change automatiquement:
  - 🔴 NOUVEAU → Rouge
  - 🟠 EN_COURS → Orange
  - 🟢 TERMINE → Vert

Effet sur stats:
- Avancement % augmente/diminue
- Nombre points par status mis à jour
```

#### 5. Synchronisation Firebase
```
Bouton: [🔄 Synchroniser]
Localisation: En haut à droite de la carte

Processus:
1. Clic bouton
2. API POST /api/road-issues/sync
3. Backend:
   - Récupère tous les signalements
   - Envoie vers Firebase
   - Synchronise données
4. Message succès: "Synchronisation effectuée"
5. Carte recharge (optionnel)

Firebase Integration:
- Récupère: ✅ Données en ligne pour affichage mobile
- Envoie: ✅ Données à Firebase
- Bidirectionnelle: ✅
```

#### 6. Suppression de Signalements
```
Processus:
1. Clic point → Popup
2. Bouton [Supprimer]
3. Confirmation: "Êtes-vous sûr?"
4. Si OUI:
   - API DELETE /api/road-issues/{id}
   - Point dispara de la carte
   - Stats mises à jour
5. Si NON: Rien ne se passe
```

---

## 🔄 Flux Utilisateur par Rôle

### VISITEUR
```
Ouvrir http://localhost:3000/
    ↓
Voir VisitorPage
    ├─ Carte visible
    ├─ Points visibles
    ├─ Clic point → Popup infos ✅
    ├─ Stats affichées ✅
    └─ Boutons login/register ✅
```

### UTILISATEUR
```
/register (Créer compte)
    ↓
/login (Se connecter)
    ↓
/dashboard (Accueil)
    ├─ Voir carte intégrée
    ├─ /map (Carte détaillée)
    │   ├─ Voir tous signalements
    │   ├─ Filtre "Mes signalements"
    │   └─ Stats réactualisées
    │
    ├─ /profile (Profil)
    │   ├─ Affichage infos
    │   └─ Modification possible
    │
    └─ Déconnexion (Logout)
```

### MANAGER
```
/login (manager@example.com)
    ↓
/manager (Dashboard)
    ├─ Section "Utilisateurs bloqués"
    │   ├─ Liste utilisateurs
    │   └─ Débloquer ✅
    │
    ├─ Carte + Gestion signalements
    │   ├─ Voir tous les signalements
    │   ├─ Clic point → Popup
    │   │   ├─ [Modifier] ✅
    │   │   │   ├─ Changer surface ✅
    │   │   │   ├─ Changer budget ✅
    │   │   │   ├─ Changer entreprise ✅
    │   │   │   └─ Changer status ✅
    │   │   └─ [Supprimer] ✅
    │   │
    │   └─ [🔄 Synchroniser] ✅
    │       └─ Firebase sync
    │
    └─ Déconnexion
```

---

## ✅ Validation - Est-ce que tout est implémenté?

### VISITEUR
- [x] Voir la carte
- [x] Voir les points
- [x] Infos au clic (date, status, surface, budget, entreprise)
- [x] Tableau récapitulation (nb, surface, budget, avancement %)

### UTILISATEUR
- [x] Signaler et suivre les travaux
- [x] S'inscrire
- [x] Se connecter
- [x] Modifier profil
- [x] Accès carte
- [x] Déconnexion

### MANAGER
- [x] Déblocage utilisateurs
- [x] Page déblocage avec liste
- [x] Modifier surface m²
- [x] Modifier budget Ar
- [x] Modifier entreprise
- [x] Modifier status (NOUVEAU/EN_COURS/TERMINE)
- [x] Supprimer signalements
- [x] Bouton synchronisation Firebase
- [x] Récupérer données Firebase
- [x] Envoyer données Firebase

---

## 🎯 Résumé

### VISITEUR (Public)
```
✅ Voir carte + points + infos + stats
❌ Pas d'authentification
```

### UTILISATEUR (Authentifié)
```
✅ Signaler + Suivre travaux
✅ Inscription/Connexion
✅ Gestion profil
```

### MANAGER (Admin)
```
✅ Gestion complète signalements
✅ Déblocage utilisateurs
✅ Synchronisation Firebase
```

---

**Statut**: ✅ **TOUS LES CRITÈRES SATISFAITS**

**Prochaines étapes**:
1. Valider avec l'équipe
2. Tester manuellement
3. Déployer en production

---

**Généré**: 2 février 2026  
**Version**: 1.0.0
