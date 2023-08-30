
/**
 * All the API calls
 */

import dayjs from "dayjs";

const URL = 'http://localhost:3001/api';

async function getFlights() {
    // call  /api/flights
    const response = await fetch(URL+'/flights');
    const flights = await response.json();
    if (response.ok) {
        return flights.map((e) => ({fid: e.fid, departure:e.departure, arrival:e.arrival, pid:e.pid,
            departure_date: dayjs(e.departure_date), arrival_date: dayjs(e.arrival_date),
            booked_seats: e.booked_seats, total_seats: e.total_seats, image: e.image}))
    } else {
        throw flights;
    }
}
async function getNonBookedFlights() {
    // call  /api/flights
    const response = await fetch(URL+'/flights/non-booked', {
        credentials: 'include'
    });
    const flights = await response.json();
    if (response.ok) {
        return flights.map((e) => ({fid: e.fid, departure:e.departure, arrival:e.arrival, pid:e.pid,
            departure_date: dayjs(e.departure_date), arrival_date: dayjs(e.arrival_date),
            booked_seats: e.booked_seats, total_seats: e.total_seats, image: e.image}))
    } else {
        throw flights;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
}
async function getReservations() {
    // call  /api/flights
    const response = await fetch(URL+'/reservations', {
        credentials: 'include'
    });
    const flights = await response.json();
    if (response.ok) {
        return flights.map((e) => ({rid: e.rid, fid: e.fid, departure:e.departure, arrival:e.arrival, pid:e.pid,
            departure_date: dayjs(e.departure_date), arrival_date: dayjs(e.arrival_date),
            booked_seats: e.booked_seats, total_seats: e.total_seats, image: e.image}))
    } else {
        throw flights;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
}
async function getFlightSeats(flight_id) {
    // call  /api/flights/:fid
    const response = await fetch(URL+'/flights/' + flight_id);
    const flight = await response.json();
    if (response.ok) {
        return {...flight, departure_date: dayjs(flight.departure_date),  arrival_date: dayjs(flight.arrival_date) };
    } else {
        throw flight;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
}

async function deleteReservation(rid) {
    try {
        const response = await fetch(URL+'/reservations/' + rid, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(message);
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

async function getReservationSeats(rid) {
    // call  /api/reservations/:rid
    const response = await fetch(URL+'/reservations/' + rid, {
        credentials: 'include',
    });
    const reservation = await response.json();
    if (response.ok) {
        return {...reservation, departure_date: dayjs(reservation.departure_date),  arrival_date: dayjs(reservation.arrival_date) };
    } else {
        throw reservation;
    }
}




async function logIn(credentials) {
    let response = await fetch(URL + '/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch(URL+'/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
}

async function getUserInfo() {
    const response = await fetch(URL+'/sessions/current', {
        credentials: 'include'
    });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

async function createReservation(fid, seats) {
    try {
        const response = await fetch(URL + '/reservations/' + fid, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"seats": seats})
        });
        if (response.ok) {
            return await response.json();
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(message);
        }
    } catch (error) {
        throw new Error(error.message)
    }
}



const API = {

    logIn, logOut, getUserInfo, getFlights, getReservationSeats, getFlightSeats, deleteReservation, getNonBookedFlights, getReservations, createReservation
};
export default API;