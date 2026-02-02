# Guide de Démarrage Rapide - Identity Provider & Road Work Reporting

## 🚀 Démarrage Rapide

### Prérequis
- Java 17+
- Maven 3.6+
- Node.js 18+
- Docker et Docker Compose
- Android Studio (pour build APK)

## 📦 Installation

### 1. Démarrer les services Docker

```bash
# Démarrer PostgreSQL et le serveur de tuiles
docker-compose up -d
```

### 2. Backend (Java/Spring Boot)

```bash
cd identity-provider-backend

# Compiler
mvn clean install

# Lancer le serveur
mvn spring-boot:run
```

Le backend sera accessible sur: http://localhost:8080
Documentation Swagger: http://localhost:8080/swagger-ui.html

### 3. Frontend Web (React)

```bash
cd identity-provider-web

# Installer les dépendances
npm install

# Lancer en mode développement
npm start
```

L'application web sera accessible sur: http://localhost:3000

### 4. Application Mobile (Ionic + React)

```bash
cd identity-provider-mobile

# Installer les dépendances
npm install

# Lancer en mode développement
ionic serve
```

L'application mobile sera accessible sur: http://localhost:8100

## 📱 Build APK Android

```bash
cd identity-provider-mobile

# Ajouter la plateforme Android (première fois seulement)
ionic capacitor add android

# Synchroniser les fichiers
ionic capacitor sync android

# Build
ionic capacitor build android

# Ouvrir dans Android Studio
ionic capacitor open android
```

Dans Android Studio:
1. Build > Build Bundle(s) / APK(s) > Build APK(s)
2. L'APK sera généré dans `android/app/build/outputs/apk/debug/app-debug.apk`

## 🔑 Comptes par défaut

### Manager (à créer manuellement)
- Email: manager@example.com
- Mot de passe: Manager123!

Pour créer le compte manager, utilisez l'endpoint `/api/auth/register` via Swagger ou Postman.

## 🗺️ Accès aux différentes interfaces

### Application Web

#### Visiteur (sans compte)
- Accès: http://localhost:3000
- Fonctionnalités:
  - Voir la carte avec les signalements
  - Voir les statistiques (nombre, surface, budget, avancement)
  - Survoler les marqueurs pour voir les détails

#### Utilisateur (avec compte)
- Accès: http://localhost:3000/dashboard
- Fonctionnalités:
  - Toutes les fonctionnalités visiteur
  - Créer un compte
  - Se connecter
  - Filtrer "Mes signalements uniquement"
  - Modifier son profil

#### Manager
- Accès: http://localhost:3000/manager
- Fonctionnalités:
  - Toutes les fonctionnalités utilisateur
  - Gérer les informations des signalements (surface, budget, entreprise)
  - Modifier le statut des signalements (Nouveau, En cours, Terminé)
  - Supprimer des signalements
  - Débloquer les utilisateurs bloqués
  - Synchroniser avec Firebase

### Application Mobile

#### Utilisateurs
- Fonctionnalités:
  - Se connecter avec Firebase
  - Voir la carte avec géolocalisation
  - Signaler un problème en cliquant sur la carte
  - Ajouter une description au signalement
  - Voir tous les signalements ou uniquement les siens
  - Voir les statistiques

## 🛠️ Technologies Utilisées

### Backend
- Java 17
- Spring Boot 3.2
- PostgreSQL
- Firebase (optionnel)
- Swagger/OpenAPI
- JWT Authentication

### Frontend Web
- React 18
- React Router v6
- Leaflet + React-Leaflet
- Axios
- CSS moderne avec variables

### Mobile
- Ionic 7
- React
- Capacitor
- Leaflet Mobile
- Geolocation API
- TypeScript

### Infrastructure
- Docker
- Docker Compose
- OpenStreetMap Tile Server

## 📊 Fonctionnalités Principales

### Module Authentification ✅
- Inscription avec email/mot de passe
- Connexion avec limitation de tentatives (3 max, paramétrable)
- Blocage automatique après échecs
- Gestion des sessions (durée 24h, paramétrable)
- Modification des informations utilisateur
- API de déblocage utilisateur (Manager)
- Documentation Swagger complète

### Module Cartes ✅
- Serveur de tuiles offline (Docker)
- Carte d'Antananarivo avec Leaflet
- Support web et mobile
- Marqueurs colorés par statut

### Module Web - Signalement Travaux Routiers ✅
- Carte interactive avec marqueurs
- Statistiques en temps réel
- Gestion complète des signalements (Manager)
- Filtrage par utilisateur
- Synchronisation Firebase

### Module Mobile - Signalement ✅
- Géolocalisation automatique
- Signalement par clic sur carte
- Upload de description
- Filtre mes signalements
- Interface Ionic moderne

## 🔧 Configuration

### Variables d'environnement Backend

Fichier: `identity-provider-backend/src/main/resources/application.yml`

```yaml
app:
  auth:
    max-login-attempts: 3  # Nombre max de tentatives
    session-duration: 86400  # Durée de session en secondes (24h)
  
  security:
    jwt:
      secret: your-secret-key-change-this-in-production
      expiration: 86400000  # Expiration en millisecondes
```

### Variables d'environnement Frontend Web

Fichier: `identity-provider-web/.env`

```
REACT_APP_API_URL=http://localhost:8080/api
```

### Variables d'environnement Mobile

Fichier: `identity-provider-mobile/src/pages/MapPage.tsx` (ligne 31)

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

Pour Android, utilisez l'IP de votre machine au lieu de localhost:
```typescript
const API_BASE_URL = 'http://192.168.x.x:8080/api';
```

## 🐛 Dépannage

### Backend ne démarre pas
```bash
# Vérifier que PostgreSQL est lancé
docker ps

# Voir les logs
docker logs identity-provider-postgres

# Redémarrer
docker-compose restart postgres
```

### Frontend Web - Erreur CORS
- Vérifier que le backend est lancé
- Vérifier l'URL dans `.env`
- Le backend est configuré pour accepter toutes les origines en développement

### Mobile - Erreur de connexion
- Utiliser l'IP de votre machine au lieu de localhost
- Vérifier que le backend est accessible depuis le réseau
- Désactiver le pare-feu si nécessaire

### Serveur de tuiles ne répond pas
```bash
# Vérifier les logs
docker logs identity-provider-tile-server

# Redémarrer
docker-compose restart tile-server
```

## 📝 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/user/{id}` - Récupérer utilisateur
- `PUT /api/auth/user/{id}` - Modifier utilisateur
- `POST /api/auth/unblock/{id}` - Débloquer utilisateur
- `GET /api/auth/blocked-users` - Liste utilisateurs bloqués

### Signalements Routiers
- `GET /api/road-issues` - Liste des signalements
- `GET /api/road-issues/{id}` - Détails d'un signalement
- `POST /api/road-issues` - Créer un signalement
- `PUT /api/road-issues/{id}` - Modifier un signalement
- `DELETE /api/road-issues/{id}` - Supprimer un signalement
- `GET /api/road-issues/stats` - Statistiques
- `POST /api/road-issues/sync` - Synchroniser avec Firebase

### Cartes
- `GET /api/maps/config` - Configuration carte
- `GET /api/maps/tile-server-status` - Statut serveur tuiles

## 🎨 Design

L'application utilise un design moderne avec:
- Palette de couleurs vibrantes
- Gradients CSS
- Animations et transitions fluides
- Interface responsive
- Dark mode support (mobile)
- Cartes interactives avec marqueurs colorés

## 📄 Licence

Projet privé - Tous droits réservés
