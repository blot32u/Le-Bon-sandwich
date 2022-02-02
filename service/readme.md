#DEMO IUT

## Variables d'environnement 
- ./services/.env

## Commandes utiles

-Installer les dépendances 

`docker-compose run <nom-du-service> npm i`

-Entrer dans le container :
`docker exec -ti  <nom-du-service> bash`

-Consulter l'API :
`curl -i localhost:3333`

