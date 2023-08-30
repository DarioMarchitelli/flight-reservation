import {Container, Row, Col, Card, Spinner} from 'react-bootstrap';
import Nav from "../components/NavbarWrapper.jsx";
import API from "../API.jsx";
import {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {FaArrowLeft} from "react-icons/fa";

const FlightDetail = ({logout, user}) => {
    let [flight, setFlight] = useState({});
    const {fid} = useParams();
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        API.getFlightSeats(fid).then((flight) => {
            setFlight(() => flight);
            setShowLoader(false)
        }).catch((e) => {
            if (e.error) {
                setError(e.error);
            } else {
                if (e.errors && e.errors[0]) {
                    setError(e.errors[0].msg);
                }
            }
            setShowLoader(false)
        });
    }, []);

    const renderSeats = (user, rows, columns) => {
        const seats = [];

        for (let row = 1; row <= rows; row++) {
            for (let seat = 1; seat <= columns; seat++) {
                const seatNumber = `${row}${String.fromCharCode(64 + seat)}`;
                const isOccupied = flight.seats.includes(seatNumber);

                let seatClassName = 'text-center';
                if (isOccupied) {
                    seatClassName += ' bg-secondary text-light';
                }

                seats.push(
                    <Col key={seatNumber} xs={4} md={Math.floor(12 / columns)} className="mb-4">
                        <Card
                            className={seatClassName}
                        >
                            <Card.Body>
                                <Card.Title>{seatNumber}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                );

                if (seat === columns && columns % 2 === 1) {
                    seats.push(
                        <Col key={seatNumber + "BIS"} xs={4} md={Math.floor(12 / 5)} className="mb-4 invisible">
                            <Card
                                className={seatClassName}
                            >
                                <Card.Body>
                                    <Card.Title>{seatNumber}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                }
            }
        }

        return seats;
    };


    let totalSeats = (flight.rows && flight.columns) ? (flight.rows * flight.columns) : 0;
    let totalOccupiedSeats = flight.seats ? flight.seats.length : 0;
    return (
        <>
            <Nav logout={logout} user={user}/>
            {showLoader ?
                <div className="d-flex align-items-center justify-content-center vh-100">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="sr-only"/>
                    </Spinner>
                </div> : <>
                    {!error ? <Container>
                            <br/>
                            <Card>
                                <Card.Body>
                                    <Card.Title className={"fs-2"}>
                                        <Button variant="primary" onClick={() => {
                                            navigate("/")
                                        }}>
                                            <FaArrowLeft/>
                                        </Button>&nbsp;&nbsp;
                                        Flight Information</Card.Title>
                                    <Row>
                                        <Col>
                                            <p className={"fs-4"}> Departure: </p>
                                            From <strong>{flight && flight.departure}</strong><br/>
                                            at {flight.departure_date && flight.departure_date.format('DD/MM/YYYY HH:mm')}<br/>
                                        </Col>
                                        <Col>
                                            <p className={"fs-4"}> Arrival: </p>
                                            To <strong>{flight && flight.arrival}</strong><br/>
                                            at {flight.arrival_date && flight.arrival_date.format('DD/MM/YYYY HH:mm')}<br/>
                                        </Col>
                                    </Row><br/>
                                    <Row>
                                        <Col>
                                            <Card className="text-center" bg="primary" text="white">
                                                <Card.Body>
                                                    <Card.Title>Total seats</Card.Title>
                                                    <Card.Text>{totalSeats}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card className="text-center" text="primary">
                                                <Card.Body>
                                                    <Card.Title>Free seats</Card.Title>
                                                    <Card.Text>{totalSeats - totalOccupiedSeats}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card className="text-center" bg="secondary" text="white">
                                                <Card.Body>
                                                    <Card.Title>Occupied seats</Card.Title>
                                                    <Card.Text>{totalOccupiedSeats}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Card>
                                        <Card.Title className={"p-3 fs-3"}>Seats</Card.Title>
                                        <Card.Body>
                                            <Row>
                                                {renderSeats(user, flight.rows, flight.columns)}
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Card.Body>
                            </Card>

                        </Container> :
                        <Container className="d-flex align-items-center justify-content-center vh-100">
                            <Container className="text-center">
                                <h1 className="text-center"> {error} </h1>
                                <Link to={"/flights"}>
                                    <Button className={"m-3"} size="lg">Go back</Button>
                                </Link>
                            </Container>
                        </Container>}
                </>}
        </>
    );
};

export default FlightDetail;
