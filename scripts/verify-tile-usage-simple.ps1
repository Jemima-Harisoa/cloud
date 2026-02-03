# Test rapide pour verifier l'utilisation du serveur de tuiles

Write-Host "Verification de l'utilisation du serveur de tuiles local" -ForegroundColor Cyan
Write-Host ""

# Test 1: Verifier la configuration retournee par l'API
Write-Host "1. Configuration API backend..." -ForegroundColor Yellow
try {
    $config = Invoke-RestMethod -Uri "http://localhost:8080/api/maps/config" -UseBasicParsing
    Write-Host "URL des tuiles configuree: $($config.tileUrl)" -ForegroundColor Green
    
    if ($config.tileUrl -like "*localhost:8081*") {
        Write-Host "L'API pointe bien vers le serveur local!" -ForegroundColor Green
    } else {
        Write-Host "L'API ne pointe PAS vers le serveur local" -ForegroundColor Red
    }
} catch {
    Write-Host "Impossible de recuperer la configuration" -ForegroundColor Red
}

Write-Host ""

# Test 2: Verifier que le serveur de tuiles repond
Write-Host "2. Test serveur de tuiles local..." -ForegroundColor Yellow
try {
    $tileResponse = Invoke-WebRequest -Uri "http://localhost:8081/tile/13/4242/2621.png" -Method Head -UseBasicParsing -TimeoutSec 5
    Write-Host "Serveur de tuiles repond (Status: $($tileResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Serveur de tuiles non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

Write-Host "3. Verification manuelle dans le navigateur..." -ForegroundColor Yellow
Write-Host "Allez sur: http://localhost:3000/map-debugger" -ForegroundColor White
Write-Host "Ou sur: http://localhost:3000/tile-server-status" -ForegroundColor White
Write-Host "Ouvrez F12 -> Network -> filtrez par 'tile' pour voir les requetes" -ForegroundColor White

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Cyan