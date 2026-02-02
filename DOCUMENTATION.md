# Identity Provider - Documentation Technique

## Vue d'ensemble

Système de fournisseur d'identité avec modules d'authentification et de cartes, développé en Java (Spring Boot) pour le backend et React pour les frontends web et mobile (Ionic).

## Architecture

### Backend (Java/Spring Boot)
- **Framework**: Spring Boot 3.2.1
- **Base de données**: PostgreSQL (local) ou Firebase (online)
- **Authentification**: JWT avec gestion de sessions
- **Documentation API**: Swagger/OpenAPI

### Frontend Web (React)
- **Framework**: React 18
- **Routing**: React Router v6
- **Cartes**: Leaflet + React-Leaflet
- **HTTP Client**: Axios

### Frontend Mobile (Ionic + React)
- **Framework**: Ionic 7 avec React
- **Plateforme**: iOS et Android via Capacitor
- **Cartes**: Leaflet mobile

## Fonctionnalités

### Module Authentification

#### Inscription
- Endpoint: `POST /api/auth/register`
- Validation email/mot de passe
- Hachage sécurisé des mots de passe (BCrypt)
- Génération automatique de token JWT

#### Connexion
- Endpoint: `POST /api/auth/login`
- Limitation des tentatives: 3 par défaut (paramétrable via `MAX_LOGIN_ATTEMPTS`)
- Blocage automatique après échec
- Durée de session: 24h par défaut (paramétrable via `SESSION_DURATION`)
- Gestion des sessions avec expiration

#### Gestion des utilisateurs
- Endpoint: `GET /api/auth/user/{userId}` - Récupérer un utilisateur
- Endpoint: `PUT /api/auth/user/{userId}` - Modifier les informations
- Endpoint: `POST /api/auth/unblock/{userId}` - Débloquer un utilisateur

#### Déconnexion
- Endpoint: `POST /api/auth/logout`
- Invalidation de la session

### Module Cartes

#### Configuration
- Endpoint: `GET /api/maps/config`
- Retourne la configuration pour Antananarivo
- Centre: -18.8792, 47.5079
- Zoom par défaut: 13

#### Serveur de tuiles
- Serveur OpenStreetMap offline dans Docker
- Données: Antananarivo avec rues
- Port: 8081

## Installation et Déploiement

### Prérequis
- Java 17+
- Maven 3.6+
- Node.js 18+
- Docker et Docker Compose
- PostgreSQL (si mode local)

### 1. Backend

#### Démarrer la base de données PostgreSQL
```bash
cd /home/ainasatamandresy/Bureau/Aina dossier/L3-Mandresy/naina/cloud
docker-compose up -d postgres
```

#### Compiler et lancer le backend
```bash
cd identity-provider-backend
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080`

#### Documentation API (Swagger)
Accéder à: `http://localhost:8080/swagger-ui.html`

### 2. Serveur de cartes

#### Démarrer le serveur de tuiles
```bash
docker-compose up -d tile-server
```

#### Télécharger les données d'Antananarivo
```bash
chmod +x scripts/download-map-data.sh
./scripts/download-map-data.sh
```

Le serveur de tuiles sera accessible sur `http://localhost:8081`

### 3. Frontend Web

#### Installer les dépendances
```bash
cd identity-provider-web
npm install
```

#### Lancer en mode développement
```bash
npm start
```

L'application web sera accessible sur `http://localhost:3000`

#### Build de production
```bash
npm run build
```

### 4. Frontend Mobile

#### Installer les dépendances
```bash
cd identity-provider-mobile
npm install
```

#### Lancer en mode développement
```bash
ionic serve
```

#### Build APK Android
```bash
# Ajouter la plateforme Android
ionic capacitor add android

# Synchroniser les fichiers
ionic capacitor sync android

# Build
ionic capacitor build android

# Ouvrir dans Android Studio pour générer l'APK
ionic capacitor open android
```

Dans Android Studio:
1. Build > Build Bundle(s) / APK(s) > Build APK(s)
2. L'APK sera généré dans `android/app/build/outputs/apk/`

