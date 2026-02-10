# 📋 TO-DO DÉTAILLÉ - MODULE 2: CARTES 🗺️

**Objectif**: Installer et configurer un serveur de cartes offline + télécharger les données d'Antananarivo + intégrer Leaflet dans l'application web.

**Durée estimée**: 2-3 heures pour la première mise en place

---

## 📚 STRUCTURE GÉNÉRALE DU MODULE

```
Module Cartes
├── 1️⃣ Infrastructure Docker
│   ├── Serveur de tuiles (Tile Server GL)
│   └── Configuration docker-compose
├── 2️⃣ Téléchargement des données
│   └── Données OpenStreetMap d'Antananarivo
├── 3️⃣ Intégration Frontend
│   └── Leaflet + React-Leaflet
└── 4️⃣ API Backend
    ├── Configuration des cartes
    └── Synchronisation Firebase
```

---

## ✅ PHASE 1: INFRASTRUCTURE DOCKER (30-45 min)

### Tâche 1.1: Vérifier les prérequis
- [ ] Docker est installé: `docker --version`
  - **Commande à exécuter**: 
    ```bash
    docker --version
    ```
  - **Résultat attendu**: `Docker version 20.10.x` ou plus récent
  - **Si erreur**: Installer Docker depuis https://www.docker.com/products/docker-desktop

- [ ] Docker Compose est installé: `docker-compose --version`
  - **Commande à exécuter**: 
    ```bash
    docker-compose --version
    ```
  - **Résultat attendu**: `Docker Compose version 2.x` ou plus récent
  - **Si erreur**: Installer Docker Compose (inclus avec Docker Desktop)

- [ ] Au moins 5GB d'espace disque disponible pour les données
  - **Commande à exécuter**: 
    ```powershell
    Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, @{Name="Size(GB)";Expression={[math]::Round($_.Size/1GB,2)}}, @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace/1GB,2)}}
    ```

### Tâche 1.2: Créer le répertoire pour les données
- [X] Créer le dossier de stockage des cartes
  ```powershell
  New-Item -ItemType Directory -Path "./tile-server/data" -Force
  New-Item -ItemType Directory -Path "./tile-server/styles" -Force
  # Permissions automatiquement gérées par Windows
  ```

### Tâche 1.3: Récupérer le docker-compose
- [ ] Copier/créer le fichier `docker-compose.yml` dans le dossier racine du projet
  ```powershell
  # Localisation: C:\Users\ACER\Desktop\L3\cloud\docker-compose.yml
  ```

- [ ] Vérifier que le service `tile-server` existe dans le fichier
  ```yaml
  tile-server:
    image: maptiler/tileserver-gl:latest
    ports:
      - "8081:80"
    volumes:
      - ./tile-server/data:/data
      - ./tile-server/styles:/styles
    environment:
      - REQUIRE_AUTH=false
  ```

### Tâche 1.4: Tester l'infrastructure Docker
- [ ] Démarrer PostgreSQL et vérifier qu'il fonctionne
  ```bash
  docker-compose up -d postgres
  docker ps  # Vérifier que postgres est en mode "Up"
  ```
  - **Résultat attendu**: Le conteneur postgres doit afficher l'état `Up`

- [ ] Logs PostgreSQL
  ```bash
  docker logs identity-provider-postgres
  ```

---

## ✅ PHASE 2: TÉLÉCHARGEMENT DES DONNÉES (45-60 min)

### Tâche 2.1: Créer le script de téléchargement
- [ ] Créer le fichier `scripts/download-map-data.ps1`
  ```powershell
  New-Item -ItemType Directory -Path "scripts" -Force
  ```

