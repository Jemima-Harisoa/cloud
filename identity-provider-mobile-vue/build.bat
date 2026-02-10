@echo off
echo.
echo ========================================
echo   BUILD APK signal.eo
echo ========================================
echo.
echo 1. Configuration Java 17
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo 2. Verification Java
java -version
echo.

echo 3. Aller au projet Android
cd /d "D:\Rattrapage\S5\Mr_Rojo\cloud\identity-provider-mobile-vue\android"

echo 4. Nettoyer le build precedent
call gradlew clean

echo 5. Construire l'APK Debug
echo.
echo Construction en cours...
echo ========================================
call gradlew assembleDebug

echo.
echo ========================================
echo   BUILD TERMINE
echo ========================================
echo.
echo L'APK se trouve dans:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.

echo 6. Copier l'APK vers la racine
cd /d "D:\Rattrapage\S5\Mr_Rojo\cloud\identity-provider-mobile-vue"
copy "android\app\build\outputs\apk\debug\app-debug.apk" "signal.eo.apk"

echo.
echo ========================================
echo   APK PRET: signal.eo.apk
echo ========================================
pause
