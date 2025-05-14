import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Dashboard</Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="outline-light" onClick={logout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
