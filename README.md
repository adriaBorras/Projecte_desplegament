
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

<small>[Tornar al index](#index)</small>

### Requisits del backend

- Node.js
- MySQL

### Requisits del frontend

- Node.js
- Navegador web

<small>[Tornar al index](#index)</small>

## Execucio local

fer un clone del repositori del projecte Blog:
```bash
https://github.com/ludiemert/Full_Stack_App.git
```

Obrir projecte:  
Situarnos a la carpeta de l'api i executar el servei:
```bash
npm start
```
Situarnos a la carpeta del frontend i executar el servei:
```bash
npm start
```
obrir al navegador la seguent ruta:
```bash
http://localhost:3000/
```

<small>[Tornar al index](#index)</small>

## Execucio amb Docker
1- Descarreguem el repositori:

    git clone git@github.com:adriaBorras/Projecte_desplegament.git

2- Ens situem a la carpeta del projecte:

    cd Projecte_desplegament

3- Cal renombrar els arxius .env.default a .env i omplir les dades de conexio a la bbdd.

4- Despleguem l'aplicacio:

    docker-compose up --build

<small>[Tornar al index](#index)</small>

## Troubleshooting bàsic

Si el backend no pot connectar amb MySQL:

Comprovar .env:
- Que les credencials al fitxer .env son correctes.
