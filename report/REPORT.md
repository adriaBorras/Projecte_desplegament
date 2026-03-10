# REPORT – Projecte de Síntesi

## 1. Dades generals

Nom del projecte: Blog CRUD

Integrants:  Adrian , Adria Borras,

Tecnologia principal (React / Fullstack):

Enllaç al repositori: https://github.com/adriaBorras/Projecte_desplegament

Data d’entrega: ??

## 2. Estat inicial del projecte

Descriviu la situació del projecte abans de començar el treball de desplegament.


### Estructura inicial del repositori

Partim d'una aplicacio d'un repositori que te una api i un frentend.  

repositori:  
https://github.com/ludiemert/Full_Stack_App?tab=readme-ov-file



### Problemes detectats (si n’hi havia)

1. No te una base de dades, aixi que s'ha de crear:
` Hem decidit utilitzar mysql com a gestor de bbdd `

Aquestel [ - blog.sql](../db-init/blog.sql) es un arxiu sql q fa el seguent: 

- Crea la base de dades en mysql.
- Crea les taules per els posts i users.
- Inserta registres de exemple per les taules posts i users.

2. El codi de la api no estaba actualitzat per funcionar amb **mysql 8.0.4^** i al posar la applicacio en funcionament amb una versio de mysql retornava un error amb el plugin de authenticacio `mysql_native_password`, no conectaba el client ( llibreria del backend ) amb el servidor, ja que la nova versio mysql esperaba el plugin `caching_sha256_password`, y el client ( api>backend>llibreria mysql ) tractaba conectar amb `mysql_native_password`. 
  - Nomes funcionaba amb versions inferiors. 
  - Vam haver de adaptar el codi una mica per funcionar amb una llibreria mes moderna ( mysql2/promises ), per tal de fer funcionar el codi amb versiones noves i segures. Aqui els comits on s'han fet els canvis: 
  `3fd6b0e7a125e642291f5ac949a0ce014b061242`
  `7db62acfb0cfb4f3ac02bcf727ccb91254850cf1`
  `d70c475818296048aa88dbd99fd429fbb33ee709`
  `c5ca5fbbb957c3e2d6231aa1941de755d1e9237e`
3. Durant la dockeritzacio va donar problemas tambe per el mateix motiu el plugin de autenticacio.
   - Amb el codi actualitzat he pujat la versio al docker al **mysql 8.0.4^**. 

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


2 - l'api de l'aplicacio utilitza yarn.lock com a sistema de control de dependencies. En ves de package-lock.json.
S'ha de tenir en compte a l'hora de crear el dockerfile.  
En ves de fer RUN npm install, s'ha de fer RUN yarn install.  

Reflexió breu:

Què faltava perquè aquest projecte es pogués considerar “professional”?

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

No es fa rebase a la branca main per evitar reescriure l’historial compartit.

### Incloeu exemples reals de commits rellevants (amb missatge i explicació del canvi).

## 4. Conflicte 1 – Mateixa línia

### 4.1 Com s’ha provocat

Expliqueu exactament quins canvis ha fet cada membre.

### 4.2 Missatge d’error generat

Incloeu la sortida real de Git.

### 4.3 Marcadors de conflicte

Mostreu el fragment amb:
```

```
### 4.4 Resolució aplicada

Expliqueu:

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

Descriviu els serveis definits a docker-compose.yml.

### 6.2 Variables d’entorn

Aquest projecte necesita les seguents variables de entron
`DB_HOST=db
DB_PORT=3306
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=blog
MYSQL_USER=
MYSQL_PASSWORD=`

# Backend
BACKEND_PORT=8800

# Frontend
FRONTEND_PORT=3000

### 6.3 Persistència (si s'escau)

Expliqueu l’ús de volums.

###  6.4 Problemes trobats

Incloeu errors reals i com s’han resolt.

## 7. Prova de desplegament des de zero

  Expliqueu els passos exactes que hauria de seguir una persona externa:
- Clonar repositori
- Executar comanda
- Accedir a l’aplicació  

Indiqueu també:
- Ports utilitzats
- Credencials de prova (si n’hi ha)

## 8. Repartiment de tasques

Descriviu què ha fet cada membre de l’equip.

## 9. Temps invertit

Indiqueu aproximadament:
- Temps dedicat a Git
    Adria Borras: 1 hora
- Temps dedicat a Docker

    Adria Borras: 4 hores (No productives, intentant solucionar problemes)
- Temps dedicat a documentació:  

    Adria Borras: 2 hores

## 10. Reflexió final

Responeu breument:

- Quina ha estat la part més complexa?
- Què faríeu diferent en un projecte real?
- Heu entès realment com funcionen els conflictes i Docker?


## 11. Altres problemes durant el projecte.

Adria Borras:  
No poder fer pull de les imatges de dockerhub:
```bash
borras@borras-portable:~$ docker pull hello-world
Using default tag: latest
latest: Pulling from library/hello-world
failed to copy: httpReadSeeker: failed open: failed to do request: Get "https://docker-images-prod.6aa30f8b08e16409b46e0173d6de2f56.r2.cloudflarestorage.com/registry-v2/docker/registry/v2/blobs/sha256/1b/1b44b5a3e06a9aae883e7bf25e45c100be0bb81a0e01b32de604f3ac44711634/data?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=f1baa2dd9b876aeb89efebbfc9e5d5f4%2F20260308%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260308T193228Z&X-Amz-Expires=1200&X-Amz-SignedHeaders=host&X-Amz-Signature=ca58a7f83352b5630fc2e4f4599b96382c7d8bcac448684cbe15dcf02f7f4e93": dial tcp 172.64.66.1:443: i/o timeout
borras@borras-portable:~$ 
```

```bash
borras@borras-portable:~/GitThings/Projecte_desplegament$ curl https://registry-1.docker.io/v2/
{"errors":[{"code":"UNAUTHORIZED","message":"authentication required","detail":null}]}
```

```bash
borras@borras-portable:~/GitThings/Projecte_desplegament$ curl https://172.64.66.1
curl: (35) OpenSSL/3.0.13: error:0A000410:SSL routines::sslv3 alert handshake failure
borras@borras-portable:~/GitThings/Projecte_desplegament$ 

```
Arreclat creant i editant el seguent arxiu:  
desactivar ipv6:
![alt text](img/image.png)



