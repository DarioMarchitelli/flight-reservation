'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('db_flights.sqlite', (err) => {
    if (err) throw err;
});

// get all flights
exports.listFlights = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT flights.fid, flights.pid, departure, arrival, departure_date, arrival_date, COUNT(*) as booked_seats, (rows*columns) as total_seats, image FROM flights left join reservations on flights.fid = reservations.fid left join reservation_seats rs on reservations.rid = rs.rid join planes p on flights.pid = p.pid WHERE departure_date IS NOT NULL AND departure_date > strftime(\'%Y-%m-%dT%H:%M:%S\', datetime(\'now\')) GROUP BY flights.fid';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

//if authenticated get only the flight that are not reserved
exports.listNonBookedFlights = (uid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT flights.fid, flights.pid, departure, arrival, departure_date, arrival_date, COUNT(*) as booked_seats, (rows*columns) as total_seats, image FROM flights left join reservations on flights.fid = reservations.fid left join reservation_seats rs on reservations.rid = rs.rid join planes p on flights.pid = p.pid WHERE flights.fid NOT IN (SELECT fid FROM reservations WHERE uid = ' + uid + ' ) AND departure_date IS NOT NULL AND departure_date > strftime(\'%Y-%m-%dT%H:%M:%S\', datetime(\'now\')) GROUP BY flights.fid';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

//if authenticated get the reservations
exports.listReservations = (uid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT reservations.fid, flights.pid, reservations.rid, departure, arrival, departure_date, arrival_date, COUNT(*) as booked_seats, (rows*columns) as total_seats, image FROM flights left join reservations on flights.fid = reservations.fid left join reservation_seats rs on reservations.rid = rs.rid join planes p on flights.pid = p.pid WHERE reservations.uid == ' + uid + ' GROUP BY reservations.rid, flights.pid';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};
// get flight seats
exports.listFlightSeats = (flight_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT flights.fid, flights.pid, departure, arrival, departure_date, arrival_date, rows, columns, seat FROM flights left join reservations on flights.fid = reservations.fid left join reservation_seats rs on reservations.rid = rs.rid join planes p on flights.pid = p.pid  WHERE flights.fid = ' + flight_id;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            let flight = {};

            if (rows !== []) {
                let seats = [];
                rows.forEach((row) => {
                    seats.push(row.seat);
                })
                flight = {...rows[0], seats: seats}
                delete flight.seat;
            }

            resolve(flight);
        });
    });
};

//check fid
exports.checkFid = (fid) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM flights
                     WHERE fid = ${fid}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.length > 0);
        });
    });
};

//check rid
exports.checkRid = (rid) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM reservations
                     WHERE rid = ${rid}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.length > 0);
        });
    });
};
//check fid already booked
exports.checkAlreadyBooked = (fid, uid) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM reservations
                     WHERE fid = ${fid}
                       and uid = ${uid} `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.length > 0);
        });
    });
};
//check fid already booked
exports.checkIsDifferentUser = (rid, uid) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM reservations
                     WHERE rid = ${rid}
                       and uid = ${uid} `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.length === 0);
        });
    });
};

// check booking
exports.checkBook = (fid, uid, seats) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM reservation_seats
                              join reservations on reservation_seats.rid = reservations.rid
                     WHERE fid = ${fid}
                       AND seat IN (${seats.map(v => JSON.stringify(v.toString())).join(', ')})`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let occupiedSeats = rows.map(row => row.seat);
            resolve(occupiedSeats);
        });
    });
};

// create a new reservation
exports.createReservation = (fid, uid, seats) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO reservations(uid, fid) VALUES(?, ?)';
        db.run(sql, [uid, fid], function (err) {

            let rid = this.lastID;
            seats.forEach(seat => {

                const sql = 'INSERT INTO reservation_seats(rid, seat) VALUES(?, ?)';
                db.run(sql, [rid, seat], function (err) {
                });
            })

            resolve(rid);
        });
    });
};

// delete an existing reservation
exports.deleteReservation = (rid) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM reservation_seats WHERE rid = ?';
        db.run(sql, [rid], function (err) {
            if (err) {
                reject(err);
                return;
            } else {
                const sql = 'DELETE FROM reservations WHERE rid = ?';
                db.run(sql, [rid], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    } else
                        resolve(this.changes);  // return the number of affected rows
                });
            }
        });
    });
}


// get flight seats
exports.listReservationSeats = (rid, uid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT flights.fid, flights.pid, reservations.uid, departure, arrival, departure_date, arrival_date, rows, columns, seat FROM flights join reservations on flights.fid = reservations.fid join reservation_seats rs on reservations.rid = rs.rid join planes p on flights.pid = p.pid  WHERE reservations.fid = (SELECT fid FROM reservations WHERE rid = '+ rid +')';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            let flight = {};

            if (rows !== []) {
                let seats = [];
                let reservationSeats = [];
                rows.forEach((row) => {
                    seats.push(row.seat);
                    if(row.uid === uid){
                        reservationSeats.push(row.seat)
                    }
                })
                flight = {...rows[0], seats: seats, reservation_seats: reservationSeats}
                delete flight.seat;
            }

            resolve(flight);
        });
    });
};
