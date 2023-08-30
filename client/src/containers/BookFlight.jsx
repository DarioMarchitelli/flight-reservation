import {useEffect, useState} from 'react';
import {Card, Row, Col, Spinner} from 'react-bootstrap';
import Nav from "../components/NavbarWrapper.jsx";
import API from "../API.jsx";
import Container from "react-bootstrap/Container";
import FlightList from "../components/FlightList.jsx";
import {Link, useNavigate} from "react-router-dom";
import NotLoggedIn from "../components/NotLoggedIn.jsx";
import Button from "react-bootstrap/Button";

const BookFlight = ({user, logout}) => {
    let [flights, setFlights] = useState([]);
    const navigate = useNavigate()
    const [showLoader, setShowLoader] = useState(true)

    useEffect(() => {
        API.getNonBookedFlights().then((flights) => {
            setFlights(flights);
            setShowLoader(false)
        }).catch(() => navigate("/login"));
    }, []);

    return (
        <>
            <Nav logout={logout} user={user}/>
            {user ? <>
                    {showLoader ? <>
                        <div className="d-flex align-items-center justify-content-center vh-100">
                            <Spinner animation="border" variant="primary" role="status">
                                <span className="sr-only"/>
                            </Spinner>
                        </div>
                    </> : <>
                        {flights.length ? <>
                                <Row>
                                    <Col>
                                        {user && <Card className="border-0">
                                            <Card.Body>
                                                <Card.Title>Select a flight to book: </Card.Title>
                                            </Card.Body>
                                        </Card>}
                                    </Col>
                                </Row>
                                <FlightList flights={flights} link={"/book/"}/>
                            </> :
                            <>
                                <Container className="d-flex align-items-center justify-content-center vh-100">
                                    <Container className="text-center">
                                        <h1>You have a reservation for every of our flights, nothing to do here!</h1>
                                    </Container>
                                </Container>
                            </>
                        }
                    </>}
                </> :
                <>
                    <NotLoggedIn text={"Login to book a flight"}/>
                </>
            }
        </>
    );
};

export default BookFlight;
