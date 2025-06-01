import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { getAjakanMasuk } from "../api/api"; // ✅ Ganti dari localStorage ke API

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (!user?.id) return;

    const fetchPending = async () => {
      try {
        const response = await getAjakanMasuk(user.id);
        // Hanya hitung ajakan dengan status 'pending'
        const pendingAjakan = response.data.filter(
          (ajakan) => ajakan.status === "pending"
        );
        setPendingCount(pendingAjakan.length);
      } catch (error) {
        console.error("Error fetching pending invitations:", error);
        setPendingCount(0);
      }
    };

    fetchPending();
    // Set interval untuk memperbarui setiap 5 detik
    const interval = setInterval(fetchPending, 5000);

    return () => clearInterval(interval);
  }, [user?.id]);

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
