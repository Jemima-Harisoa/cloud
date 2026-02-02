# Guide de Construction APK - Identity Provider Mobile

## Prérequis

- Node.js 16+
- Android SDK (via Android Studio)
- Java 11+ (via Android Studio)
- Capacitor CLI: `npm install -g @capacitor/cli`

## Étapes de Construction

### 1. Préparation du Projet

```bash
cd identity-provider-mobile

# Installer les dépendances
npm install --legacy-peer-deps

# Build de production
npm run build
```

### 2. Initialisation d'Android

```bash
# Ajouter la plateforme Android
npx cap add android

# Synchroniser les fichiers
npx cap sync android
```

### 3. Configuration Android

```bash
# Ouvrir le projet dans Android Studio
npx cap open android
```

**Dans Android Studio:**
1. Attendre le chargement complet du projet
2. File → Project Structure
3. Configurer le SDK:
   - SDK Location: `/home/ainasatamandresy/Android/Sdk` (ou le chemin de votre SDK)
   - Build Tools Version: 34.0.0 ou plus récent

### 4. Construction du Signed APK

**Option 1: Signed APK (Play Store)**

1. Build → Generate Signed Bundle / APK
2. Choisir APK
3. Créer une clé de signature ou utiliser une existante
4. Sélectionner Release build
5. Cliquer sur Finish

**Option 2: Build Unsigned (Tests)**

```bash
# Dans Android Studio
Build → Build Variants → Release
Build → Build APK
```

### 5. Localisation du Fichier APK

L'APK sera généré dans:
```
identity-provider-mobile/android/app/release/app-release.apk
```

ou pour unsigned:
```
identity-provider-mobile/android/app/release/app-release-unsigned.apk
```

---

## Configuration Recommandée pour Production

### build.gradle (android/app/build.gradle)

```gradle
android {
    compileSdk 34
    
    defaultConfig {
        applicationId "com.identityprovider.roadworks"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

### AndroidManifest.xml (android/app/src/main/AndroidManifest.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <application>
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## Optimisations de Performance

### 1. ProGuard Configuration

Créer `android/app/proguard-rules.pro`:
```
# Axios
-keep class axios.** { *; }
-keep interface axios.** { *; }

# React
-keep class com.facebook.react.** { *; }
-keep interface com.facebook.react.** { *; }

# Leaflet
-keep class leaflet.** { *; }
```

### 2. Réduction de Taille

```bash
# Activer minification dans build.gradle
minifyEnabled true
shrinkResources true
```

### 3. Code Splitting

Dans `vite.config.ts`:
```typescript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          leaflet: ['leaflet', 'react-leaflet'],
        }
      }
    }
  }
}
```

---

## Distribution

### Google Play Store

1. **Créer un compte Google Play Developer**
   - https://play.google.com/console
   - Coût: $25 (une seule fois)

2. **Préparer l'APK Signé**
   - Générer via Android Studio (voir ci-dessus)
   - Taille minimum: > 1 MB

3. **Configuration Play Store**
   - App Title: "Signalement Routier Antananarivo"
   - Category: Maps & Navigation
   - Permissions: Location, Internet
   - Target Audience: All ages

4. **Upload**
   - Google Play Console → Créer une app
   - Version de production → Upload APK
   - Remplir les détails requis
   - Soumettre pour approbation

### Distribution Directe

Pour tester en interne:
```bash
# Installer sur téléphone connecté
adb install android/app/release/app-release.apk

# Ou envoyer le fichier APK directement
# Les utilisateurs peuvent l'installer via un navigateur fichier
```

---

## Déploiement Continu (CI/CD)

### GitHub Actions

Créer `.github/workflows/build-apk.yml`:

```yaml
name: Build APK

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
    
    - name: Install Dependencies
      run: npm install --legacy-peer-deps
    
    - name: Build
      run: npm run build
    
    - name: Create APK
      run: |
        npx cap add android
        npx cap sync android
        cd android && ./gradlew assembleRelease
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-release.apk
        path: android/app/build/outputs/apk/release/app-release.apk
```

---

## Troubleshooting

### Erreur: SDK Not Found
```bash
# Installer le SDK Android
apt-get install android-sdk

# Ou configurer manuellement:
export ANDROID_HOME=~/Android/Sdk
export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$PATH
```

### Erreur: Gradle Build Failed
```bash
# Nettoyer et reconstruire
cd android
./gradlew clean
./gradlew assembleRelease
```

### APK Trop Grand
- Activer ProGuard minification
- Utiliser code splitting
- Réduire les dépendances npm

### Permissions Manquantes
Vérifier `android/app/src/main/AndroidManifest.xml`

---

## Versioning

Mettre à jour la version:

**android/app/build.gradle:**
```gradle
versionCode 2
versionName "1.1.0"
```

Format de version recommandé:
- Version 1.0.0 pour la première release
- Incrementer: 1.1.0, 1.2.0, etc. (changements mineurs)
- Incrementer: 2.0.0 (changements majeurs)

---

## Support

- [Capacitor Documentation](https://capacitorjs.com/)
- [Android Studio Guide](https://developer.android.com/studio)
- [Play Store Guide](https://developer.android.com/distribute)
- Consulter les logs: `adb logcat`
