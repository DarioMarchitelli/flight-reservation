import {Alert} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function NotLoggedIn({text}){
    return (
            <Container className="d-flex align-items-center justify-content-center vh-100">
                <Container className="text-center">
                    <h1 className="text-center"> {text} </h1>
                    <Link to={"/login"} >
                        <Button className={"m-3"} size="lg">Login</Button>
                    </Link>
                </Container>
            </Container>
    );
}