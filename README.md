[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/suhcjUE-)
# Exam #2: "Posti aereo"
## Student: s310030 MARCHITELLI DARIO

## React Client Application Routes

- Route `/login`: se non c'è alcun utente loggato riporta alla pagina di login, altrimenti naviga verso la route base "/flights"
- Route `/flights`: mostra sia agli utenti autenticati, sia a quelli non autenticati, la lista di tutti i voli esistenti nel sistema
- Route `/flights/:fid`:  mostra sia agli utenti autenticati, sia a quelli non autenticati, la situazione attuale del volo passato come parametro, non consente alcuna operazione
- Route `/book`: mostra agli utenti autenticati la lista dei voli prenotabili dall'utente in questione, escludendo quelli per cui ha già una prenotazione
- Route `/book/:fid`:  mostra agli utenti autenticati, la situazione attuale del volo passato come parametro consentendo la possibilità di effettuare una prenotazione
- Route `/reservations`: mostra agli utenti autenticati la lista dei voli prenotati dall'utente in questione, inoltre consente l'eliminazione della prenotazione
- Route `/reservations/:rid`:  mostra agli utenti autenticati, la situazione attuale dell'aereo prenotato e i posti prenotati, inoltre consente l'eliminazione della prenotazione

## API Server

- GET `/api/flights`
  - Request parameters: nessuno
  - Autenticazione: non richiesta
  - Restituisce la lista di tutti i voli presenti sul sistema
  - Response: `200 OK` (success) or `500 Internal Server Error` (generic error).
  - Response body:
    ``` 
      [{
        "fid": 1,
        "pid": 3,
        "departure": "Bari",
        "arrival": "Turin",
        "departure_date": "2023-07-14 13:00:00",
        "arrival_date": "2023-07-14 14:30:00",
        "booked_seats": 3,
        "total_seats": 150,
        "image": "https://assets.vogue.com/photos/633eefaf4f85bd18e8ffbc47/master/w_2560%2Cc_limit/GettyImages-690073036.jpg"
      }]
- GET `/api/flights/non-booked`
  - Request parameters: nessuno
  - Autenticazione: richiesta
  - Restituisce la lista di tutti i voli che non sono ancora stati prenotati dall'utente loggato
  - Response: `200 OK` (success) or `500 Internal Server Error` (generic error).
  - Response body:
    ``` 
      [{
        "fid": 2,
        "pid": 1,
        "departure": "Naples",
        "arrival": "Milan",
        "departure_date": "2023-07-15 17:00:00",
        "arrival_date": "2023-07-15 18:30:00",
        "booked_seats": 2,
        "total_seats": 60,
        "image": "https://www.italia.it/content/dam/tdh/en/interests/lombardia/milano/milano-in-48-ore/media/20220119115535-piazza-del-duomo-all-alba-milano-lombardia-shutterstock-1161075943-rid.jpg"
      }]
