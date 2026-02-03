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

- [ ] Au least 5GB d'espace disque disponible pour les données
  - **Commande à exécuter**: 
    ```bash
    df -h
    ```

### Tâche 1.2: Créer le répertoire pour les données
- [ ] Créer le dossier de stockage des cartes
  ```bash
  mkdir -p ~/identity-provider/tile-server/data
  mkdir -p ~/identity-provider/tile-server/styles
  chmod 777 ~/identity-provider/tile-server/data
  ```

### Tâche 1.3: Récupérer le docker-compose
- [ ] Copier/créer le fichier `docker-compose.yml` dans le dossier racine du projet
  ```bash
  # Localistion: /home/ainasatamandresy/Bureau/Aina dossier/L3-Mandresy/naina/cloud/docker-compose.yml
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
- [ ] Créer le fichier `scripts/download-map-data.sh`
  ```bash
  mkdir -p scripts
  ```

- [ ] Contenu du script:
  ```bash
  #!/bin/bash
  # Script de téléchargement des données OpenStreetMap pour Antananarivo
  
  set -e  # Arrêter en cas d'erreur
  
  echo "📥 Téléchargement des données OpenStreetMap pour Antananarivo..."
  
  TILE_SERVER_DATA_DIR="./tile-server/data"
  mkdir -p $TILE_SERVER_DATA_DIR
  
  # URL pour les données d'Antananarivo depuis Geofabrik
  # Format: Région > Pays > Sous-région
  # URL: Afrique > Madagascar > Région Vakinankaratra (contient Antananarivo)
  
  echo "⏳ Cela peut prendre 10-20 minutes..."
  echo "📍 Source: Geofabrik (OpenStreetMap)"
  
  # Option 1: Télécharger la région entière de Madagascar (plus facile)
  cd $TILE_SERVER_DATA_DIR
  
  if [ ! -f "madagascar-latest.osm.pbf" ]; then
    echo "Téléchargement de Madagascar..."
    wget -c https://download.geofabrik.de/africa/madagascar-latest.osm.pbf
  else
    echo "✅ Fichier madagascar-latest.osm.pbf existe déjà"
  fi
  
  echo "✅ Téléchargement terminé!"
  echo "📊 Taille du fichier: $(du -h madagascar-latest.osm.pbf | cut -f1)"
  
  cd -
  
  echo "⚠️  Prochaine étape: Convertir le fichier PBF en MBTiles"
  echo "Utiliser: tippecanoe ou tilemaker"
  ```

- [ ] Rendre le script exécutable
  ```bash
  chmod +x scripts/download-map-data.sh
  ```

### Tâche 2.2: Exécuter le téléchargement
- [ ] Lancer le script
  ```bash
  ./scripts/download-map-data.sh
  ```
  
- [ ] ⏳ **Attention**: Cela peut prendre 10-20 minutes selon votre connexion
  - **Pendant ce temps**: Vous pouvez commencer à lire la documentation de Leaflet

- [ ] Vérifier que le fichier a été téléchargé
  ```bash
  ls -lh ./tile-server/data/
  ```
  - **Résultat attendu**: Un fichier `madagascar-latest.osm.pbf` de ~250-300MB

### Tâche 2.3: Convertir les données en format MBTiles
- [ ] Installer tilemaker (outil de conversion)
  ```bash
  # Sur macOS
  brew install tilemaker
  
  # Sur Ubuntu/Debian
  sudo apt-get install tilemaker
  
  # Sur Windows avec WSL
  sudo apt-get install tilemaker
  ```

- [ ] Créer le script de conversion
  ```bash
  cat > scripts/convert-map-data.sh << 'EOF'
  #!/bin/bash
  
  set -e
  
  echo "🔄 Conversion des données OpenStreetMap en MBTiles..."
  
  TILE_SERVER_DATA_DIR="./tile-server/data"
  INPUT_FILE="$TILE_SERVER_DATA_DIR/madagascar-latest.osm.pbf"
  OUTPUT_FILE="$TILE_SERVER_DATA_DIR/madagascar.mbtiles"
  
  if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Erreur: Fichier $INPUT_FILE non trouvé"
    exit 1
  fi
  
  echo "📊 Fichier d'entrée: $(du -h $INPUT_FILE | cut -f1)"
  echo "⏳ Cela peut prendre 20-30 minutes..."
  
  # Utiliser tilemaker avec les règles par défaut
  tilemaker \
    --input "$INPUT_FILE" \
    --output "$OUTPUT_FILE" \
    --threads $(nproc) \
    --zoom 0-14
  
  echo "✅ Conversion terminée!"
  echo "📊 Fichier MBTiles: $(du -h $OUTPUT_FILE | cut -f1)"
  EOF
  
  chmod +x scripts/convert-map-data.sh
  ```

- [ ] Exécuter la conversion
  ```bash
  ./scripts/convert-map-data.sh
  ```
  
- [ ] ⏳ **Attention**: Cela peut prendre 20-30 minutes
  - **Pendant ce temps**: Préparez les tâches suivantes

- [ ] Vérifier le fichier MBTiles
  ```bash
  ls -lh ./tile-server/data/*.mbtiles
  ```

### Tâche 2.4: Alternative rapide (sans conversion)
- [ ] **Option si vous manquez de temps**: Utiliser des tuiles pré-générées
  ```bash
  # Créer un répertoire pour les styles
  mkdir -p ./tile-server/styles
  
  # Télécharger un style OSM basique
  curl -o ./tile-server/styles/osm-bright.json \
    https://raw.githubusercontent.com/openmaptiles/positron-gl-style/master/style.json
  ```

---

## ✅ PHASE 3: DÉMARRER LE SERVEUR DE CARTES (15-20 min)

### Tâche 3.1: Démarrer le conteneur Tile Server
- [ ] Lancer le serveur de cartes
  ```bash
  docker-compose up -d tile-server
  ```

- [ ] Vérifier que le conteneur est en cours d'exécution
  ```bash
  docker ps | grep tile-server
  ```
  - **Résultat attendu**: `tile-server    ...    Up X seconds`

- [ ] Vérifier les logs
  ```bash
  docker logs tile-server
  ```

### Tâche 3.2: Tester l'accès au serveur
- [ ] Accéder au serveur dans le navigateur
  ```
  URL: http://localhost:8081
  ```
  - **Résultat attendu**: Page d'accueil de TileServer GL

- [ ] Vérifier la liste des données disponibles
  ```
  URL: http://localhost:8081/data
  ```
  - **Résultat attendu**: Une liste JSON avec les fichiers MBTiles

- [ ] Tester une tuile spécifique (zoom 0, x=0, y=0)
  ```
  URL: http://localhost:8081/data/madagascar/tiles/0/0/0.pbf
  ```

---

## ✅ PHASE 4: INTÉGRATION BACKEND (30-40 min)

### Tâche 4.1: Créer l'API de configuration des cartes
- [ ] Créer le contrôleur `MapController.java`
  ```bash
  # Chemin: identity-provider-backend/src/main/java/com/identity/api/controller/MapController.java
  ```

- [ ] Contenu du contrôleur:
  ```java
  package com.identity.api.controller;
  
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
       * Retourne la configuration de la carte pour Antananarivo
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
          
          // Serveur de tuiles
          config.put("tileServerUrl", "http://localhost:8081");
          config.put("tileSourceId", "madagascar");
          
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
              // Vérifier la connexion au serveur de tuiles
              String tileServerUrl = "http://localhost:8081/data";
              status.put("online", true);
              status.put("url", tileServerUrl);
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
  ```bash
  curl http://localhost:8080/api/maps/config
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
          tileSourceId: 'madagascar'
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

    const { center, defaultZoom, minZoom, maxZoom, tileServerUrl, tileSourceId } = mapConfig;

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
            url={`${tileServerUrl}/data/${tileSourceId}/tiles/{z}/{x}/{y}.png`}
            attribution='© OpenStreetMap contributors'
            maxZoom={maxZoom}
          />
          
          {/* Exemple de marqueur */}
          <Marker position={[center.latitude, center.longitude]}>
            <Popup>
              Antananarivo<br />
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

