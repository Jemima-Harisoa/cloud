@echo off
setlocal

REM Script pour télécharger les données d'Antananarivo pour le serveur de cartes

echo Téléchargement des données OSM pour Antananarivo...
echo.

REM Créer le répertoire de données si nécessaire
if not exist "osm-data" (
    mkdir osm-data
)

REM Vérifier si wget est disponible
where wget >nul 2>nul
if errorlevel 1 (
    echo X wget n'est pas installé.
    echo Veuillez télécharger les données manuellement depuis :
    echo https://download.geofabrik.de/africa/madagascar-latest.osm.pbf
    echo Sauvegardez le fichier dans le dossier osm-data\
    pause
    exit /b 1
)

REM Télécharger l'extrait de Madagascar (qui contient Antananarivo)
REM URL de Geofabrik pour Madagascar
set MADAGASCAR_URL=https://download.geofabrik.de/africa/madagascar-latest.osm.pbf

REM Télécharger le fichier
echo Téléchargement du fichier...
wget -O osm-data\madagascar-latest.osm.pbf %MADAGASCAR_URL%

echo.
echo Téléchargement terminé!
echo Fichier sauvegardé dans osm-data\madagascar-latest.osm.pbf
echo.
echo Pour importer les données dans le serveur de tuiles Docker:
echo 1. Assurez-vous que Docker est en cours d'exécution
echo 2. Lancez: docker-compose up -d tile-server
echo 3. Importez les données: docker exec -it identity-provider-tile-server import
echo.

pause