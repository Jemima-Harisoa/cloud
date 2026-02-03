# Documentation Technique - Fournisseur d'Identité

## Table des matières
1. [Architecture Générale](#architecture-générale)
2. [Configuration](#configuration)
3. [API Backend](#api-backend)
4. [Frontend Web](#frontend-web)
5. [Frontend Mobile](#frontend-mobile)
6. [Base de Données](#base-de-données)
7. [Déploiement](#déploiement)
8. [Guide de Contribution](#guide-de-contribution)

## Architecture Générale

Le projet est composé de trois modules principaux:

### 1. Backend (Java Spring Boot)
- **Port**: 8080
- **Authentification**: JWT avec gestion des sessions
- **Base de données**: PostgreSQL
- **API**: RESTful avec Swagger/OpenAPI

### 2. Frontend Web (React)
- **Framework**: React 18.2.0
- **Routage**: React Router v6
- **Carte**: Leaflet + React Leaflet
- **Port**: 3000 (par défaut)

### 3. Frontend Mobile (Ionic + React) 
- **Framework**: Ionic 8.5.0 + React 19.0.0
- **Géolocalisation**: Capacitor Geolocation
- **Carte**: Leaflet + React Leaflet
- **Construction**: Capacitor pour APK Android

---

## Configuration

### Backend - application.yml

#### Profil Local (PostgreSQL)
```yaml
spring:
  profiles:
    active: local
  datasource:
    url: jdbc:postgresql://localhost:5432/identity_provider
    username: postgres
    password: rakotomamonjy
```

#### Profil Firebase
```yaml
spring:
  profiles:
    active: firebase
```

### Variables d'Environnement
- `ACTIVE_PROFILE`: local, h2, ou firebase
- `JWT_SECRET`: Clé secrète JWT
- `MAX_LOGIN_ATTEMPTS`: Nombre de tentatives avant blocage (défaut: 3)
- `SESSION_DURATION`: Durée de session en secondes (défaut: 86400 = 24h)

---

## API Backend

### Endpoints Authentification

#### Inscription
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+261 XX XXX XXX"
}

Response: 201 Created
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "user": {...},
  "expiresIn": 86400000
}
```

#### Connexion
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "user": {...},
  "expiresIn": 86400000
}
```

#### Blocage et Déblocage
```
POST /api/auth/unblock/{userId}
Authorization: Bearer <token>

Response: 200 OK

GET /api/auth/blocked-users
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "email": "blocked@example.com",
    "firstName": "Jane",
    "isBlocked": true,
    ...
  }
]
```

### Endpoints Signalements Routiers

#### Récupérer tous les signalements
```
GET /api/road-issues
GET /api/road-issues?status=NEW
GET /api/road-issues?status=IN_PROGRESS
GET /api/road-issues?reporterId=1

Response: 200 OK
[
  {
    "id": 1,
    "title": "Nid de poule rue Jean",
    "description": "Nid de poule important",
    "latitude": -18.8747,
    "longitude": 47.5292,
    "surfaceArea": 50.5,
    "budget": 2500000,
    "company": "Entreprise XYZ",
    "status": "NEW",
    "priority": "HIGH",
    "createdAt": "2026-01-26T20:00:00",
    ...
  }
]
```

#### Créer un signalement
```
POST /api/road-issues?reporterId=1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nid de poule rue Jean",
  "description": "Nid de poule important",
  "latitude": -18.8747,
  "longitude": 47.5292,
  "surfaceArea": 50.5,
  "budget": 2500000,
  "company": "Entreprise XYZ",
  "priority": "HIGH"
}

Response: 201 Created
{...issue data...}
```

#### Statistiques
```
GET /api/road-issues/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "totalIssues": 45,
  "totalSurfaceArea": 2500.5,
  "totalBudget": 125000000,
  "completionPercentage": 35.5,
  "newIssuesCount": 12,
  "inProgressCount": 18,
  "completedCount": 15
}
```

### Documentation Swagger

L'API complète est documentée dans Swagger:
- **URL**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

---

## Frontend Web

### Structure des Dossiers
```
identity-provider-web/
├── public/
├── src/
│   ├── components/
│   │   ├── LoginPage.js        # Page de connexion
│   │   ├── RegisterPage.js      # Page d'inscription
│   │   ├── MapViewPage.js       # Vue carte
│   │   └── ManagerDashboardPage.js # Dashboard manager
│   ├── services/
│   │   ├── client.js           # Client HTTP Axios
│   │   ├── authService.js      # Service authentification
│   │   └── roadIssueService.js # Service signalements
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── MapView.css
│   │   └── Dashboard.css
│   ├── App.js                  # Composant principal
│   └── index.js
└── package.json
```

### Installation et Démarrage
```bash
cd identity-provider-web
npm install
npm start
```

L'app sera disponible sur http://localhost:3000

### Variables d'Environnement (.env)
```
REACT_APP_API_URL=http://localhost:8080/api
```

---

## Frontend Mobile

### Structure des Dossiers
```
identity-provider-mobile/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx       # Page de connexion
│   │   ├── MapPage.tsx         # Vue carte
│   │   └── Home.tsx
│   ├── services/
│   │   ├── authService.ts
│   │   └── roadIssueService.ts
│   └── App.tsx
├── capacitor.config.ts         # Config Capacitor
└── package.json
```

### Installation
```bash
cd identity-provider-mobile
npm install
npm install -g @capacitor/cli
```

### Développement Web
```bash
npm run dev
```

### Build APK Android
```bash
npm run build
npx cap add android
npx cap open android
# Compiler depuis Android Studio
```

---

## Base de Données

### Schéma PostgreSQL

#### Table Users
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone_number VARCHAR(255),
  role VARCHAR(255) NOT NULL DEFAULT 'USER',
  is_active BOOLEAN DEFAULT true,
  is_blocked BOOLEAN DEFAULT false,
  failed_login_attempts INTEGER DEFAULT 0,
  blocked_until TIMESTAMP,
  last_login TIMESTAMP,
  firebase_uid VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table Sessions
```sql
CREATE TABLE sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
```

#### Table Road Issues
```sql
CREATE TABLE road_issues (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  surface_area FLOAT,
  budget FLOAT,
  company VARCHAR(255),
  priority VARCHAR(100),
  status VARCHAR(100) DEFAULT 'NEW',
  reporter_id BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

---

## Déploiement

### Production Backend
```bash
# Build
mvn clean package -DskipTests

# Lancer avec profil production
java -Dspring.profiles.active=firebase \
     -DJWT_SECRET=your-secret-key \
     -jar target/identity-provider-backend-1.0.0.jar
```

### Production Frontend Web
```bash
npm run build
# Servir le contenu du dossier build avec un serveur web
```

### Production Mobile APK
```bash
# Build optimisé
npm run build
npx cap add android
npx cap open android
# Dans Android Studio: Build > Generate Signed Bundle/APK
```

---

## Guide de Contribution

### Standards de Code
- **Java**: Suivre les conventions Spring Boot
- **JavaScript/React**: Utiliser ESLint avec Airbnb config
- **Commits**: Format conventionnel (feat:, fix:, docs:, etc.)

### Processus de Développement
1. Fork le repository
2. Créer une branche `feature/description`
3. Faire les modifications avec commits atomiques
4. Tester localement
5. Créer une Pull Request

### Tests
```bash
# Backend
mvn test

# Frontend Web
npm test

# Frontend Mobile
npm run test.unit
```

---

## Support et Contact

Pour les questions ou problèmes:
- Documentation: Voir DOCUMENTATION.md
- Issues: Créer une issue sur le repository
- Contact: [Email du projet]