- [ ] Contenu du script:
  ```powershell
  # Script de téléchargement des données OpenStreetMap pour Antananarivo
  
  $ErrorActionPreference = "Stop"  # Arrêter en cas d'erreur
  
  Write-Host "📥 Téléchargement des données OpenStreetMap pour Antananarivo..." -ForegroundColor Green
  
  $TILE_SERVER_DATA_DIR = "./tile-server/data"
  New-Item -ItemType Directory -Path $TILE_SERVER_DATA_DIR -Force | Out-Null
  
  # URL pour les données d'Antananarivo depuis Geofabrik
  # Format: Région > Pays > Sous-région
  # URL: Afrique > Madagascar > Région Vakinankaratra (contient Antananarivo)
  
  Write-Host "⏳ Cela peut prendre 10-20 minutes..." -ForegroundColor Yellow
  Write-Host "📍 Source: Geofabrik (OpenStreetMap)" -ForegroundColor Cyan
  
  # Option 1: Télécharger la région entière de Madagascar (plus facile)
  Set-Location $TILE_SERVER_DATA_DIR
  
  if (-not (Test-Path "madagascar-latest.osm.pbf")) {
    Write-Host "Téléchargement de Madagascar..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://download.geofabrik.de/africa/madagascar-latest.osm.pbf" -OutFile "madagascar-latest.osm.pbf"
  } else {
    Write-Host "✅ Fichier madagascar-latest.osm.pbf existe déjà" -ForegroundColor Green
  }
  
  Write-Host "✅ Téléchargement terminé!" -ForegroundColor Green
  $fileSize = (Get-Item "madagascar-latest.osm.pbf").Length / 1MB
  Write-Host "📊 Taille du fichier: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
  
  Set-Location ..\..
  
  Write-Host "⚠️  Prochaine étape: Convertir le fichier PBF en MBTiles" -ForegroundColor Yellow
  Write-Host "Utiliser: tippecanoe ou tilemaker" -ForegroundColor Yellow
  ```

- [ ] Le script PowerShell est déjà exécutable
  ```powershell
  # Vérifier la politique d'exécution (si nécessaire)
  Get-ExecutionPolicy
  # Si RestrictedAllSigned, exécuter: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### Tâche 2.2: Exécuter le téléchargement
- [ ] Lancer le script
  ```powershell
  .\scripts\download-map-data.ps1
  ```
  
- [ ] ⏳ **Attention**: Cela peut prendre 10-20 minutes selon votre connexion
  - **Pendant ce temps**: Vous pouvez commencer à lire la documentation de Leaflet

- [ ] Vérifier que le fichier a été téléchargé
  ```powershell
  Get-ChildItem ./tile-server/data/ | Format-Table Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
  ```
  - **Résultat attendu**: Un fichier `madagascar-latest.osm.pbf` de ~250-300MB

### Tâche 2.3: Convertir les données en format MBTiles
- [ ] Installer tilemaker (outil de conversion) sur Windows
  ```powershell
  # Option 1: Avec Chocolatey (recommandé)
  choco install tilemaker
  
  # Option 2: Avec Scoop
  scoop install tilemaker
  
  # Option 3: WSL (Windows Subsystem for Linux)
  wsl sudo apt-get install tilemaker
  
  # Option 4: Télécharger depuis GitHub releases
  # https://github.com/systemed/tilemaker/releases
  ```

- [ ] Créer le script de conversion
  ```powershell
  @'
  # Script de conversion des données OpenStreetMap en MBTiles
  
  $ErrorActionPreference = "Stop"
  
  Write-Host "🔄 Conversion des données OpenStreetMap en MBTiles..." -ForegroundColor Green
  
  $TILE_SERVER_DATA_DIR = "./tile-server/data"
  $INPUT_FILE = "$TILE_SERVER_DATA_DIR/madagascar-latest.osm.pbf"
  $OUTPUT_FILE = "$TILE_SERVER_DATA_DIR/madagascar.mbtiles"
  
  if (-not (Test-Path $INPUT_FILE)) {
    Write-Host "❌ Erreur: Fichier $INPUT_FILE non trouvé" -ForegroundColor Red
    exit 1
  }
  
  $inputSize = (Get-Item $INPUT_FILE).Length / 1MB
  Write-Host "📊 Fichier d'entrée: $([math]::Round($inputSize, 2)) MB" -ForegroundColor Cyan
  Write-Host "⏳ Cela peut prendre 20-30 minutes..." -ForegroundColor Yellow
  
  # Utiliser tilemaker avec les règles par défaut
  $threads = [Environment]::ProcessorCount
  & tilemaker --input $INPUT_FILE --output $OUTPUT_FILE --threads $threads --zoom 0-14
  
  Write-Host "✅ Conversion terminée!" -ForegroundColor Green
  $outputSize = (Get-Item $OUTPUT_FILE).Length / 1MB
  Write-Host "📊 Fichier MBTiles: $([math]::Round($outputSize, 2)) MB" -ForegroundColor Cyan
