#!/bin/bash

echo "========================================="
echo "Identity Provider - Script de démarrage"
echo "========================================="
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"
echo ""

# Démarrer PostgreSQL
echo "📦 Démarrage de PostgreSQL..."
docker-compose up -d postgres

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente du démarrage de PostgreSQL..."
sleep 10

# Vérifier si PostgreSQL est prêt
until docker exec identity-provider-postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "⏳ PostgreSQL n'est pas encore prêt, attente..."
    sleep 2
done

echo "✅ PostgreSQL est prêt"
echo ""

# Démarrer le serveur de tuiles (optionnel)
read -p "Voulez-vous démarrer le serveur de cartes offline ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Démarrage du serveur de tuiles..."
    docker-compose up -d tile-server
    echo "✅ Serveur de tuiles démarré sur http://localhost:8081"
fi

echo ""
echo "========================================="
echo "Infrastructure démarrée avec succès !"
echo "========================================="
echo ""
echo "Services disponibles:"
echo "- PostgreSQL: localhost:5432"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "- Serveur de tuiles: http://localhost:8081"
fi
echo ""
echo "Pour démarrer le backend:"
echo "  cd identity-provider-backend"
echo "  mvn spring-boot:run"
echo ""
echo "Pour démarrer le frontend web:"
echo "  cd identity-provider-web"
echo "  npm install"
echo "  npm start"
echo ""
echo "Pour démarrer le mobile:"
echo "  cd identity-provider-mobile"
echo "  npm install"
echo "  ionic serve"
echo ""
