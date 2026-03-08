# REPORT – Projecte de Síntesi

## 1. Dades generals

Nom del projecte: Blog CRUD

Integrants:  Adrian , Adria Borras,

Tecnologia principal (Laravel / React / Fullstack):

Enllaç al repositori: https://github.com/adriaBorras/Projecte_desplegament

Data d’entrega: ??

## 2. Estat inicial del projecte

Descriviu la situació del projecte abans de començar el treball de desplegament.


### Estructura inicial del repositori

Partim d'una aplicacio d'un repositori que te una api i un frentend.  

repositori:  
https://github.com/ludiemert/Full_Stack_App?tab=readme-ov-file



### Problemes detectats (si n’hi havia)

No te una base de dades, aixi que s'ha de crear. (blog.sql)



no carrega imatges de dockerhub:
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
![alt text](img/image.png)


### Existència o no de .gitignore

La aplicacio ja porta un .gitignore (pero s'aura d'editar!!!????)

### Existència o no de Docker

No Porta docker, hem d'implementar-ho per complet.

### Problemes de configuració o dependències
Reflexió breu:

Què faltava perquè aquest projecte es pogués considerar “professional”?

## 3. Workflow Git aplicat


### Model de branques utilitzat

Branca main >
Branca Dev >
Branca per cada desenvolupador:
  branca-Borras (Adria Borras)
  branca- "" (Adrian )

### Convencions de noms

  CamelCase  guions "-" per espais.

### Estratègia de merge utilitzada

### Ús (o no) de rebase

### Incloeu exemples reals de commits rellevants (amb missatge i explicació del canvi).



## 4. Conflicte 1 – Mateixa línia

### 4.1 Com s’ha provocat

Expliqueu exactament quins canvis ha fet cada membre.

### 4.2 Missatge d’error generat

Incloeu la sortida real de Git.

### 4.3 Marcadors de conflicte

Mostreu el fragment amb:
```
<<<<<<< HEAD
=======
>>>>>>> branch
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

Expliqueu quines variables són necessàries i per què no es versiona el .env.

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
- Temps dedicat a Docker
- Temps dedicat a documentació

## 10. Reflexió final

Responeu breument:

- Quina ha estat la part més complexa?
- Què faríeu diferent en un projecte real?
- Heu entès realment com funcionen els conflictes i Docker?