## Configuration

### Variables d'environnement Backend

#### application.yml
```yaml
app:
  auth:
    max-login-attempts: 3  # Nombre max de tentatives
    session-duration: 86400  # Durée de session en secondes
  
  security:
    jwt:
      secret: votre-secret-jwt
      expiration: 86400000  # Expiration en millisecondes
```

#### Profils Spring
- `local`: PostgreSQL local (par défaut)
- `firebase`: Firebase online

Activer un profil:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=firebase
```

### Variables d'environnement Frontend Web

#### .env
```
REACT_APP_API_URL=http://localhost:8080/api
```

### Variables d'environnement Mobile

Modifier dans `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Base de données

### Schéma PostgreSQL

#### Table users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_blocked BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    firebase_uid VARCHAR(255)
);
```

#### Table sessions
```sql
CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    ip_address VARCHAR(50),
    user_agent TEXT
);
```

## Sécurité

### Authentification JWT
- Algorithme: HS512
- Durée de vie: 24 heures (configurable)
- Token stocké dans localStorage (frontend)
- Header: `Authorization: Bearer <token>`

### Protection des mots de passe
- Hachage: BCrypt
- Salt automatique

### Limitation des tentatives
- Maximum: 3 tentatives (configurable)
- Blocage automatique après dépassement
- Déblocage via API admin

### CORS
- Configuré pour accepter toutes les origines en développement
- À restreindre en production

## API Endpoints

### Authentification

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| POST | /api/auth/register | Inscription | Non |
| POST | /api/auth/login | Connexion | Non |
| POST | /api/auth/logout | Déconnexion | Oui |
| GET | /api/auth/user/{id} | Récupérer utilisateur | Oui |
| PUT | /api/auth/user/{id} | Modifier utilisateur | Oui |
| POST | /api/auth/unblock/{id} | Débloquer utilisateur | Oui |

### Cartes

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| GET | /api/maps/config | Configuration carte | Non |
| GET | /api/maps/tile-server-status | Statut serveur tuiles | Non |

## Tests

### Backend
```bash
cd identity-provider-backend
mvn test
```

### Frontend Web
```bash
cd identity-provider-web
npm test
```

## Dépannage

### Erreur de connexion à PostgreSQL
- Vérifier que Docker est lancé: `docker ps`
- Vérifier les logs: `docker logs identity-provider-postgres`
- Redémarrer: `docker-compose restart postgres`

### Erreur CORS
- Vérifier la configuration dans `SecurityConfig.java`
- Vérifier l'URL de l'API dans `.env`

### Serveur de tuiles ne répond pas
- Vérifier: `docker logs identity-provider-tile-server`
- Redémarrer: `docker-compose restart tile-server`

### Token JWT invalide
- Vérifier la clé secrète dans `application.yml`
- Vérifier l'expiration du token
- Supprimer le token du localStorage et se reconnecter

## Performance

### Optimisations recommandées
- Activer le cache Redis pour les sessions
- Utiliser un CDN pour les tuiles de carte
- Compresser les réponses HTTP (Gzip)
- Minifier les assets frontend

## Maintenance

### Nettoyage des sessions expirées
Ajouter un job CRON pour supprimer les sessions expirées:
```java
@Scheduled(cron = "0 0 * * * *") // Toutes les heures
public void cleanExpiredSessions() {
    sessionRepository.deleteByExpiresAtBefore(LocalDateTime.now());
}
```

### Sauvegarde de la base de données
```bash
docker exec identity-provider-postgres pg_dump -U postgres identity_provider > backup.sql
```

### Restauration
```bash
docker exec -i identity-provider-postgres psql -U postgres identity_provider < backup.sql
```

## Support

Pour toute question ou problème:
- Consulter la documentation Swagger: `http://localhost:8080/swagger-ui.html`
- Vérifier les logs backend: `mvn spring-boot:run`
- Vérifier les logs Docker: `docker-compose logs`

## Licence

Projet privé - Tous droits réservés
