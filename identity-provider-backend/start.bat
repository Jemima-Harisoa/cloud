@echo off
echo.
echo ========================================
echo   LANCEMENT SPRING BOOT
echo ========================================
echo.
echo 1. Mettre Java 17
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo 2. Aller au projet
cd /d "D:\Rattrapage\S5\Mr_Rojo\cloud\identity-provider-backend"

echo 3. Lancer l'application
echo.
echo Appuyez sur CTRL+C pour arreter
echo ========================================
mvn spring-boot:run -Dspring-boot.run.profiles=local

echo.
echo ========================================
echo   APPLICATION ARRETEE
echo ========================================
pause