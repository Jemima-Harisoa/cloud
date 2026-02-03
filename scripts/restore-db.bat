@echo off
setlocal

REM Script de restauration PostgreSQL
echo ==========================================
echo Restauration de la base de données PostgreSQL
echo ==========================================
echo.

REM Vérifier si le conteneur PostgreSQL fonctionne
docker ps | findstr identity-provider-postgres >nul
if errorlevel 1 (
    echo X Le conteneur PostgreSQL n'est pas en cours d'exécution.
    echo Démarrez-le d'abord avec : docker-compose up -d postgres
    pause
    exit /b 1
)

REM Lister les fichiers de sauvegarde disponibles
echo Fichiers de sauvegarde disponibles :
echo.
dir /B data\backups\*.sql 2>nul
if errorlevel 1 (
    echo Aucun fichier de sauvegarde trouvé dans data\backups\
    pause
    exit /b 1
)

echo.
set /p BACKUP_FILE="Entrez le nom du fichier de sauvegarde à restaurer : "

REM Vérifier si le fichier existe
if not exist "data\backups\%BACKUP_FILE%" (
    echo X Fichier non trouvé : data\backups\%BACKUP_FILE%
    pause
    exit /b 1
)

echo.
echo ATTENTION : Cette opération va effacer toutes les données actuelles !
set /p CONFIRM="Êtes-vous sûr de vouloir continuer ? (o/N) "
if /i not "%CONFIRM%"=="o" (
    echo Restauration annulée.
    pause
    exit /b 0
)

echo.
echo Restauration en cours...

REM Supprimer la base existante et la recréer
docker exec identity-provider-postgres dropdb -U postgres cloud_db
docker exec identity-provider-postgres createdb -U postgres cloud_db

REM Restaurer les données
docker exec -i identity-provider-postgres psql -U postgres -d cloud_db < data\backups\%BACKUP_FILE%

if errorlevel 0 (
    echo + Restauration terminée avec succès !
) else (
    echo X Erreur lors de la restauration !
)

echo.
echo ==========================================
echo Fin de la restauration
echo ==========================================
pause