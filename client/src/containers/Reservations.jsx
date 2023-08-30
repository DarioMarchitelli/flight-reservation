import {useEffect, useState} from 'react';
import Nav from "../components/NavbarWrapper.jsx";
import API from "../API.jsx";
import FlightList from "../components/FlightList.jsx";
import NotLoggedIn from "../components/NotLoggedIn.jsx";
import {Link, useNavigate} from "react-router-dom";
import {Card, Col, Row, Spinner} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const Reservations = ({user, logout}) => {
    let [flights, setFlights] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [showLoader, setShowLoader] = useState(true)

    useEffect(() => {
        if (dirty) {
            API.getReservations().then((flights) => {
                setFlights(flights);
                setShowLoader(false)
            }).catch();
            setDirty(false)
        }
    }, [dirty]);

    return (
        <>
            <Nav logout={logout} user={user}/>
            {user ? <>
                    {showLoader ?
                        <div className="d-flex align-items-center justify-content-center vh-100">
                            <Spinner animation="border" variant="primary" role="status">
                                <span className="sr-only"/>
                            </Spinner>
                        </div>
                        : <>
                            {flights.length ? <>
                                    <Row>
                                        <Col>
                                            <Card className="border-0">
                                                <Card.Body>
                                                    <Card.Title>Your reservations: </Card.Title>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <FlightList flights={flights} link={"/reservations/"} isReservations={true}
                                                setDirty={setDirty}/>
                                </> :
                                <>
                                    <Container className="d-flex align-items-center justify-content-center vh-100">
                                        <Container className="text-center">
                                            <h1>You don't have any reservation yet, fix this!</h1>
                                            <Link to="/book">
                                                <Button size="lg">Book your first flight!</Button>
                                            </Link>
                                        </Container>
                                    </Container>
                                </>}
                        </>}
                </> :
                <>
                    <NotLoggedIn text={"Login to see your reservations"}/>
                </>
            }
        </>
    );
};

export default Reservations;
