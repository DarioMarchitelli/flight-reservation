import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {FaPlane} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';

export default function NavbarWrapper({logout, user}) {
    const navigate = useNavigate();
    return (
        <Navbar bg="primary" variant="dark">
            <Container fluid>
                <Navbar.Brand>
                    <div className="navbar-brand" href="#">
                        <Link className="nav-link" to={"/"}>
                            <FaPlane/>
                            &nbsp;
                            Flight booking
                        </Link>
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll"/>
                <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{maxHeight: '100px'}}
                    navbarScroll
                >

                    {user && <>
                        <Link className="nav-link active" to={"/book"}>
                            Book a flight
                        </Link>
                        <Link className="nav-link active" to={"/reservations"}>
                            My reservations
                        </Link>
                    </>}
                </Nav>
                <Navbar.Collapse id="navbarScroll2" className="justify-content-end">
                    {user ? <>
                            <Navbar.Text className='fs-5'>
                                {"Signed in as: " + user.username}
                            </Navbar.Text>
                            <Button className='mx-2' variant='danger' onClick={logout}>Logout</Button>
                        </> :
                        <Button className='mx-2' variant='success' onClick={() => navigate('/login')}>Login</Button>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}