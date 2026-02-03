@echo off
setlocal enabledelayedexpansion

echo =========================================
echo Identity Provider - Script de démarrage
echo =========================================
echo.

REM Vérifier si Docker est installé
where docker >nul 2>nul
if errorlevel 1 (
    echo X Docker n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

REM Vérifier si Docker Compose est installé
where docker-compose >nul 2>nul
if errorlevel 1 (
    echo X Docker Compose n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

echo + Docker et Docker Compose sont installés
echo.

REM Démarrer PostgreSQL
echo Démarrage de PostgreSQL...
call docker-compose up -d postgres

REM Attendre que PostgreSQL soit prêt
echo Attente du démarrage de PostgreSQL...
timeout /t 10

REM Vérifier si PostgreSQL est prêt
:check_postgres
docker exec identity-provider-postgres pg_isready -U postgres >nul 2>nul
if errorlevel 1 (
    echo Attente de PostgreSQL...
    timeout /t 2
    goto check_postgres
)

echo + PostgreSQL est prêt
echo.

REM Démarrer le serveur de tuiles (optionnel)
set /p REPLY="Voulez-vous démarrer le serveur de cartes offline ? (o/N) "
if /i "%REPLY%"=="o" (
    echo.
    echo Démarrage du serveur de tuiles...
    call docker-compose up -d tile-server
    echo + Serveur de tuiles démarré sur http://localhost:8081
)

echo.
echo =========================================
echo Démarrage du projet Identity Provider
echo =========================================
echo.

REM Démarrer le backend
echo Démarrage du backend...
call docker-compose up -d identity-provider-backend

echo.
echo Le projet est en cours de démarrage...
echo - Backend: http://localhost:8080
echo - PostgreSQL: localhost:5432
echo.

pause