- GET `/api/flights/:fid`
  - Request parameters:
    - `fid`: id del volo
  - Autenticazione: non richiesta
  - Restituisce le informazioni sul volo (compresa la lista dei posti occupati)
  - Response: `200 OK` (success), `422 unprocessable entity` (wrong fid) or `500 Internal Server Error` (generic error).
  - Response body:
    ``` 
    {
      "fid": 1,
      "pid": 3,
      "departure": "Bari",
      "arrival": "Turin",
      "departure_date": "2023-07-14 13:00:00",
      "arrival_date": "2023-07-14 14:30:00",
      "rows": 25,
      "columns": 6,
      "seats": [
        "1A",
        "1B",
        "1C"
      ]
    }
- POST `/api/flights/:fid`
  - Request parameters:
    - `fid`: id del volo
  - Request body:
    ``` 
      {
        "seats": [
          "3A",
          "3B",
          "3C"
        ]
      }
  - Richiede come parametri la lista di posti da prenotare e il volo, può creare la prenotazione o restituire un errore
  - Response: `200 OK` (success), `422 unprocessable entity` (wrong fid or seats), `400 Bad request` (L'utente ha già una prenotazione per il volo in questione o ci sono alcuni dei posti che sono già stati prenotati da altri utenti) o `500 Internal Server Error` (generic error).

- GET `/api/reservations`
  - Request parameters: nessuno
  - Autenticazione: richiesta
  - Restituisce la lista di tutti i voli prenotati dall'utente loggato
  - Response: `200 OK` (success) or `500 Internal Server Error` (generic error).
  - Response body:
    ```
      [{
        "fid": 1,
        "pid": 3,
        "rid": 18,
        "departure": "Bari",
        "arrival": "Turin",
        "departure_date": "2023-07-14 13:00:00",
        "arrival_date": "2023-07-14 14:30:00",
        "booked_seats": 1,
        "total_seats": 150,
        "image": "https://assets.vogue.com/photos/633eefaf4f85bd18e8ffbc47/master/w_2560%2Cc_limit/GettyImages-690073036.jpg"
      }]
- GET `/api/reservations/:rid`
  - Request parameters:
    - `rid`: id della prenotazione
  - Autenticazione: richiesta
  - Restituisce le informazioni sul volo relativo alla prenotazione (compresa la lista dei posti occupati e di quelli prenotati dall'utente loggato)
  - Response: `200 OK` (success), `422 unprocessable entity` (wrong rid) , `400 Bad request` (Si sta cercando di accedere ad una prenotazione che non è la propria) o `500 Internal Server Error` (generic error).
  - Response body:
     ```
    {
      "fid": 3,
      "pid": 2,
      "uid": 1,
      "departure": "Turin",
      "arrival": "Berlin",
      "departure_date": "2023-07-16 10:00:00",
      "arrival_date": "2023-07-16 11:30:00",
      "rows": 20,
      "columns": 5,
      "seats": [
        "3A",
        "3B",
        "5A",
        "5B",
        "1A"
      ],
      "reservation_seats": [
        "1A"
      ]
    }
- DELETE `/api/reservations/:rid`
  - Request parameters:
    - `rid`: id della prenotazione
  - Autenticazione: richiesta
  - Elimina una prenotazione liberandone i posti, restituisce il numero di righe modificate
  - Response: `200 OK` (success), `422 unprocessable entity` (wrong rid) , `400 Bad request` (Si sta cercando di eliminare una prenotazione che non è la propria) o `500 Internal Server Error` (generic error).
  - Response body:
    - 1

- POST `/api/sessions`
  - Request parameters: nessuno
  - Request body:
    ```
    {
      "username": "harry@test.com",
      "password": "pwd"
    }

  - Crea una nuova sessione a partire dalle credenziali inviate

  - Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

  - Response body: Nessuno




- GET `/api/sessions/current`
  - Request parameters: nessuno
  - Request body: nessuno
  - Verifica che la sessione è ancora valida e ritorna le informazioni sull'utente loggato. Deve essere fornito un cookie con un session id valido.
  - Response: `201 Created` (success) or `401 Unauthorized` (error).

  - Response body:
    ```
    {
      "username": "harry@test.com",
      "id": 4,
      "name": "Harry"
    }


- DELETE `/api/sessions/current`
  - Request parameters: nessuno
  - Request body: nessuno
  - Elimina la sessione corrent. Deve essere fornito un cookie con un session id valido.
  - Response: `200 OK` (success) or `500 Internal Server Error` (generic error).
  - Response body: nessuno





## Database Tables

- Table `users` - contains (uid, email, username, salt, password)
- Table `planes` - contains (pid, title, rows, columns)
- Table `flights` - contains (fid, departure, arrival, pid, departure_date, arrival_date, image)
- Table `reservations` - contains (rid, uid, fid)
- Table `reservation_seats` - contains (rsid, rid, seat)

## Main React Components

- `FlightList` (in `FlightList.js`): viene utilizzato nelle altre schermate per mostrare una lista di aerei
- `ViewAllFlights` (in `ViewAllFlights.js`): mostra la lista di tutti i voli memorizzati nel sistema
- `BookFlight` (in `BookFlight.js`): mostra la lista dei voli prenotabili
- `Reservations` (in `Reservations.js`): mostra la lista dei voli prenotati e ne consente la cancellazione
- `FlightDetail` (in `FlightDetail.js`): mostra la situazione di un volo senza consentire alcuna operazione
- `BookSeats` (in `BookSeats.js`): mostra la situazione di un volo da prenotare e ne consente la prenotazione
- `ReservationDetail` (in `ReservationDetail.js`): mostra la situazione di un volo prenotato e ne consente la visualizzazione die posti prenotati e la cancellazione
- `ModalBook` (in `ModalBook.js`): contiene la modale che viene utilizzata per consentire all'utente di scegliere con quale delle due modalità prenotare i posti
- `NavbarWrapper` (in `NavbarWrapper.js`): contiene la navbar
- `NotLoggedIn` (in `NotLoggedIn.js`): viene utilizzato in sostituzione ad una pagina che necessita di un utente loggato, ma non c'è alcun utente loggato
- `DefaultRoute` (in `DefaultRoute.js`): pagina di 404
- `LoginForm` (in `LoginForm.js`): form per il login

## Screenshot

![Screenshot](./img/Screenshot 5.PNG)

## Users Credentials

- enrico@test.com, pwd (contiene 2 prenotazioni)
- luigi@test.com, pwd (contiene 2 prenotazioni)
- alice@test.com, pwd (non contiene prenotazioni)
- harry@test.com, pwd (non contiene prenotazioni)
