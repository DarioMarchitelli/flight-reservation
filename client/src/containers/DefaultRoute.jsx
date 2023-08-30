import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Nav from "../components/NavbarWrapper.jsx";

export default function DefaultRoute({logout, user}){
    return (
        <>
            <Nav logout={logout} user={user}/>
            <Container className="text-center mt-5">
                <Row>
                    <Col>
                        <h1>404</h1>
                        <h3>Oops! Page not found</h3>
                        <p>The page you are looking for does not exist.</p>
                        <Button variant="primary" href="/">Go back to homepage</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}