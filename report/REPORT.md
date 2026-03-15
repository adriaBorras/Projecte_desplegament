# REPORT – Projecte de Síntesi

## 1. Dades generals

Nom del projecte: Blog CRUD

Integrants: Adrian , Adria Borras,

Tecnologia principal (React / Fullstack):

Enllaç al repositori: https://github.com/adriaBorras/Projecte_desplegament

Data d’entrega: 15/03/2026

## 2. Estat inicial del projecte

Descriviu la situació del projecte abans de començar el treball de desplegament.

### Estructura inicial del repositori

Partim d'una aplicacio d'un repositori que te una api i un frentend.

El repositori:  
https://github.com/ludiemert/Full_Stack_App?tab=readme-ov-file

### Problemes detectats (si n’hi havia)

No te una base de dades, aixi que s'ha de crear:

![alt text](img/image-1.png)

Tambe hem de fer un entrypoint al docker-compose.yml per poder carregar les dades a l'hora d'executar el contenidor "db".

### Existència o no de .gitignore

La aplicacio ja porta diferents .gitignore un al backend, un al forntend, i un a la carpeta del projecte. Nosaltres els combinarem en un sol .gitignore i el posarem a l'arrel del projecte.

### Existència o no de Docker

No Porta docker, hem d'implementar-lo per complet.

### Problemes de configuració o dependències

1 - Al crear un nou usuari a la base de dades, ens hem trobat aquest error:

```bash
{"code":"ER_NOT_SUPPORTED_AUTH_MODE","errno":1251,"sqlMessage":"Client does not support authentication protocol requested by server; consider upgrading MySQL client","sqlState":"08004","fatal":true}
```

L'aplicacio no te documentades les versions utilitzades i ens hem trobat que per fer-la funcionar hem hagut de fer "Downgrade" de la veriso de Mysql.  
Al docker-composer.yml estavem utilitzant d'imatge: mysql:8, que agafava la versio 8.4.8 pero era nessessari utilitzar una versio inferior. Com per exemple la 8.0.45.

El motiu es que Mysql a partir de la versio 8.04 utilitza caching_sha2_password com a autenticacio per defecte, i en el moment en que es va desenvolupar l'aplicacio Mysql utilitzava mysql_native_password.

Cal tambe afegir la directiva seguent al docker-compose.yml:  
```bash
command: --default-authentication-plugin=mysql_native_password
```

2 - l'api de l'aplicacio utilitza yarn.lock com a sistema de control de dependencies en ves de package-lock.json.
S'ha de tenir en compte a l'hora de crear el dockerfile.  
En ves de fer "RUN npm install", s'ha de fer "RUN yarn install".

Reflexió breu:

Què faltava perquè aquest projecte es pogués considerar “professional”?

Si parlem de l'aplicacio en la que es basa el projecte:
Millor documentacio i, opcionalment algun mitja de desplegament com docker.

## 3. Workflow Git aplicat

### Model de branques utilitzat

Branca main >
Branca Dev >
Branca per cada desenvolupador:
branca-Borras (Adria Borras)
branca-Gonzalez (Adrian )

### Convencions de noms

CamelCase i guions "-" per espais.

### Estratègia de merge utilitzada

Fem merges normals per combinar les branques de desenvolupament de cada desenvolupador amb la branca Dev, un cop comprobat que funciona a la branca Dev, es fa un merge desde la Main amb la Dev.

### Ús (o no) de rebase

No es fa rebase a la branca main perque es una branca compartida i el rebase reescriu l’historial, pot provocar problemes amb altres desenvolupadors.

### Incloeu exemples reals de commits rellevants (amb missatge i explicació del canvi).

## 4. Conflicte 1 – Mateixa línia

### 4.1 Com s’ha provocat

Per provocar aquest conflicte hem cambiat una petita cosa del codi en `/api/routes/auth.js:6` a la branca `branca-Gonzalez`.