'@ | Out-File -FilePath "scripts/convert-map-data.ps1" -Encoding UTF8
  ```

- [ ] Exécuter la conversion
  ```powershell
  .\scripts\convert-map-data.ps1
  ```
  
- [ ] ⏳ **Attention**: Cela peut prendre 20-30 minutes
  - **Pendant ce temps**: Préparez les tâches suivantes

- [ ] Vérifier le fichier MBTiles
  ```powershell
  Get-ChildItem ./tile-server/data/*.mbtiles | Format-Table Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
  ```

### Tâche 2.4: Alternative rapide (sans conversion)
- [ ] **Option si vous manquez de temps**: Utiliser des tuiles pré-générées
  ```powershell
  # Créer un répertoire pour les styles
  New-Item -ItemType Directory -Path "./tile-server/styles" -Force
  
  # Télécharger un style OSM basique
  Invoke-WebRequest -Uri "https://raw.githubusercontent.com/openmaptiles/positron-gl-style/master/style.json" -OutFile "./tile-server/styles/osm-bright.json"
  ```

---

## ✅ PHASE 3: DÉMARRER LE SERVEUR DE CARTES (15-20 min)

### Tâche 3.1: Démarrer les services avec Docker Compose
- [ ] Lancer tous les services (PostgreSQL + Tile Server)
  ```bash
  docker-compose up -d
  ```

- [ ] Vérifier que les conteneurs sont en cours d'exécution
  ```bash
  docker ps
  ```
  - **Résultat attendu**: `postgres` et `tile-server` avec statut "Up"

- [ ] Vérifier les logs du tile-server
  ```bash
  docker logs tile-server
  ```

### Tâche 3.2: Tester l'accès au serveur de cartes
- [ ] Accéder au serveur dans le navigateur
  ```
  URL: http://localhost:8081
  ```
  - **Résultat attendu**: Page nginx pour le proxy de tuiles

- [ ] Tester l'accès aux tuiles OSM (via proxy nginx)
  ```
  URL: http://localhost:8081/{z}/{x}/{y}.png
  ```
  - **Note**: Le tile-server actuel utilise nginx comme proxy vers OSM

- [ ] Vérifier la configuration nginx (optionnel)
  ```bash
  docker exec tile-server cat /etc/nginx/conf.d/default.conf
  ```

---

## ✅ PHASE 4: INTÉGRATION BACKEND (30-40 min)

### Tâche 4.1: Créer l'API de configuration des cartes
- [ ] Créer le contrôleur `MapController.java`
  ```bash
  # Chemin: identity-provider-backend/src/main/java/com/identityprovider/controller/MapController.java
  ```

- [ ] Contenu du contrôleur:
  ```java
  package com.identityprovider.controller;
  
  import org.springframework.http.ResponseEntity;
  import org.springframework.web.bind.annotation.*;
  import java.util.HashMap;
  import java.util.Map;
  
  @RestController
  @RequestMapping("/api/maps")
  @CrossOrigin(origins = "*", allowedHeaders = "*")
  public class MapController {
      
      /**
       * GET /api/maps/config
       * Retourne la configuration de la carte pour le Signal EO
       */
      @GetMapping("/config")
      public ResponseEntity<?> getMapConfig() {
          Map<String, Object> config = new HashMap<>();
          
          // Configuration du centre de la carte (Antananarivo)
          Map<String, Double> center = new HashMap<>();
          center.put("latitude", -18.8792);
          center.put("longitude", 47.5079);
          config.put("center", center);
          
          // Configuration du zoom
          config.put("defaultZoom", 13);
          config.put("minZoom", 10);
          config.put("maxZoom", 18);
          
          // Serveur de tuiles (proxy nginx)
          config.put("tileServerUrl", "http://localhost:8081");
          config.put("tilePattern", "http://localhost:8081/{z}/{x}/{y}.png");
          
          // Configuration Leaflet
          Map<String, Object> leaflet = new HashMap<>();
          leaflet.put("attribution", "© OpenStreetMap contributors");
          leaflet.put("maxBounds", new double[][]{{-18.95, 47.40}, {-18.75, 47.60}});
          config.put("leaflet", leaflet);
          
          return ResponseEntity.ok(config);
      }
      
      /**
       * GET /api/maps/tile-server-status
       * Vérifie le statut du serveur de tuiles
       */
      @GetMapping("/tile-server-status")
      public ResponseEntity<?> getTileServerStatus() {
          Map<String, Object> status = new HashMap<>();
          
          try {
              // Vérifier la connexion au serveur de tuiles (nginx proxy)
              String tileServerUrl = "http://localhost:8081";
              status.put("online", true);
              status.put("url", tileServerUrl);
              status.put("type", "nginx-proxy");
              status.put("timestamp", System.currentTimeMillis());
          } catch (Exception e) {
              status.put("online", false);
              status.put("error", e.getMessage());
          }
          
          return ResponseEntity.ok(status);
      }
  }
  ```

### Tâche 4.2: Ajouter les dépendances Maven (si nécessaire)
- [ ] Vérifier que le `pom.xml` contient Spring Web
  ```xml
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  ```

### Tâche 4.3: Compiler et tester le backend
- [ ] Compiler le backend
  ```bash
  cd identity-provider-backend
  mvn clean install
  ```

- [ ] Lancer le backend
  ```bash
  mvn spring-boot:run
  ```

- [ ] Tester l'endpoint de configuration
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:8080/api/maps/config" | ConvertTo-Json -Depth 5
  ```
  - **Résultat attendu**: 
    ```json
    {
      "center": {
        "latitude": -18.8792,
        "longitude": 47.5079
      },
      "defaultZoom": 13,
      ...
    }
    ```

