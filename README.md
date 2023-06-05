# Développer en local

Modifier les variables d'environnement en copiant et collant les fichiers et en les renommant comme suit :

.env.example > .env
server/tchat/.env.example > server/tchat/.env
server/web/env.example.php > server/web/env.php

lancer les containers avec `docker compose up`

La version hébergée sur l'URL nécéssite un token Cloudflare Tunnel. Si il n'est pas mis, le site est disponible à l'adresse localhost:5173

Pour les emails, il faut modifier le env.php pour y ajouter une API capable de comprendre les requêtes envoyées depuis le PHP et y répondre en envoyant l'email correspondant. 
La fonction peut sinon être remplacée par la fonction mail de PHP pour tester. (Deliverabilité non garantie)