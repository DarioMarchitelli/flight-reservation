'use strict';

const express = require('express');
const cors = require('cors');
const dao = require('./dao'); // module for accessing the DB
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB


passport.use(new LocalStrategy(
    function (email, password, done) {
        userDao.getUser(email, password).then((user) => {
            if (!user)
                return done(null, false, {message: 'Incorrect email and/or password.'});

            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user);
        }).catch(err => {
        done(err, null);
    });
});

const app = express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({error: 'Not authenticated'});
}

app.use(session({
    secret: 'dariomarchitelli_s310030',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// GET /api/flights
app.get('/api/flights', (req, res) => {
    dao.listFlights()
        .then(flights => {
            res.json(flights);
        })
        .catch((err) => {
            res.status(500).end()
        });
});

// GET /api/flights/non-booked
app.get('/api/flights/non-booked', isLoggedIn, (req, res) => {
    dao.listNonBookedFlights(req.user.uid)
        .then(flights => {
            res.json(flights);
        })
        .catch((err) => {
            res.status(500).end()
        });
});
// GET /api/reservations
app.get('/api/reservations', isLoggedIn, (req, res) => {
    dao.listReservations(req.user.uid)
        .then(flights => {
            res.json(flights);
        })
        .catch((err) => {
            res.status(500).end()
        });
});

// GET /api/flights/:fid
app.get('/api/flights/:fid', [
    check('fid').isInt(),
    check('fid').custom(async fid => {
        const fidDoExists = await dao.checkFid(fid); //Controllo che il fid esista
        if (!fidDoExists) {
            throw new Error('The flight id specified doesnt exists');
        }
    })
] , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    try {
        res.status(200).json(await dao.listFlightSeats(req.params.fid));
    } catch (err) {
        res.status(500).json({ error: `Internal server error` });
    }

    dao.listFlightSeats(req.params.fid)
        .then(flight => {
            res.json(flight);
        })
        .catch((err) => {
            res.status(500).end()
        });
});

// POST /api/reservations/:fid
app.post('/api/reservations/:fid', isLoggedIn, [
    check('fid').isInt(),
    check('seats').isArray({min:1}),
    check('fid').custom(async fid => {
        const fidDoExists = await dao.checkFid(fid); //Controllo che il fid esista
        if (!fidDoExists) {
            throw new Error('The flight id specified doesnt exists');
        }
    })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const alreadyBooked = await dao.checkAlreadyBooked(req.params.fid, req.user.uid); //Controllo che non sia già presente una prenotazione per lo stesso aereo
    if (alreadyBooked) {
        res.status(400).json({ error: `You already have a reservation for this flight.` });
    }
    let occupiedSeats = await dao.checkBook(req.params.fid, req.user.uid, req.body.seats); //Controllo che alcuni dei posti richiesti non siano già prenotati
    if(occupiedSeats.length > 0){
        res.status(400).json({ error: `Some of the booked seats have been already booked.`, occupiedSeats });
    }

    if(!alreadyBooked && !occupiedSeats.length){
        try {
            res.status(200).json(await dao.createReservation(req.params.fid, req.user.uid, req.body.seats));
        } catch (err) {
            res.status(500).json({ error: `Internal server error` });
        }
    }

});



// GET /api/reservations/:rid
app.get('/api/reservations/:rid', isLoggedIn, [
    check('rid').isInt(),
    check('rid').custom(async rid => {
        const ridDoExists = await dao.checkRid(rid); //Controllo che il rid esista
        if (!ridDoExists) {
            throw new Error('The reservation doesn\'t exists');
        }
    })
] , async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const fromDifferentUser = await dao.checkIsDifferentUser(req.params.rid, req.user.uid); //Controllo che non sia un altro utente a star eliminando la prenotazione
        if (fromDifferentUser) {
            res.status(400).json({ error: `You cannot see a reservation created by another user.` });
        } else {
            const reservation = await dao.listReservationSeats(req.params.rid, req.user.uid);
            // number of changed rows is sent to client as an indicator of success
            res.status(200).json(reservation);
        }
    } catch (err) {
        res.status(500).end();
    }
});


// DELETE /api/reservation/<rid>
app.delete('/api/reservations/:rid', isLoggedIn, [
    check('rid').isInt(),
    check('rid').custom(async rid => {
        const ridDoExists = await dao.checkRid(rid); //Controllo che il rid esista
        if (!ridDoExists) {
            throw new Error('The reservation doesn\'t exists');
        }
    })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const deleteFromDifferentUser = await dao.checkIsDifferentUser(req.params.rid, req.user.uid); //Controllo che non sia un altro utente a star eliminando la prenotazione
        if (deleteFromDifferentUser) {
            res.status(400).json({ error: `You cannot delete a reservation created by another user.` });
        } else {
            const numRowChanges = await dao.deleteReservation(req.params.rid);
            // number of changed rows is sent to client as an indicator of success
            res.status(200).json(numRowChanges);
        }
    } catch (err) {
        res.status(500).json({ error: `Internal server error` });
    }
});

// POST /sessions
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});


// DELETE /sessions/current
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else
        res.status(401).json({error: 'Unauthenticated user!'});
});

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
