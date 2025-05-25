import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Nav className="me-auto d-flex align-items-center gap-2">
          <Button as={Link} to="/" variant="outline-light">
            Dashboard
          </Button>
          <Button as={Link} to="/list-grup" variant="outline-light">
            Grup
          </Button>
          <Button as={Link} to="/ajakan" variant="outline-light">
            Ajakan
          </Button>
        </Nav>
        <Nav className="ms-auto">
          <Button variant="outline-light" onClick={logout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
