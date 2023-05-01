# Kittysaver - cicamentők adminisztrációs oldal

Az alkalmazás Nivelle város macskamentő egyesületének munkáját hivatott segíteni. Az elárvult, beteg és kóbor cicák mentése mellett a csapatnak nemsok ideje jut a gazdikereső cicák propagálására. Az alkalmazás ebben nyújt nekik segítséget, általa a felhasználók megtekinthetik a gazdira váró cicákat, és felvehetik a kapcsolatot az egyesülettel.


# Technikai követelmények, előírások
- A frontend Angular alapú, model-service-component architektúra jellemzi.
- A design Bootstrap és CSS/SCSS segítségével készült, az oldal teljesen reszponzív és mobile-first szemlélettel készült. 
- Az alkalmazás MongoDB-alapú, NoSQL adatbázissal dolgozik.
- A felület bizonyos oldalai csak belépés után elérhetőek (JWT-autentikáció).
- NodeJS API, saját API szolgálja ki a frontendet.
- Swagger-alapú dokumentáció tartozik az API-hoz.
- Minden API-útvonalhoz legalább egy unit teszt tartozik.
- A szerepkörök leírását a User Story tartalmazza a README.md-ben.
- Markdown-dokumentáció a repository-ban.
- Az alkalmazás dockerizálva van, konténerből futtatható.


# Az alkalmazás telepítése
- github repository klónozása a saját gépre
- függőségek telepítése
    * backend: 
        * terminálban belépés a KittySaver mappába
        * '''npm i''' parancs futtatása
    * frontend:
        * terminálban belépés a KittySaver, majd a frontend mappába
        * '''npm i''' parancs futtatása
- ha még nincs angular keretrendszer a célgépen: '''npm install -g @angular/cli''' 
- frontend mappában terminálban '''npm run build''' parancs
- KittySaver mappában terminálban '''npm run start''' parancs
VAGY
- konténerizálva Docker segítségével - lásd: Az alkalmazás indítása


# Az alkalmazás indítása
A megadott Docker konténer indítása és inicializálása
- Docker Desktop alkalmazás elindítása
- terminálban KittySaver mappában '''npm run docker-compose''' parancs
- az alkalmazás megnyitása: böngészőben http://localhost:3000
- a belépéshez jelszó-email példa:
    * email: proba@admin.hu
    * password: admin1


# A végpontok dokumentációja
## Swagger
Bongészőben: http://localhost:3000/api/api-docs

## API végpontok
- POST /login – felhasználó bejelentkezés
- POST /refresh – felhasználó bejelentkezésének életben tartása
- POST /logout – felhasználó kilépés
- GET /cat – a cicák lekérdezése
- POST /cat – új cica mentése
- GET /cat/:id – egy adott cica adatainak lekérdezése
- PUT /cat/:id – egy adott cica adatainak frissítése
- DELETE /cat/:id – egy adott cica törlése
- GET /member – a tagok lekérdezése
- POST /member – felhasználói regisztráció
- GET /member/:id – egy adott tag adatainak lekérdezése
- PUT /member/:id – egy adott tag adatainak frissítése
- DELETE /member/:id – egy adott tag törlése
- GET /message – az üzenetek lekérdezése
- POST /message – üzenet küldése az admin számára
- GET /message/:id – egy adott üzenet adatainak lekérdezése
- PUT /message/:id – egy adott üzenet megjelölése olvasottként


# Tesztek
- Kittysaver mappában '''npm i''' parancs futtatása
- Integrációs tesztek futtatása:
    * terminálban a KittySaver mappában '''npm run test:integration''' parancs futtatása
- Unit tesztek futtatása:
    * terminálban a KittySaver mappában '''npm run test:unit''' parancs futtatása


# Entitások

## Cat

Egy gazdira váró kisállat, azaz egy macska. Az oldal tárolja az azonosításhoz nélkülözhetetlen adatait: a nevét (name), a nemét (sex), és a színét (color), emellett a cicát röviden bemutató szöveget (description), képet(imgUrl) illetve hogy éppen örökbe lehet-e fogadni (adoptable). A cica adatait az oldal adminisztrátora kezeli.

## Member

Egy felhasználó, azaz az egyesület regisztrált tagja. Az oldal adatbázisa tartalmazza a nevét (name), címét (address), telefonszámát (phoneNumber), email-címét (email) és jelszavát (password), valamint tároljuk az adminnak küldött üzeneteit is (messages). A regisztrált felhasználók automatikusan “member”, azaz tag jogosultságot (role) kapnak. Az oldal fejlesztője adhat “admin” jogosultságot, az egyesület tulajdonosa rendelkezik ilyennel.

## Message

Egy üzenet, amelyet a regisztrált tagok küldhetnek az egyesület vezetésének (admin). Egy üzenet pontosan egy felhasználótól érkezhet, küldője (sender) mellett az oldal tárolja az üzenet szövegét (messageText), és hogy az admin megtekintette-e már (opened).


# User story, funkciók, képernyők

### Látogatóként
Az oldal látogatói a Home és az Our Story oldalakon információt kaphatnak az egyesület működéséről. Az Owner Hunters oldalon megismerkedhetnek az egyesület védenceivel, megnézhetik a mentett, gazdikereső cicákat. A Get involved oldalon arról találnak információkat, hogy milyen módokon támogathatják az egyesület munkáját. A For Members oldalon léphetnek be a regisztrált felhasználók a tagoknak szóló felületekre, illetve a még nem regisztrált látogatók a Registrate oldalon adataik megadásával hozhatják létre felhasználói fiókjukat, azaz csatlakozhatnak a szervezethez.

### Tagként
A regisztrált felhasználók "member" jogosultságot kapnak az oldalon.
- A felhasználó a Login felületen, email-címe és jelszava megadásával léphet be a fiókjába.
- A tagok fiókjukból küldhetnek üzenetet az egyesület vezetőinek (az admin jogosultságú felhasználóknak) egy egyszerű űrlap kitöltésével.
- A tagok személyes fiókjukban látják és szerkeszthetik saját személyes adataikat.
- A logout gomb segítségével kijelentkezhet a fiókjából, ahonnan az alkalmazás a nyitóoldalra irányítja a felhasználót.

### Adminként
Az egyesület vezetősége rendelkezik admin jogosultsággal, amelyet az oldal fejlesztője állít be. Az admin, vagy adminok a Login felületen történő bejelentkezés után minden funkciót használhatnak, amit a regisztrált tagok is, ugyanakkor számos más funkció is elérhetővé válik számukra a navbar Admin elnevezésű lenyíló menüjében.
- Az admin táblázatos formában kilistázhatja az egyesület védenceit (Cats), tagjait (Members), és a számára érkezett üzeneteket (Messages).
- A cicák vagy a tagok közül egyet kiválasztva módosíthatja azok adatait, valamint törölheti őket.
- Az Add a new cat gombra kattintással új cica adatait viheti fel az adatabázisba.
- Az üzeneteket megtekintés után egy gomb segítségével olvasottként jelölheti meg.
