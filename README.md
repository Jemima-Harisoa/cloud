# Identity Provider

Système de fournisseur d'identité avec modules d'authentification et de cartes.

## 🚀 Démarrage rapide

### Services avec Docker
```bash
# Démarrer tous les services (PostgreSQL + Serveur de tuiles)
docker-compose up -d

# Ou démarrer seulement certains services
docker-compose up -d postgres tile-server
```

### Backend
```bash
# Lancer le backend
cd identity-provider-backend
mvn spring-boot:run
```

### Frontend Web
```bash
cd identity-provider-web
npm install
npm start
```

### Mobile
```bash
cd identity-provider-mobile
npm install
ionic serve
```

## 🗺️ Serveur de tuiles

Le projet intègre un serveur de tuiles local pour les cartes.

### Configuration
- **Port**: 8081
- **Endpoint**: http://localhost:8081/tile/{z}/{x}/{y}.png
- **Source**: OpenStreetMap via proxy nginx

### Test de connectivité
```bash
# Avec PowerShell (Windows)
.\scripts\test-tiles-connectivity.ps1

# Ou via l'interface web
http://localhost:3000/tile-server-status
```

### Utilisation dans le code
Le frontend web récupère automatiquement l'URL du serveur de tuiles via l'API backend :
- Configuration: `GET /api/maps/config`
- Status: `GET /api/maps/tile-server-status`

## 📚 Documentation

Voir [DOCUMENTATION.md](./DOCUMENTATION.md) pour la documentation complète.

## 🔑 Fonctionnalités

### Module Authentification
- ✅ Inscription avec email/mot de passe
- ✅ Connexion avec limitation de tentatives (3 max)
- ✅ Blocage automatique après échecs
- ✅ Gestion des sessions (durée 24h)
- ✅ Modification des informations utilisateur
- ✅ API de déblocage utilisateur
- ✅ Documentation Swagger

### Module Cartes
- ✅ Serveur de tuiles offline (Docker)
- ✅ Carte d'Antananarivo avec Leaflet
- ✅ API de configuration
- ✅ Support web et mobile

## 🛠️ Technologies

- **Backend**: Java 17, Spring Boot 3.2, PostgreSQL, Firebase
- **Frontend Web**: React 18, Leaflet, Axios
- **Mobile**: Ionic 7, React, Capacitor
- **Infrastructure**: Docker, Docker Compose

## 📱 Build APK

```bash
cd identity-provider-mobile
ionic capacitor add android
ionic capacitor sync android
ionic capacitor build android
ionic capacitor open android
```

Dans Android Studio: Build > Build APK(s)

## 🔗 URLs

- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- Frontend Web: http://localhost:3000
- Serveur de tuiles: http://localhost:8081

## 📝 Licence

Projet privé - Tous droits réservés
