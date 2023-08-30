import {Container, Row, Col, Card, Button, Alert, Spinner} from 'react-bootstrap';
import Nav from "../components/NavbarWrapper.jsx";
import API from "../API.jsx";
import {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import NotLoggedIn from "../components/NotLoggedIn.jsx";
import ModalBook from "../components/ModalBook.jsx";
import {FaArrowLeft} from "react-icons/fa";

const BookSeats = ({logout, user}) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    let [flight, setFlight] = useState({});
    const {fid} = useParams();
    const [alert, setAlert] = useState({show: false, color: "", text: ""});
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [dirtySeats, setDirtySeats] = useState(true);
    const [showModalBook, setShowModalBook] = useState(true);
    const [selectedOption, setSelectedOption] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showLoader, setShowLoader] = useState(true);
    const [disableSubmit, setDisableSubmit] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (dirtySeats) {
            API.getFlightSeats(fid).then((flight) => {
                setFlight(() => flight);
                setDirtySeats(false)
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
        }
    }, [dirtySeats]);
    /* AUTOMATIC ASSIGNMENT */
    useEffect(() => {
        if (!showModalBook && selectedOption === 2 && quantity > 0) {
            let tempSelectedSeats = [];
            for (let i = 0; i < quantity; i++) {
                let found = false;
                for (let j = 1; j <= flight.rows; j++) {
                    for (let k = 1; k <= flight.columns; k++) {
                        let seat = j + "" + String.fromCharCode(64 + k);
                        if (!flight.seats.includes(seat) && !tempSelectedSeats.includes(seat)) {
                            tempSelectedSeats.push(seat)
                            found = true
                            break;
                        }
                    }
                    if (found) break;
                }
            }
            setSelectedSeats(tempSelectedSeats);
        }
    }, [showModalBook])

    const handleSeatSelection = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }

    };

    function onSubmit() {
        setShowLoader(true)
        API.createReservation(fid, selectedSeats).then(() => {
            setShowLoader(false)
            setDisableSubmit("disabled")
            setAlert({
                show: true,
                color: "success",
                text: "Reservation completed! Redirecting you to your reservations in 2 seconds..."
            })
            setDirtySeats(true);
            setTimeout(() => {
                navigate("/reservations")
            }, 2000);
        }).catch((err) => {
            setShowLoader(false)
            if (err.message) {
                let error = JSON.parse(err.message);
                if (error.occupiedSeats) {
                    setAlert({show: true, color: "danger", text: error.error + " Updating the state in 5 seconds..."});
                    setSelectedSeats((prec) => {
                        return prec.filter((seat) => {
                            let con = true;
                            error.occupiedSeats.forEach((os) => {
                                    if (seat === os) con = false;
                                }
                            )
                            return con;
                        });
                    });
                    setOccupiedSeats(error.occupiedSeats);
                    if (error.occupiedSeats.length > 0) {
                        setTimeout(() => {
                            setOccupiedSeats([]);
                            setDirtySeats(true);
                            setAlert({show: false, color: "", text: ""});
                        }, 5000)
                    }
                } else {
                    setAlert({show: true, color: "danger", text: error.error + " Redirecting to the booking page..."});
                    setDisableSubmit(true)
                    setTimeout(() => {
                        navigate("/book")
                    }, 2000);
                }
            }
        });
    }

    const renderSeats = (user, rows, columns) => {
        const seats = [];

        for (let row = 1; row <= rows; row++) {
            for (let seat = 1; seat <= columns; seat++) {
                const seatNumber = `${row}${String.fromCharCode(64 + seat)}`;
                const isOccupied = flight.seats.includes(seatNumber);
                const isSelected = (user && selectedSeats.includes(seatNumber));
                const isAlreadyOccupied = (user && occupiedSeats.includes(seatNumber));
                let onClickFn = () => {
                };
                if (!isOccupied) {
                    onClickFn = () => handleSeatSelection(seatNumber);
                }

                let seatClassName = 'text-center';
                if (isOccupied) {
                    seatClassName += ' bg-secondary text-light';
                } else if (isSelected) {
                    seatClassName += ' bg-success text-light';
                } else if (isAlreadyOccupied) {
                    seatClassName += ' bg-danger text-light';
                }

                seats.push(
                    user ?
                        <Col key={seatNumber} xs={4} md={Math.floor(12 / columns)} className="mb-4">
                            <Card
                                className={seatClassName}
                                onClick={onClickFn}
                            >
                                <Card.Body>
                                    <Card.Title>{seatNumber}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        :
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
    let totalSelectedSeats = selectedSeats ? selectedSeats.length : 0;

    return (
        <>
            <Nav logout={logout} user={user}/>
            <Container>
                {user ?
                    <>
                        {showLoader ? <>
                                <div className="d-flex align-items-center justify-content-center vh-100">
                                    <Spinner animation="border" variant="primary" role="status">
                                        <span className="sr-only"/>
                                    </Spinner>
                                </div>
                            </> :
                            <>
                                {error ?
                                    <Container className="d-flex align-items-center justify-content-center vh-100">
                                        <Container className="text-center">
                                            <h1 className="text-center"> {error} </h1>
                                            <Link to={"/book"}>
                                                <Button className={"m-3"} size="lg">Go back</Button>
                                            </Link>
                                        </Container>
                                    </Container>
                                    :
                                    <>
                                        <br/>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title className={"fs-2"}>
                                                    <Button variant="primary" onClick={() => {
                                                        navigate("/book")
                                                    }}>
                                                        <FaArrowLeft/>
                                                    </Button>&nbsp;&nbsp;
                                                    Flight Information</Card.Title>
                                                <Card.Body className={"fs-5"}>
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
                                                        <Col>
                                                            <Card className="text-center" bg="success" text="white">
                                                                <Card.Body>
                                                                    <Card.Title>Selected seats</Card.Title>
                                                                    <Card.Text>{totalSelectedSeats}</Card.Text>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                    <br/>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title className={"fs-3"}>Seats</Card.Title>
                                                            <Row>
                                                                {renderSeats(user, flight.rows, flight.columns)}
                                                            </Row>
                                                            <br/>
                                                            <br/><br/><br/><br/><br/>
                                                            <ModalBook showModalBook={showModalBook}
                                                                       setShowModalBook={setShowModalBook}
                                                                       selectedOption={selectedOption}
                                                                       setSelectedOption={setSelectedOption}
                                                                       quantity={quantity} setQuantity={setQuantity}
                                                                       freeSeats={totalSeats - totalOccupiedSeats}/>
                                                        </Card.Body>
                                                    </Card>
                                                </Card.Body>
                                            </Card.Body>
                                        </Card>
                                        {selectedSeats.length > 0 && (
                                            <Row className="fixed-bottom">
                                                <Col>
                                                    <footer
                                                        className="bg-primary text-center p-3 rounded-top border border-primary border-5 ">

                                                        {alert.show && <>
                                                            <Row>
                                                                <Col>
                                                                    <Alert variant={alert && alert.color}>
                                                                        {alert && alert.text}
                                                                    </Alert>
                                                                </Col>
                                                            </Row><br/>
                                                        </>}
                                                        <Row>
                                                            <Col>
                                                                <h3 className="text-light">Selected
                                                                    seats: {selectedSeats.sort().map((el) => " " + el + " ")}</h3>
                                                            </Col>
                                                            <Col xs="auto">
                                                                <Button variant="secondary" className={disableSubmit}
                                                                        onClick={() => setSelectedSeats([])}
                                                                        size="lg">
                                                                    Cancel
                                                                </Button>
                                                                &nbsp;&nbsp;&nbsp;
                                                                <Button variant="success" size="lg"
                                                                        className={disableSubmit}
                                                                        onClick={onSubmit}>
                                                                    Book {selectedSeats.length} seats
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </footer>
                                                </Col>
                                            </Row>
                                        )}
                                    </>
                                }
                            </>}
                    </>
                    :
                    <>
                        <NotLoggedIn text={"Login to book a flight"}/>
                    </>
                }
            </Container>
        </>
    );
};

export default BookSeats;
