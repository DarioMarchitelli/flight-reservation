import {Alert, Card, Col, ListGroup, Modal, Row, Spinner} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import API from "../API.jsx";
import Container from "react-bootstrap/Container";

export default function FlightList({
                                       flights, link, setDirty = () => {
    }, isReservations = false
                                   }) {

    const [hoveredFlight, setHoveredFlight] = useState(null);
    const navigate = useNavigate()
    const [currentReservation, setCurrentReservation] = useState({});
    const [error, setError] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showLoaderModal, setShowLoaderModal] = useState(false);

    useEffect(() => {
        if (!showConfirmation) {
            setError("")
        }
    }, [showConfirmation]);

    const handleMouseOver = (flightId) => {
        setHoveredFlight(flightId);
    };

    const handleMouseLeave = () => {
        setHoveredFlight(null);
    };

    const handleDeleteFlight = () => {
        setShowLoaderModal(true)
        API.deleteReservation(currentReservation).then(() => {
            setShowConfirmation(false);
            setShowLoaderModal(false)
            setDirty(true)
        }).catch((e) => {
            let error = JSON.parse(e.message);
            setError(error.error || (error.errors[0] && error.errors[0].msg));
        })
    };
    return (
        <>
            <ListGroup>
                {flights ? flights.map((flight) => (
                    <ListGroup.Item key={flight.fid} className="border-0">
                        <Card
                            onClick={() => navigate(link + (isReservations ? flight.rid : flight.fid))}
                            onMouseOver={() => handleMouseOver(flight.fid)}
                            onMouseLeave={handleMouseLeave}
                            className={hoveredFlight === flight.fid ? 'bg-primary' : ''}
                            style={hoveredFlight !== flight.fid ? {
                                backgroundImage: `url(${flight.image})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                color: 'white',
                                textShadow: '4px 4px 8px black, -4px -4px 8px black'
                            } : {}}
                        >
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <p>From</p>
                                        <h5>{flight.departure}</h5>
                                        <p>{flight.departure_date.format('DD/MM/YYYY HH:mm')}</p>
                                    </Col>
                                    <Col>
                                        <p>To</p>
                                        <h5>{flight.arrival}</h5>
                                        <p>{flight.arrival_date.format('DD/MM/YYYY HH:mm')}</p>
                                    </Col>
                                    <Col>
                                        <p className="text-end">Available
                                            Seats: {flight.total_seats - flight.booked_seats}</p>
                                        <p className="text-end">Booked Seats: {flight.booked_seats}</p>
                                        <p className="text-end">Total Seats: {flight.total_seats}</p>
                                    </Col>
                                </Row>
                                {flight.rid && <div className="text-end">
                                    <Button variant="danger" onClick={(e) => {
                                        e.stopPropagation()
                                        setCurrentReservation(flight.rid)
                                        setShowConfirmation(true)
                                    }}>Delete Reservation</Button>
                                </div>}
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                )) : <>
                    <Container className="d-flex align-items-center justify-content-center vh-100">
                        <Container className="text-center">
                            <h1 className="text-center"> No flights to show </h1>
                        </Container>
                    </Container>
                </>}
            </ListGroup>


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
}