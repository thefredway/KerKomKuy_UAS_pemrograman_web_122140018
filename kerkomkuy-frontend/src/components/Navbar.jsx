import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const checkPendingInvitations = () => {
        const pending =
          JSON.parse(localStorage.getItem("pending_invitations")) || {};
        const userInvitations = pending[user.nim] || [];
        setPendingCount(userInvitations.length);
      };
      checkPendingInvitations();
      const interval = setInterval(checkPendingInvitations, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) return null;

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      collapseOnSelect
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          KerKomKuy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-menu" />
        <Navbar.Collapse id="navbar-menu">
          <Nav className="me-auto d-flex align-items-center gap-2">
            <Nav.Link
              as={Link}
              to="/list-grup"
              active={location.pathname === "/list-grup"}
            >
              Grup
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/ajakan"
              active={location.pathname === "/ajakan"}
            >
              Ajakan{" "}
              {pendingCount > 0 && (
                <Badge bg="danger" pill>
                  {pendingCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Button
              variant="outline-light"
              onClick={logout}
              className="rounded-pill px-3"
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
