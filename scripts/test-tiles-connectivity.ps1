# Script de test de connectivité au serveur de tuiles

Write-Host "=== Test de connectivité au serveur de tuiles ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker Compose est démarré
Write-Host "1. Vérification du statut Docker Compose..." -ForegroundColor Yellow
try {
    $composeStatus = docker-compose ps | Select-String "tile-server"
    if ($composeStatus) {
        Write-Host "✅ Container tile-server détecté" -ForegroundColor Green
        Write-Host $composeStatus
    } else {
        Write-Host "⚠️  Container tile-server non trouvé" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Docker Compose non disponible" -ForegroundColor Red
}

Write-Host ""

# Test de l'endpoint du serveur de tuiles
Write-Host "2. Test de l'endpoint du serveur de tuiles..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/" -Method Head -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Serveur de tuiles accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Serveur de tuiles non accessible sur localhost:8081" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test d'une tuile spécifique
Write-Host "3. Test d'une tuile spécifique..." -ForegroundColor Yellow
try {
    $tileResponse = Invoke-WebRequest -Uri "http://localhost:8081/tile/13/4242/2621.png" -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Tuile accessible (Status: $($tileResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Tuile non accessible" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Vérification du backend
Write-Host "4. Vérification du backend (configuration des cartes)..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/maps/config" -TimeoutSec 5 -ErrorAction Stop
    if ($backendResponse.tileServerUrl) {
        Write-Host "✅ Configuration backend OK" -ForegroundColor Green
        Write-Host "   Tile Server URL: $($backendResponse.tileServerUrl)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Configuration incomplète" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend non accessible sur localhost:8080" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. Test complet terminé!" -ForegroundColor Cyan
Write-Host ""

# Instructions de dépannage
Write-Host "Si vous voyez des erreurs ❌, exécutez:" -ForegroundColor Yellow
Write-Host "  docker-compose up -d" -ForegroundColor White
Write-Host "  cd identity-provider-backend && mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Pour tester l'interface web:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000/tile-server-status" -ForegroundColor White