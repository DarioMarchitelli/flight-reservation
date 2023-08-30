import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from "../API.jsx";
import {useState} from "react";
import Nav from "../components/NavbarWrapper.jsx";
import {FaPlane} from "react-icons/fa";

export default function LoginForm({loginSuccessful, logout, user}) {

    const [username, setUsername] = useState('harry@test.com');
    const [password, setPassword] = useState('pwd');
    const [errorMessage, setErrorMessage] = useState('') ;

    const navigate = useNavigate();

    const doLogIn = (credentials) => {
        API.logIn(credentials)
            .then( user => {
                setErrorMessage('');
                loginSuccessful(user);
            })
            .catch(err => {
                setErrorMessage('Wrong username or password');
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };
        let valid = true;
        if(username === '' || password === '')
            valid = false;

        if(valid)
        {
            doLogIn(credentials);
        } else {
            setErrorMessage('Error(s) in the form, please fix it/them.')
        }
    };

    return (

        <>
            <Nav logout={logout} user={user}/>
            <Container className="text-center text-primary mt-5">
                <Row>
                    <Col>
                        <h1>
                            <FaPlane style={{ marginRight: '10px' }} />
                            Flight booking
                        </h1>
                    </Col>
                </Row>
            </Container>
            <Container className="mt-5">
                <Row>
                    <Col xs={3}></Col>
                    <Col xs={6}>
                        <h2>Login</h2>
                        <Form onSubmit={handleSubmit}>
                            {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
                            <Form.Group controlId='username'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                            </Form.Group>
                            <Form.Group controlId='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                            </Form.Group>
                            <Button className='my-2' type='submit'>Login</Button>
                            <Button className='my-2 mx-2' variant='danger' onClick={()=>navigate('/flights')}>Cancel</Button>
                        </Form>
                    </Col>
                    <Col xs={3}></Col>
                </Row>
            </Container>
        </>
    )
}