@echo off
setlocal enabledelayedexpansion

echo =========================================
echo Identity Provider - Build APK Android
echo =========================================
echo.

cd identity-provider-mobile

REM Vérifier si Ionic est installé
where ionic >nul 2>nul
if errorlevel 1 (
    echo X Ionic CLI n'est pas installé.
    echo Installation d'Ionic CLI...
    call npm install -g @ionic/cli
)

echo + Ionic CLI est installé
echo.

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo Téléchargement des dépendances...
    call npm install
)

echo + Dépendances installées
echo.

REM Build de l'application
echo Compilation de l'application...
call ionic build

REM Ajouter la plateforme Android si nécessaire
if not exist "android" (
    echo Ajout de la plateforme Android...
    call ionic capacitor add android
)

REM Synchroniser les fichiers
echo Synchronisation avec Capacitor...
call ionic capacitor sync android

REM Copier les assets
call ionic capacitor copy android

echo.
echo =========================================
echo Build terminé !
echo =========================================
echo.

pause