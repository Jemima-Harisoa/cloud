# Test rapide pour vérifier l'utilisation du serveur de tuiles

Write-Host "🔍 Vérification de l'utilisation du serveur de tuiles local" -ForegroundColor Cyan
Write-Host ""

# Test 1: Vérifier la configuration retournée par l'API
Write-Host "1. Configuration API backend..." -ForegroundColor Yellow
try {
    $config = Invoke-RestMethod -Uri "http://localhost:8080/api/maps/config" -UseBasicParsing
    Write-Host "✅ URL des tuiles configurée: $($config.tileUrl)" -ForegroundColor Green
    
    if ($config.tileUrl -like "*localhost:8081*") {
        Write-Host "✅ L'API pointe bien vers le serveur local!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  L'API ne pointe PAS vers le serveur local" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Impossible de récupérer la configuration" -ForegroundColor Red
}

Write-Host ""

# Test 2: Vérifier que le serveur de tuiles répond
Write-Host "2. Test serveur de tuiles local..." -ForegroundColor Yellow
try {
    $tileResponse = Invoke-WebRequest -Uri "http://localhost:8081/tile/13/4242/2621.png" -Method Head -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Serveur de tuiles répond (Status: $($tileResponse.StatusCode))" -ForegroundColor Green
    
    # Vérifier les en-têtes CORS
    if ($tileResponse.Headers['Access-Control-Allow-Origin']) {
        Write-Host "✅ CORS configuré pour le serveur de tuiles" -ForegroundColor Green
    } else {
        Write-Host "⚠️  CORS peut-être manquant" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Serveur de tuiles non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Instructions de vérification manuelle
Write-Host "3. Vérification manuelle dans le navigateur..." -ForegroundColor Yellow
Write-Host "📍 Allez sur: http://localhost:3000/map-debugger" -ForegroundColor White
Write-Host "📍 Ou sur: http://localhost:3000/tile-server-status" -ForegroundColor White
Write-Host "📍 Ouvrez F12 → Network → filtrez par 'tile' pour voir les requêtes" -ForegroundColor White

Write-Host ""
Write-Host "4. Que regarder dans le navigateur:" -ForegroundColor Yellow
Write-Host "   • Les URLs doivent contenir 'localhost:8081'" -ForegroundColor White
Write-Host "   • Pas de requêtes vers '*.tile.openstreetmap.org'" -ForegroundColor White
Write-Host "   • Dans la console: cherchez les logs avec 🗺️" -ForegroundColor White

Write-Host ""
Write-Host "Test complete! Verifiez manuellement dans le navigateur." -ForegroundColor Cyan