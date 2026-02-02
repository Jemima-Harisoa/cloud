#!/bin/bash

echo "========================================="
echo "Identity Provider - Build APK Android"
echo "========================================="
echo ""

cd identity-provider-mobile

# Vérifier si Ionic est installé
if ! command -v ionic &> /dev/null; then
    echo "❌ Ionic CLI n'est pas installé."
    echo "Installation d'Ionic CLI..."
    npm install -g @ionic/cli
fi

echo "✅ Ionic CLI est installé"
echo ""

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

echo "✅ Dépendances installées"
echo ""

# Build de l'application
echo "🔨 Build de l'application..."
ionic build

# Ajouter la plateforme Android si nécessaire
if [ ! -d "android" ]; then
    echo "📱 Ajout de la plateforme Android..."
    ionic capacitor add android
fi

# Synchroniser les fichiers
echo "🔄 Synchronisation avec Capacitor..."
ionic capacitor sync android

# Copier les assets
ionic capacitor copy android

echo ""
echo "========================================="
echo "Build terminé !"
echo "========================================="
echo ""
echo "Pour générer l'APK:"
echo "1. Ouvrir Android Studio:"
echo "   ionic capacitor open android"
echo ""
echo "2. Dans Android Studio:"
echo "   Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo ""
echo "3. L'APK sera dans:"
echo "   android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "Ou utilisez la ligne de commande:"
echo "   cd android"
echo "   ./gradlew assembleDebug"
echo ""