![Imatge de com s' ha creat el primer canvi](./img/4-conflictes/primer-canvi.png)

Despres he creat la **PR**, per posteriorment fer el merge a `Dev`.

![Imatge de com es crea la PR](./img/4-conflictes/primera-pr-1.png)
![Imatge de la PR recent creada abans de fer merge](./img/4-conflictes/primera-pr-2.png)

Finalment per acabar de crear el conflicte, el meu company a fet un commit a la seva branca `branca-Borras` que sense fer git pull ni rebase de `Dev` a la seva branca, ha modificat la mateixa línea del codi en `/api/routes/auth.js:6 per arreglar el primer bug i crear el conflicte amb la **PR**.

### 4.2 Missatge d’error generat

Quan intentem crear la **PR** tira el error `cant automatically merge` i ens indica que podem crear la **PR** igualment. 

![Imatge de el error de la PR](./img/4-conflictes/missatge-error.png)

### 4.3 Marcadors de conflicte

La seguent imatge mostra el marcador del conflicte del github, alhora de resoldre la **PR**.

![Imatge dels marcadors del conflicte](./img/4-conflictes/marcadors-conflicte.png)

### 4.4 Resolució aplicada


El company ha entrat al menu de `Resolve conflicts` per resoldre els conflictes desde la **PR** de github, per posteriorment acabar de fer merge de la **PR** a `Dev`.

![Imatge de com nomes es pot fer resolve conflicts](./img/4-conflictes/segona-pr-1.png)
![Imatge dels marcadors del conflicte](./img/4-conflictes/marcadors-conflicte.png)
![Imatge de el conflicte ja resolt](./img/4-conflictes/conflicte-resolt-1.png)

Un cop el company a resolt els conflictes fa merge de la **PR** a `Dev`.

![Imatge de la PR merged a Dev](./img/4-conflictes/conflicte-resolt-2.png)

### Quina decisió s’ha pres

### Per què s’ha escollit aquesta opció

### Com s’ha validat que funciona

### 4.5 Reflexió

Què heu après d’aquest conflicte?

## 5. Conflicte 2 – Dependències o estructura

### 5.1 Descripció del conflicte

### 5.2 Error generat

### 5.3 Resolució aplicada

### 5.4 Diferències respecte al conflicte anterior

## 6. Dockerització

### 6.1 Arquitectura final

Els serveis que hem hagut de definir al docker-compose.yml son:
_Hem creat dos Dockerfile, un per cada servei d'aplicació._

- blog-api: Node.js con Express.
- blog-front: React.
- Base de Datos: MySQL-8.4.

### 6.2 Variables d’entorn

- Hem utilitzat les variables del .env per funcionar amb el docker-compose, aquestes variables s' utlitzan per configurar els serveis db, api,i front.

```sh
# exemple minim del .env que necesita docker.
DB_HOST=db
DB_PORT=3306
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=blog
MYSQL_USER=
MYSQL_PASSWORD=
BACKEND_PORT=8800
FRONTEND_PORT=3000
```

- Per utilzar les variables del **.env** al `docker-compose.yml` hem utilitzat la seguent propietat:

```yaml
env_file:
  - ./.env
```

- Obviament cal referenciar les variables del .env en el docker-compose.yml de la seguent manera:

```yaml
# un exemple amb ports
ports:
  - "${FRONTEND_PORT}:3000"
```

### 6.3 Persistència (si s'escau)

Hem creat un volum per la persistencia del servei de db, anomenat **db_data**.

Declarat en **volumes** como **db_data** amb la seguent syntax al final del `docker-compose.yml` perque docker gestioni de manera interna la persistencia de les db.

```yaml
volumes:
  db_data:
```

I referenciar durant la definicio del servei db:

```yaml
volumes:
  - db_data:/var/lib/mysql
  - ./db-init:/docker-entrypoint-initdb.d
```

A mes a mes com es pot observar a la linea `./db-init:/docker-entrypoint-initdb.d` hem creat un script `blog.sql` a la carpeta db-init que docker ja gestiona internament i executa para inicializar la base de dades.

### 6.4 Problemes trobats

1. Vam tenir problemes amb el servei de db, al docker-compose, ja que vam posar de imatge **mysql:8** i llavors agafaba la versio 8 mes recent, llavors amb aquesta versio el`client mysql del backend` _( llibreria de mysql que conecta el codi de la api amb la db)_ tractaba de autenticarse amb el plugin de autenticacio `mysql_native_password` i el servei de db, esperaba establir la conexio amb `caching_sha256_password`, no lograba establir conexion api amb db, i llavors al frontend al tractar de fer cualsevol cosa que necesitaba db, donava el seguent error:

```bash
{"code":"ER_NOT_SUPPORTED_AUTH_MODE","errno":1251,"sqlMessage":"Client does not support
 authentication protocol requested by server; consider upgrading MySQL client",
 "sqlState":"08004","fatal":true}
```

L'aplicacio no te documentades les versions utilitzades. Vam trobar tres posibles solucions, hem realitzat i documentat les dues mes factibles:

- Fer "Downgrade" de la veriso de Mysql amb una compatible amb el plugin de autenticacio `mysql_native_password`.

  Al docker-composer.yml estavem utilitzant d'imatge: mysql:8, que agafava la versio 8.4.8 pero era nessessari utilitzar una versio inferior per poder utilitzar el plugin `mysql_native_password` com per exemple la 8.0.45, a mes a mes era necesari posar la seguent linea de configuracio al docker-compose per utilitzar el aquest plguin per defecte.

  ```yaml
  command: --default-authentication-plugin=mysql_native_password
  # Amb aquestes dues modificacions podiem tenir l' aplicacio funcionant
  # tot i que d' aquesta manera vulnerable.
  ```

- Vam acabar adaptant el codi una mica per funcionar amb una llibreria mes moderna _( mysql2/promises )_, per tal de fer funcionar el codi amb versiones noves i segures de mysql, y amb el plugin `caching_sha256_password`, d' aquesta manera ja no calia tampoc la linea `--default-authentication-plugin=mysql_native_password` al docker-compose ja que el client de mysql del backend establia conexio amb el plugin modern. Aqui els comits on s'han fet els canvis:

  ```yaml
  3fd6b0e7a125e642291f5ac949a0ce014b061242
  7db62acfb0cfb4f3ac02bcf727ccb91254850cf1
  d70c475818296048aa88dbd99fd429fbb33ee709
  c5ca5fbbb957c3e2d6231aa1941de755d1e9237e
  ```

## 7. Prova de desplegament des de zero (Branca Dev Modificacions Adrian)

Expliqueu els passos exactes que hauria de seguir una persona externa:

- Clonar repositori
- Executar comanda
- Accedir a l’aplicació

Indiqueu també:

- Ports utilitzats
- Credencials de prova (si n’hi ha)


## 7.5 Prova de desplegament des de zero (Branca main Adria Borras)


Expliqueu els passos exactes que hauria de seguir una persona externa:

- Clonar repositori

![alt text](img/image-2.png)

- modificar .env.default a .env amb les credencials desitjades:

![alt text](img/image-5.png)

- Executar comanda

  ![alt text](img/image-3.png)

- Accedir a l’aplicació

![alt text](img/image-4.png)

Indiqueu també:

- Ports utilitzats

```bash
Database port:3307
Backend (API) port:8800
Frontend (App) port:3000
```

- Credencials de prova (si n’hi ha)

```bash
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=blog
MYSQL_USER=bloguser
MYSQL_PASSWORD=blogpass
```

## 8. Repartiment de tasques

Descriviu què ha fet cada membre de l’equip.

1- Desplegament inicial del projecte: Adria Borras
  - Creacio dockerfile: Api i Frontend.
  - Creacio docker-compose.yml
  - Creacio arxius .env
  - Creacio taules BBDD

4 - Els dos integrants de l'equip.  
- Documentat per Adrian.

5 - Adria Borras.
- Documentat per Adria Borras.

6- Documentacio Dockeritzacio : Adrian

7- Prova de desplegament des de zero: Adrian

7.5- Prova de desplegament des de zero (Branca Main): Adria Borras

## 9. Temps invertit

Indiqueu aproximadament:

- Temps dedicat a Git:  
  - Adria Borras: 2 hores

- Temps dedicat a Docker:  
  - Adria Borras: 4 hores (No productives, intentant solucionar problemes)

- Temps dedicat a documentació:  
  - Adria Borras: 3 hores

## 10. Reflexió final

Responeu breument:

- Quina ha estat la part més complexa?  
    Adria Borras:   
    - El treball en equip. 
    - Resoldre els problemes d'utilitzar verisons anteriors al no estar documentades.

- Què faríeu diferent en un projecte real?  
  Adria Borras:  
  - Repartir millor les tasques al inici del projecte.

- Heu entès realment com funcionen els conflictes i Docker?  
  Adria Borras: 
  - Sip! encara que falta mes practica i utilitzar diferents metodologies.

## 11. Altres problemes durant el projecte.

- Adria Borras:

No poder fer pull de les imatges de dockerhub (no se el motiu de per que no podia fer pulls de les imatges):

Comprobar a descarregar una imatge:

```bash
borras@borras-portable:~$ docker pull hello-world
Using default tag: latest
latest: Pulling from library/hello-world
failed to copy: httpReadSeeker: failed open: failed to do request: Get "https://docker-images-prod.6aa30f8b08e16409b46e0173d6de2f56.r2.cloudflarestorage.com/registry-v2/docker/registry/v2/blobs/sha256/1b/1b44b5a3e06a9aae883e7bf25e45c100be0bb81a0e01b32de604f3ac44711634/data?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=f1baa2dd9b876aeb89efebbfc9e5d5f4%2F20260308%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260308T193228Z&X-Amz-Expires=1200&X-Amz-SignedHeaders=host&X-Amz-Signature=ca58a7f83352b5630fc2e4f4599b96382c7d8bcac448684cbe15dcf02f7f4e93": dial tcp 172.64.66.1:443: i/o timeout
borras@borras-portable:~$
```

Comprovem fent una peticio, no tenim credencians i es denega, la conexio es correcta!

```bash
borras@borras-portable:~/GitThings/Projecte_desplegament$ curl https://registry-1.docker.io/v2/
{"errors":[{"code":"UNAUTHORIZED","message":"authentication required","detail":null}]}
```

Arreglat creant i editant el seguent arxiu:  
Desactivar ipv6 i es soluciona:  
![alt text](img/image.png)
