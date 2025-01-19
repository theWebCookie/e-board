# Aplikacja internetowa do współpracy w czasie rzeczywistym

Ten projekt zawiera aplikację internetową umożliwiającą interaktywną współpracę użytkowników w czasie rzeczywistym. Aplikacja pozwala na rejestrację użytkowników, tworzenie i edycję tablic oraz zarządzanie powiadomieniami. Komunikacja odbywa się za pomocą protokołów HTTP i WebSocket.

## Strona główna

![Home](./images/home.png)

## Informacje o tablicy

![Home](./images/info.png)

## Nowa tablica

![Home](./images/newBoard.png)

## Usuwanie tablicy

![Home](./images/delete.png)

## Interfejs tablicy

![Home](./images/board.png)

## Rysowanie

![Home](./images/drawing.gif)

## Komunikator

![Home](./images/chat.gif)

## Funkcjonalności

- Rejestracja i logowanie użytkowników.
- Edytowanie tablic w czasie rzeczywistym.
- System powiadomień o aktywnościach na tablicach.
- Interaktywny i responsywny interfejs użytkownika.

## Instalacja i uruchomienie

### Wymagania

- Zainstalowany [Node.js](https://nodejs.org/) (zalecana wersja 16 lub wyższa).
- Zainstalowany [Docker](https://www.docker.com/) (do obsługi bazy danych).
- Zainstalowany [Git](https://git-scm.com/) (do klonowania repozytorium).

### Instrukcja instalacji

**Sklonuj repozytorium**:

```bash
git clone https://github.com/theWebCookie/e-board.git
```

**Zainstaluj zależności**:

- W głównym katalogu:

  ```bash
  npm install
  ```

- Przejdź do katalogu `frontend` i zainstaluj zależności:
  ```bash
  cd frontend
  npm install
  ```
- Następnie przejdź do katalogu `backend` i zainstaluj zależności:
  ```bash
  cd ../backend
  npm install
  ```

3. **Konfiguracja bazy danych**:

   - Uruchom kontener z bazą danych:
     ```bash
     docker-compose up -d
     ```
   - Wykonaj migracje Prisma:
     ```bash
     npx prisma migrate dev
     ```
   - (Opcjonalnie) Otwórz bazę danych w Prisma Studio:
     ```bash
     npx prisma studio
     ```

4. **Ustaw zmienne środowiskowe**:
   Utwórz pliki `.env` w katalogach `frontend` i `backend` jak i w katalogu głównym.

   Przykład pliku `.env` dla `backend`:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/e_board?schema=public"
   ```

   Przykład pliku `.env` dla `frontend`:

   ```
   NODE_TLS_REJECT_UNAUTHORIZED=0
   JWT_SECRET=MPpT2HY8iXGQtlocYBxA33m3myx8dnpO
   JWT_ISSUER=http://localhost:3500
   JWT_AUDIENCE=http://localhost:3000
   ```

   Przykład pliku `.env` dla katalogu głównego:

   ```
   POSTGRES_USER: postgres
   POSTGRES_PASSWORD: postgres
   ```

5. **Uruchom aplikację**:

   - Uruchom bazę danych:
     ```bash
     docker-compose up -d
     ```
   - Uruchom frontend:
     ```bash
     cd backend
     npm run dev
     ```
   - Uruchom backend:
     ```bash
     cd ../frontend
     npm run build
     npm start
     ```

6. Otwórz aplikację w przeglądarce pod adresem `http://localhost:3000`.

## Technologie

- **Frontend:** Next.js, TypeScript, TailwindCSS, Shadcn/UI
- **Backend:** Express.js, TypeScript, Prisma ORM
- **Baza danych:** PostgreSQL (uruchamiana w kontenerze Docker)
- **Autoryzacja:** JWT (Passport-JWT, bcrypt)
- **Komunikacja w czasie rzeczywistym:** WebSocket
- **Testowanie:** Jest
- **Narzędzia:** Nodemon, UUID, Jose
