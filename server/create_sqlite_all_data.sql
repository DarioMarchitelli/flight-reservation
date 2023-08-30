BEGIN TRANSACTION;
drop table reservation_seats;
drop table reservations;
drop table flights;
drop table planes;
drop table users;
CREATE TABLE IF NOT EXISTS "users"
(
    "uid"      INTEGER PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "username"    TEXT,
    "salt"     TEXT,
    "password" TEXT
);
CREATE TABLE IF NOT EXISTS "planes"
(
    "pid"          INTEGER PRIMARY KEY AUTOINCREMENT,
    "title"        TEXT,
    "rows"          INTEGER,
    "columns"          INTEGER
);

CREATE TABLE IF NOT EXISTS "flights"
(
    "fid"          INTEGER PRIMARY KEY AUTOINCREMENT,
    "departure"        TEXT,
    "arrival"        TEXT,
    "pid"          INTEGER,
    "departure_date" TEXT,
    "arrival_date" TEXT,
    "image" TEXT,
    FOREIGN KEY (pid) REFERENCES planes (pid)
);

CREATE TABLE IF NOT EXISTS "reservations"
(
    "rid"          INTEGER PRIMARY KEY AUTOINCREMENT,
    "uid"          INTEGER,
    "fid"          INTEGER,
    FOREIGN KEY (uid) REFERENCES users (uid),
    FOREIGN KEY (fid) REFERENCES flights (fid)
);

CREATE TABLE IF NOT EXISTS "reservation_seats"
(
    "rsid"          INTEGER PRIMARY KEY AUTOINCREMENT,
    "rid"          INTEGER,
    "seat" TEXT,
    FOREIGN KEY (rid) REFERENCES reservations (rid)
);



/* USERS */
INSERT INTO "users"
VALUES (1, 'enrico@test.com', 'enrico', '123348dusd437840',
        'bddfdc9b092918a7f65297b4ba534dfe306ed4d5d72708349ddadb99b1c526fb'); /* password='pwd' */
INSERT INTO "users"
VALUES (2, 'luigi@test.com', 'luigi', '7732qweydg3sd637',
        '498a8d846eb4efebffc56fc0de16d18905714cf12edf548b8ed7a4afca0f7c1c');
INSERT INTO "users"
VALUES (3, 'alice@test.com', 'alice', 'wgb32sge2sh7hse7',
        '09a79c91c41073e7372774fcb114b492b2b42f5e948c61d775ad4f628df0e160');
INSERT INTO "users"
VALUES (4, 'harry@test.com', 'harry', 'safd6523tdwt82et',
        '330f9bd2d0472e3ca8f11d147d01ea210954425a17573d0f6b8240ed503959f8');

/* PLANES */
INSERT INTO "planes"
VALUES (1, 'locale', 15, 4);
INSERT INTO "planes"
VALUES (2, 'regionale', 20, 5);
INSERT INTO "planes"
VALUES (3, 'internazionale', 25, 6);

/* FLIGHTS */
INSERT INTO "flights"
VALUES (1, 'Bari', 'Turin', 3, '2023-07-14 13:00:00', '2023-07-14 14:30:00', 'https://assets.vogue.com/photos/633eefaf4f85bd18e8ffbc47/master/w_2560%2Cc_limit/GettyImages-690073036.jpg');
INSERT INTO "flights"
VALUES (2, 'Naples', 'Milan', 1, '2023-07-15 17:00:00', '2023-07-15 18:30:00', 'https://www.italia.it/content/dam/tdh/en/interests/lombardia/milano/milano-in-48-ore/media/20220119115535-piazza-del-duomo-all-alba-milano-lombardia-shutterstock-1161075943-rid.jpg');
INSERT INTO "flights"
VALUES (3, 'Turin', 'Berlin', 2, '2023-07-16 10:00:00', '2023-07-16 11:30:00', 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVybGlufGVufDB8fDB8fHww&w=1000&q=80');

/* RESERVATIONS */
INSERT INTO "reservations"
VALUES (1, 1, 1);
INSERT INTO "reservations"
VALUES (2, 1, 3);
INSERT INTO "reservations"
VALUES (3, 2, 2);
INSERT INTO "reservations"
VALUES (4, 2, 3);

/* RESERVATION SEATS*/
INSERT INTO "reservation_seats"
VALUES (1, 1, '1A');
INSERT INTO "reservation_seats"
VALUES (2, 1, '1B');
INSERT INTO "reservation_seats"
VALUES (3, 2, '3A');
INSERT INTO "reservation_seats"
VALUES (4, 2, '3B');
INSERT INTO "reservation_seats"
VALUES (5, 3, '1A');
INSERT INTO "reservation_seats"
VALUES (6, 3, '1B');
INSERT INTO "reservation_seats"
VALUES (7, 4, '5A');
INSERT INTO "reservation_seats"
VALUES (8, 4, '5B');



COMMIT;
