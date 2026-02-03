#!/bin/bash

echo "=== Test de connectivité au serveur de tuiles ==="
echo ""

# Vérifier si Docker Compose est démarré
echo "1. Vérification du statut Docker Compose..."
docker-compose ps | grep tile-server

echo ""
echo "2. Test de l'endpoint du serveur de tuiles..."
curl -I http://localhost:8081/ 2>/dev/null || echo "❌ Serveur de tuiles non accessible sur localhost:8081"

echo ""
echo "3. Test d'une tuile spécifique..."
curl -I "http://localhost:8081/tile/13/4242/2621.png" 2>/dev/null || echo "❌ Tuile non accessible"

echo ""
echo "4. Vérification du backend (configuration des cartes)..."
curl -s http://localhost:8080/api/maps/config 2>/dev/null | grep -q "tileServerUrl" && echo "✅ Configuration backend OK" || echo "❌ Backend non accessible"

echo ""
echo "5. Test complet terminé!"
echo ""
echo "Si vous voyez des erreurs ❌, exécutez:"
echo "  docker-compose up -d"
echo "  cd identity-provider-backend && mvn spring-boot:run"