### Tâche 6.3: Test du serveur de tuiles
- [ ] Accéder à l'interface du serveur
  ```
  http://localhost:8081
  ```

- [ ] Vérifier la liste des données
  ```
  http://localhost:8081/data
  ```

- [ ] Télécharger une tuile de test
  ```bash
  curl -o test_tile.pbf http://localhost:8081/data/madagascar/tiles/13/2048/1234.pbf
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
- [ ] **Backend**: Serveur de cartes API démarré sur le port 8080
- [ ] **Serveur de tuiles**: TileServer GL accessible sur http://localhost:8081
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
```bash
# Arrêter tous les conteneurs
docker-compose down

# Supprimer les données
rm -rf ./tile-server/data/*

# Redémarrer complètement
docker-compose up -d
```

---

## ⚠️ POINTS IMPORTANTS À RETENIR

1. **Données volumineuses**: Le fichier Madagascar OSM fait ~300MB. Le téléchargement peut prendre du temps.

2. **Stockage disque**: Assurez-vous d'avoir au moins 5GB d'espace libre.

3. **Ports utilisés**:
   - Backend: `8080`
   - Tile Server: `8081`
   - Frontend: `3000`

4. **Architecture**: Le module fonctionne avec le Docker Compose existant. Pas besoin de configuration supplémentaire.

5. **Performance**: Les premières fois que vous zoomez/naviguez, le chargement peut être plus lent (les tuiles se cachent).

---

## 📞 SUPPORT

Si vous avez des problèmes:

1. Vérifiez que tous les prérequis sont installés
2. Consultez les logs (`docker logs`)
3. Vérifiez la connectivité avec `curl`
4. Consultez le guide de dépannage

---

**Statut**: ⏳ À commencer
**Priorité**: 🔴 Haute (nécessaire pour le web et mobile)
**Dépendances**: Aucune (peut être fait indépendamment du Module 1)