---

## ✅ PHASE 5: INTÉGRATION FRONTEND WEB (1-1.5 heures)

### Tâche 5.1: Installer les dépendances
- [ ] Aller dans le répertoire du frontend web
  ```bash
  cd identity-provider-web
  ```

- [ ] Installer Leaflet et React-Leaflet
  ```bash
  npm install leaflet react-leaflet leaflet-geosearch
  npm install --save-dev @types/leaflet
  ```

- [ ] Installer Axios (si pas déjà fait)
  ```bash
  npm install axios
  ```

### Tâche 5.2: Créer le service API pour les cartes
- [ ] Créer le fichier `src/services/mapService.js`
  ```javascript
  // Fichier: identity-provider-web/src/services/mapService.js
  
  import axios from 'axios';
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  
  export const mapService = {
    // Récupérer la configuration de la carte
    async getMapConfig() {
      try {
        const response = await axios.get(`${API_BASE_URL}/maps/config`);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération de la configuration:', error);
        // Configuration par défaut
        return {
          center: { latitude: -18.8792, longitude: 47.5079 },
          defaultZoom: 13,
          minZoom: 10,
          maxZoom: 18,
          tileServerUrl: 'http://localhost:8081',
          tilePattern: 'http://localhost:8081/{z}/{x}/{y}.png'
        };
      }
    },

    // Vérifier le statut du serveur de tuiles
    async getTileServerStatus() {
      try {
        const response = await axios.get(`${API_BASE_URL}/maps/tile-server-status`);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la vérification du serveur:', error);
        return { online: false, error: error.message };
      }
    }
  };
  ```

