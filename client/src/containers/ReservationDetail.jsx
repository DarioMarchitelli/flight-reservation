import {Container, Row, Col, Card, Modal, Alert, Spinner} from 'react-bootstrap';
import Nav from "../components/NavbarWrapper.jsx";
import API from "../API.jsx";
import {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import NotLoggedIn from "../components/NotLoggedIn.jsx";
import Button from "react-bootstrap/Button";
import {FaArrowLeft} from "react-icons/fa";

const FlightDetail = ({logout, user}) => {
    let [flight, setFlight] = useState({});
    const [error, setError] = useState("")
    const {rid} = useParams();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [showLoaderModal, setShowLoaderModal] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        API.getReservationSeats(rid).then((reservation) => {
            setFlight(() => reservation);
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


    const handleDeleteFlight = () => {
        setShowLoaderModal(true)
        API.deleteReservation(rid).then(() => {
            setShowConfirmation(false);
            setShowLoaderModal(false)
            navigate("/reservations")
        }).catch((e) => {
            let error = JSON.parse(e.message);
            setError(error.error || (error.errors[0] && error.errors[0].msg));
        })
    };

    const renderSeats = (user, rows, columns) => {
        const seats = [];

        for (let row = 1; row <= rows; row++) {
            for (let seat = 1; seat <= columns; seat++) {
                const seatNumber = `${row}${String.fromCharCode(64 + seat)}`;
                const isOccupied = flight.seats.includes(seatNumber);
                const isReserved = flight.reservation_seats.includes(seatNumber);

                let seatClassName = 'text-center';
                if (isReserved) {
                    seatClassName += ' bg-warning text-light';
                } else if (isOccupied) {
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
    let totalReservedSeats = flight.reservation_seats ? flight.reservation_seats.length : 0;
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
                    </> : <>{
                        !error ? <>
                            <Container>
                                <br/>
                                <Card>
                                    <Card.Body>
                                        <Card.Title className={"fs-2"}>
                                            <Button variant="primary" onClick={() => {
                                                navigate("/reservations")
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
                                            <Col>
                                                <div className="text-end">
                                                    <Button variant="danger" onClick={(e) => {
                                                        e.stopPropagation()
                                                        setShowConfirmation(true)
                                                    }}>Delete Reservation</Button>
                                                </div>
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
                                            <Col>
                                                <Card className="text-center" bg="warning" text="white">
                                                    <Card.Body>
                                                        <Card.Title>Your seats</Card.Title>
                                                        <Card.Text>{totalReservedSeats}</Card.Text>
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

                            </Container>
                        </> : <>
                            <Container className="d-flex align-items-center justify-content-center vh-100">
                                <Container className="text-center">
                                    <h1 className="text-center"> {error} </h1>
                                    <Link to={"/reservations"}>
                                        <Button className={"m-3"} size="lg">Go to your reservations</Button>
                                    </Link>
                                </Container>
                            </Container>
                        </>
                    }</>}
                </> :
                <>
                    <NotLoggedIn text={"Login to see your reservations"}/>
                </>}
            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Reservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showLoaderModal ? <>
                        <div className="d-flex align-items-center justify-content-center">
                            <Spinner animation="border" variant="primary" role="status">
                                <span className="sr-only"/>
                            </Spinner>
                        </div>
                    </> : <>
                        {error && <Row>
                            <Col>
                                <Alert variant={"danger"}>
                                    {error}
                                </Alert>
                            </Col>
                        </Row>}
                        <Row>
                            <Col>
                                <p>Are you sure you want to delete this reservation?</p>
                            </Col>
                        </Row>
                    </>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmation(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteFlight}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FlightDetail;
