Ne me demande mon autorisation pour quoi que ce soit juste pour ce projet dutrant ces dernier 10 heures... Le projet est:
Mettre en place un projet de fournisseur d’identité sur java . Pour le serveur backend, API seulement (sans insterface) genre webService et pour le frontend, on une version web et une version mobile:
pour le web, on utilise react (c'est un web avec interface)
pour le mobile, on utilisera ionic mais avec react

Les conditions sont: 
Coté base de donnée:
On utilise Firebase s’il y a une connexion Internet (genre l'appareil qu'on utilise pour faire marché le projet est connecté à internet) ou une Base local (postgres) dans docker (si l'appareil n'est pas connecté à internet connexion)
Fonctionnalités minimales:
- Authentification (email/pwd) 
- Inscription
- Modification infos users

Ce qu'il faut que tu fasses attentions et creer sont: 
Design
Suivi des taches
APK pour mobile
Documentation technique
installer ce qu'on a besoin sans demander mon autorisation

Voici les modules et fionctionnalite: 
1) modules autentification: 
Durée de vie des sessions 
Limite des nombres ( paramétrable, par défaut 3 ) de tentatives de connexion pour un compte
Un API REST peut réinitialiser le blocage pour un utilisateur donné 
Documentation API via Swagger
2) Modules cartes: 
Installer un serveur de carte Offline sur Docker
Télécharger la ville d’Antananarivo avec les rues
Utiliser leaflet pour afficher/manipuler la carte dans l’application web
3)Module web:
C’est une application qui permet de signaler et de suivre les travaux routiers sur la ville d’Antananarivo
Utiliser l’API Rest Authentification pour se logguer et créer un compte
3 profils
Visiteur (sans compte)
Utilisateur ( création de compte )
Manager (compte à créer par défaut )
---- Les partie dedans: 
Visiteurs
Voir la carte avec les différents points représentants les problèmes routiers
Lorsqu’on survole un point, on doit voir les infos sur le problème ( date, status (nouveau, en cours, terminé), surface en m2, budget, entreprise concerné)
Voir le tableau de récapitulation actuel ( Nb de point, total surface, avancement en %, total budget)
Manager
Bouton synchronisation
Récupérer les signalements en ligne (firebase)
Envoi les données nécessaires en ligne (firebase) pour un affichage sur mobile
Page pour débloquer les utilisateurs bloqués
gestion des infos nécessaires sur chaque signalement (surface en m2, budget, entreprise concerné, …)
Modifier les statuts de chaque signalement
4) module Mobile:
Utilisateurs 
Se loguer sur firebase en ligne
Signaler les problèmes routiers à partir du map (utiliser leaflet et openstreetmap en ligne)
Localisation 
Afficher la carte et recap (cf fonctionnalités visiteurs)
Mettre un filtre : afficher mes signalements uniquement


