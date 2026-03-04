
# Documentacio
## index

[Descripcio del projecte](#descripcio-del-projecte)  
[Arquitectura](#arquitectura)  
[Requisits](#requisits)  
[Execucio local](#execucio-local)  
[Execucio docker](#execucio-amb-docker)  


## Descripcio del projecte  



Aquest projecte simula un escenari professional real:

Partir d'una aplicacio funcional i convertir-la en un projecte professional,
versionat correctament, desplegable i documentat.

<small>[Tornar al index](#index)</small>

## Arquitectura

Components del projecte:

- Backend: Una api desenvolupada amb Node.js juntament amb una base de dades Mysql.  
- Frontend: Una aplicacio CRUD desenvolupada amb React que utilitza l'api per fer consultes a la base de dades.  
- Desplegament: Docker...  

Diagrama del projecte:  

Usuari → Frontend → Backend → Base de dades  

<small>[Tornar al index](#index)</small>

## Requisits
Per poder executar el projecte en local, cal tenir instal·lat:

### Requisits generals

- Node.js 
- npm 
- MySQL 
- Docker i Docker Compose

<small>[Tornar al index](#index)</small>

### Requisits del backend

- Node.js
- MySQL

### Requisits del frontend

- Node.js
- Navegador web

<small>[Tornar al index](#index)</small>

## Execucio local

<small>[Tornar al index](#index)</small>

## Execucio amb Docker
Descarreguem el repositori:

    git clone <URL>
Ens situem a la carpeta del projecte:

    cd <CARPETA>
Despleguem l'aplicacio:

    docker-compose up --build

<small>[Tornar al index](#index)</small>

## Troubleshooting bàsic
