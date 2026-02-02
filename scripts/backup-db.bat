@echo off
setlocal

REM Script de sauvegarde PostgreSQL
echo ==========================================
echo Sauvegarde de la base de données PostgreSQL
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

REM Créer un nom de fichier avec timestamp
set TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_FILE=cloud_db_backup_%TIMESTAMP%.sql

echo Création de la sauvegarde : %BACKUP_FILE%
echo.

REM Exécuter pg_dump dans le conteneur
docker exec identity-provider-postgres pg_dump -U postgres -d cloud_db > data\backups\%BACKUP_FILE%

if errorlevel 0 (
    echo + Sauvegarde créée avec succès !
    echo Fichier : data\backups\%BACKUP_FILE%
    echo.
    
    REM Afficher la taille du fichier
    for %%A in ("data\backups\%BACKUP_FILE%") do (
        echo Taille du fichier : %%~zA octets
    )
) else (
    echo X Erreur lors de la sauvegarde !
)

echo.
echo ==========================================
echo Fin de la sauvegarde
echo ==========================================
pause