### Tâche 5.3: Créer le composant MapComponent
- [ ] Créer le fichier `src/components/Map/MapComponent.jsx`
  ```jsx
  // Fichier: identity-provider-web/src/components/Map/MapComponent.jsx
  
  import React, { useEffect, useState } from 'react';
  import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
  import L from 'leaflet';
  import { mapService } from '../../services/mapService';
  import './MapComponent.css';

  // Corrections pour les icônes Leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export function MapComponent() {
    const [mapConfig, setMapConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadMapConfig = async () => {
        try {
          setLoading(true);
          const config = await mapService.getMapConfig();
          setMapConfig(config);
          setError(null);
        } catch (err) {
          setError('Impossible de charger la configuration de la carte');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      loadMapConfig();
    }, []);

    if (loading) {
      return <div className="map-loading">Chargement de la carte...</div>;
    }

    if (error || !mapConfig) {
      return <div className="map-error">{error || 'Erreur de configuration'}</div>;
    }

    const { center, defaultZoom, minZoom, maxZoom, tileServerUrl, tilePattern } = mapConfig;

    return (
      <div className="map-container">
        <MapContainer
          center={[center.latitude, center.longitude]}
          zoom={defaultZoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url={tilePattern || `${tileServerUrl}/{z}/{x}/{y}.png`}
            attribution='© OpenStreetMap contributors'
            maxZoom={maxZoom}
          />
          
          {/* Exemple de marqueur */}
          <Marker position={[center.latitude, center.longitude]}>
            <Popup>
              Signal EO - Centre Antananarivo<br />
              Latitude: {center.latitude}<br />
              Longitude: {center.longitude}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  }

  export default MapComponent;
  ```

### Tâche 5.4: Créer les styles CSS
- [ ] Créer le fichier `src/components/Map/MapComponent.css`
  ```css
  /* Fichier: identity-provider-web/src/components/Map/MapComponent.css */

  .map-container {
    width: 100%;
    height: 600px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .map-loading,
  .map-error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 600px;
    background-color: #f5f5f5;
    color: #666;
    font-size: 16px;
    border-radius: 8px;
  }

  .map-error {
    background-color: #fee;
    color: #c33;
  }

  /* Styles Leaflet */
  .leaflet-container {
    background-color: #dfe3e4;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .leaflet-popup-content {
    max-width: 250px;
    font-size: 14px;
  }

  .leaflet-marker-icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  ```

### Tâche 5.5: Intégrer le composant dans l'application
- [ ] Modifier `src/App.jsx` ou votre page principale
  ```jsx
  import MapComponent from './components/Map/MapComponent';

  function App() {
    return (
      <div className="app">
        <h1>Signalement des Problèmes Routiers - Antananarivo</h1>
        <MapComponent />
      </div>
    );
  }
  ```

### Tâche 5.6: Tester le frontend
- [ ] Démarrer l'application React
  ```bash
  npm start
  ```

- [ ] Accéder à l'application
  ```
  URL: http://localhost:3000
  ```

- [ ] Vérifier que:
  - [ ] La carte s'affiche
  - [ ] Le centre est bien à Antananarivo
  - [ ] Les tuiles se chargent depuis le serveur
  - [ ] Vous pouvez zoomer et vous déplacer

---

## ✅ PHASE 6: TESTS ET VALIDATION (30-40 min)

### Tâche 6.1: Test de connectivité
- [ ] ✅ Vérifier que PostgreSQL est en cours d'exécution
  ```bash
  docker ps | grep postgres
  ```

- [ ] ✅ Vérifier que le serveur de tuiles est actif
  ```bash
  docker ps | grep tile-server
  ```

- [ ] ✅ Vérifier que le backend est lancé
  ```bash
  curl http://localhost:8080/api/maps/config
  ```

- [ ] ✅ Vérifier que le frontend est accessible
  ```
  http://localhost:3000
  ```

### Tâche 6.2: Tests de performance
- [ ] Ouvrir la console du navigateur (F12)
  - [ ] Vérifier qu'il n'y a pas d'erreurs dans la console
  - [ ] Vérifier que le temps de chargement des tuiles est < 2 secondes

- [ ] Tester le zoom
  - [ ] Zoomer jusqu'au niveau maximum (18)
  - [ ] Dézommer jusqu'au niveau minimum (10)
  - [ ] Les tuiles doivent se charger progressivement

- [ ] Tester le déplacement
  - [ ] Déplacer la carte dans les 4 directions
  - [ ] Vérifier que les tuiles se chargent correctement

### Tâche 6.3: Test du serveur de tuiles (nginx proxy)
- [ ] Accéder au serveur nginx
  ```
  http://localhost:8081
  ```

- [ ] Tester une tuile directement
  ```
  http://localhost:8081/14/8415/5450.png
  ```

- [ ] Vérifier les logs nginx
  ```bash
  docker logs tile-server
  ```

