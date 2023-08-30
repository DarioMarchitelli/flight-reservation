import {useEffect, useState} from 'react';
import Nav from "../components/NavbarWrapper.jsx";
import API from "../API.jsx";
import FlightList from "../components/FlightList.jsx";
import {Card, Col, Row, Spinner} from "react-bootstrap";

const ViewAllFlights = ({user, logout}) => {
    let [flights, setFlights] = useState([]);
    const [showLoader, setShowLoader] = useState(true)

    useEffect(() => {
            API.getFlights().then((flights)=>{
                setFlights(flights);
                setShowLoader(false);
            });
    }, []);


    return (
        <>
            <Nav logout={logout} user={user}/>
            {showLoader ?
                <div className="d-flex align-items-center justify-content-center vh-100">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="sr-only"/>
                    </Spinner>
                </div>
                : <>

                <Row>
                    <Col>
                        {user && <Card className="border-0">
                            <Card.Body>
                                <Card.Title>Currently watching all the flights scheduled: </Card.Title>
                            </Card.Body>
                        </Card>}
                    </Col>
                </Row>
                <FlightList flights={flights} link={"/flight/"} />
            </>}
        </>
    );
};

export default ViewAllFlights;
