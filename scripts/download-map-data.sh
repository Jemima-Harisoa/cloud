#!/bin/bash

# Script pour télécharger les données d'Antananarivo pour le serveur de cartes

echo "Téléchargement des données OSM pour Antananarivo..."

# Créer le répertoire de données si nécessaire
mkdir -p ./osm-data

# Télécharger l'extrait de Madagascar (qui contient Antananarivo)
# URL de Geofabrik pour Madagascar
MADAGASCAR_URL="https://download.geofabrik.de/africa/madagascar-latest.osm.pbf"

# Télécharger le fichier
wget -O ./osm-data/madagascar-latest.osm.pbf $MADAGASCAR_URL

echo "Téléchargement terminé!"
echo "Fichier sauvegardé dans ./osm-data/madagascar-latest.osm.pbf"
echo ""
echo "Pour importer les données dans le serveur de tuiles Docker:"
echo "1. Assurez-vous que Docker est en cours d'exécution"
echo "2. Lancez: docker-compose up -d tile-server"
echo "3. Importez les données: docker exec -it identity-provider-tile-server import"
