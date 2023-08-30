import {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import DefaultRoute from './containers/DefaultRoute';
import FlightDetail from "./containers/FlightDetail.jsx";
import API from "./API.jsx";
import LoginForm from "./containers/LoginForm.jsx"
import BookFlight from "./containers/BookFlight.jsx";
import ViewAllFlights from "./containers/ViewAllFlights.jsx";
import Reservations from "./containers/Reservations.jsx";
import BookSeats from "./containers/BookSeats.jsx";
import ReservationDetail from "./containers/ReservationDetail";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // here you have the user info, if already logged in
                const user = await API.getUserInfo();
                setLoggedIn(true);
                setUser(user);
            } catch (err) {
                // NO need to do anything: user is simply not yet authenticated
                //handleError(err);
            }
        };
        checkAuth();
    }, []);

    const doLogOut = async () => {
        await API.logOut();
        setLoggedIn(false);
        setUser(undefined);
    }

    const loginSuccessful = (user) => {
        setUser(user);
        setLoggedIn(true);
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Navigate replace to='/flights'/>}/>
                <Route path='/flights' element={<ViewAllFlights logout={doLogOut} user={user}/>}/>
                <Route path='/book' element={<BookFlight logout={doLogOut} user={user}/>}/>
                <Route path='/reservations' element={<Reservations logout={doLogOut} user={user}/>}/>
                <Route path='/reservations/:rid' element={<ReservationDetail logout={doLogOut} user={user}/>}/>
                <Route path='/login' element={loggedIn ? <Navigate replace to='/flights'/> :
                    <LoginForm loginSuccessful={loginSuccessful} logout={doLogOut} user={user}/>}/>
                <Route path='/flight/:fid' element={<FlightDetail logout={doLogOut} user={user}/>}/>
                <Route path='/book/:fid' element={<BookSeats logout={doLogOut} user={user}/>}/>
                <Route path='/*' element={<DefaultRoute logout={doLogOut} user={user}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