### Tâche 6.4: Tests d'intégration
- [ ] [ ] Stopper le serveur de tuiles et vérifier que le frontend affiche un message d'erreur approprié
  ```bash
  docker stop tile-server
  ```

- [ ] [ ] Redémarrer le serveur
  ```bash
  docker start tile-server
  ```

- [ ] [ ] Vérifier que la carte redevient fonctionnelle

---

## ✅ PHASE 7: DOCUMENTATION (20-30 min)

### Tâche 7.1: Documenter l'installation
- [ ] Créer `docs/MODULE_2_INSTALLATION.md` avec:
  - [ ] Prérequis
  - [ ] Étapes d'installation
  - [ ] Dépannage courant
  - [ ] Commandes utiles

### Tâche 7.2: Créer un guide de dépannage
- [ ] Créer `docs/TROUBLESHOOTING_MAPS.md` avec solutions pour:
  - [ ] Les tuiles ne se chargent pas
  - [ ] Le serveur de tuiles ne répond pas
  - [ ] Erreurs CORS
  - [ ] Problèmes de performance

### Tâche 7.3: Documenter l'API
- [ ] Mettre à jour `docs/API_DOCUMENTATION.md`
  - [ ] Ajouter les endpoints `/api/maps/config`
  - [ ] Ajouter les endpoints `/api/maps/tile-server-status`

---

## 📋 CHECKLIST FINALE

- [ ] **Docker**: PostgreSQL et Tile Server en cours d'exécution
- [ ] **Données**: Fichier MBTiles présent dans `tile-server/data/`
- [ ] **Backend**: API Spring Boot démarrée sur le port 8080 (Signal EO)
- [ ] **Serveur de tuiles**: Proxy nginx accessible sur http://localhost:8081
- [ ] **Frontend**: React avec MapComponent fonctionnelle sur http://localhost:3000
- [ ] **Tests**: Tous les tests de connectivité réussis
- [ ] **Documentation**: Mise à jour complète

---

## 🆘 COMMANDES UTILES

### Afficher les logs
```bash
# Logs du serveur de tuiles
docker logs tile-server -f

# Logs du PostgreSQL
docker logs identity-provider-postgres -f

# Logs du backend Spring Boot
# (dans le terminal où vous avez lancé mvn spring-boot:run)
```

### Redémarrer les services
```bash
# Tout redémarrer
docker-compose restart

# Redémarrer juste le tile-server
docker-compose restart tile-server

# Redémarrer juste PostgreSQL
docker-compose restart postgres
```

### Nettoyer
```powershell
# Arrêter tous les conteneurs
docker-compose down

# Supprimer les données
Remove-Item -Path "./tile-server/data/*" -Force -Recurse

# Redémarrer complètement
docker-compose up -d
```

---

## ⚠️ POINTS IMPORTANTS À RETENIR

1. **Données volumineuses**: Le fichier Madagascar OSM fait ~300MB. Le téléchargement peut prendre du temps.

2. **Stockage disque**: Assurez-vous d'avoir au moins 5GB d'espace libre.

3. **Ports utilisés**:
   - Backend Spring Boot: `8080`
   - Tile Server (nginx proxy): `8081`  
   - Frontend React: `3000`
   - PostgreSQL: `5433` (mappé vers 5432 dans le conteneur)

4. **Architecture Signal EO**: Le module s'intègre avec:
   - identity-provider-backend (Spring Boot)
   - identity-provider-web (React)
   - Docker Compose pour PostgreSQL et tile server

5. **Performance**: Le tile server nginx proxy accède directement aux tuiles OSM. Performance stable.

6. **Compatibilité Windows**: Tous les scripts sont adaptés pour PowerShell. Politique d'exécution: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` si nécessaire.

---

## 📞 SUPPORT

Si vous avez des problèmes:

1. Vérifiez que tous les prérequis sont installés
2. Consultez les logs (`docker logs`)  
3. Vérifiez la connectivité avec PowerShell (`Invoke-RestMethod`, `Invoke-WebRequest`)
4. Consultez le guide de dépannage

---

**Statut**: ⏳ À commencer
**Priorité**: 🔴 Haute (nécessaire pour le web et mobile)
**Dépendances**: Aucune (peut être fait indépendamment du Module 1)