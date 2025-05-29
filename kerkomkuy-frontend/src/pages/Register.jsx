import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/api"; // ✅ Gunakan API backend

export default function Register() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!nim || !password || !namaLengkap) {
      setError("Semua field wajib diisi!");
      return;
    }

    try {
      await createUser({
        nim,
        password,
        nama_lengkap: namaLengkap,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response?.data?.message === "NIM sudah digunakan") {
        setError("NIM sudah terdaftar.");
      } else {
        setError("Terjadi kesalahan saat registrasi.");
      }
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
            Buat Akun
          </h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">Berhasil daftar! Redirect...</Alert>
          )}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Masukkan Nama"
                required
                className="py-2"
              />
            </Form.Group>
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
            <Button type="submit" className="w-100 py-2">
              Daftar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
