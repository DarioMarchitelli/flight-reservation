import {Button, Modal, Form, Card, Row, Col, Alert} from "react-bootstrap";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function ModalBook({
                                      showModalBook,
                                      setShowModalBook,
                                      selectedOption,
                                      setSelectedOption,
                                      quantity,
                                      setQuantity,
                                      freeSeats
                                  }) {

    const [hoveredOption, setHoveredOption] = useState(0);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleMouseOver = (optionId) => {
        setHoveredOption(optionId);
    };

    const handleMouseLeave = () => {
        setHoveredOption(0);
    };

    /*

    function handleChangeDate(el, name) {
        setSelectedFilm(() => {
            return {...selectedFilm, [name]: dayjs(el.target.value)}
        })
    }*/

    return (
        <>
            <Modal show={showModalBook} onHide={() => {
                navigate("/book");
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a booking mode</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Card
                                onMouseOver={() => handleMouseOver(1)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => setSelectedOption(1)}
                                className={selectedOption === 1 ? 'bg-primary text-light' : (hoveredOption === 1 ? 'bg-secondary text-light' : '')}
                            >
                                <Card.Body>
                                    Manual choice
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                onMouseOver={() => handleMouseOver(2)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => setSelectedOption(2)}
                                className={selectedOption === 2 ? 'bg-primary text-light' : (hoveredOption === 2 ? 'bg-secondary text-light' : '')}
                            >
                                <Card.Body>
                                    Automatic assignment
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {selectedOption === 2 && <>
                        <hr/>
                        {error && <Row>
                            <Col>
                                <Alert variant={"danger"}>
                                    {error}
                                </Alert>
                            </Col>
                        </Row>}
                        <Row>
                            <Form.Group controlId="integerSelector">
                                <Form.Label>Select the number of seats that you need</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="1"
                                    min="1"
                                    placeholder="Number of seats"
                                    onChange={(el) => {
                                        setQuantity(el.target.value)
                                    }}
                                    value={quantity}
                                />
                            </Form.Group>
                        </Row>
                    </>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        navigate("/book");
                    }}>
                        Go back
                    </Button>
                    {selectedOption !== 0 &&
                        <Button variant="primary" className={(selectedOption === 0) ? "disabled" : ""} onClick={() => {
                            if(selectedOption === 2){
                                if (quantity <= 0) {
                                    setError("The number should be greater than 0.")
                                } else if(quantity > freeSeats) {
                                    setError("Number too large, the flight has only " + freeSeats + " free seats at the moment.")
                                } else {
                                    setError("")
                                    setShowModalBook(false)
                                }
                            } else {
                                setShowModalBook(false)
                            }
                        }}>
                            {selectedOption === 1 && "Choose seats manually"}
                            {selectedOption === 2 && "View automatically assigned seats"}
                        </Button>}
                </Modal.Footer>
            </Modal>
        </>
    )
}