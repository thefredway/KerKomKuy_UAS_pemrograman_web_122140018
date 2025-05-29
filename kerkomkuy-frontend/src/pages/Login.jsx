import { Card, Form, Button, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(nim, password);
    if (!success) {
      setError("NIM atau Password salah!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card
        style={{ width: "400px", backgroundColor: "white" }}
        className="p-3 border-0 auth-card"
      >
        <Card.Body>
          <h3 className="text-center mb-4 fw-semibold text-primary">
            Masuk KerKomKuy
          </h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>NIM</Form.Label>
              <Form.Control
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Masukkan NIM"
                required
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password"
                required
                className="py-2"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 py-2">
              Login
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              Belum punya akun? <Link to="/register">Daftar di sini</Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
