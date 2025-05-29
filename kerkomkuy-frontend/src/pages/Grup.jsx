import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  ListGroup,
  Badge,
  Alert,
  Button,
  Spinner,
} from "react-bootstrap";
import { getGrupById } from "../api/api";

export default function Grup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grup, setGrup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrup = async () => {
      try {
        const res = await getGrupById(id);
        setGrup(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Gagal mengambil data grup.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrup();
  }, [id]);

  if (loading)
    return (
      <div className="p-4">
        <Spinner animation="border" /> Memuat...
      </div>
    );
  if (error)
    return (
      <Alert variant="danger" className="p-4">
        {error}
      </Alert>
    );
  if (!grup)
    return (
      <Alert variant="warning" className="p-4">
        Grup tidak ditemukan.
      </Alert>
    );

  return (
    <div className="p-4">
      <h3>Detail Grup</h3>
      <Card>
        <Card.Body>
          <h5 className="mb-3">
            ID Grup: <Badge bg="secondary">{id}</Badge>
          </h5>

          <h5>Anggota:</h5>
          <ListGroup className="mb-3">
            {grup.anggota && grup.anggota.length > 0 ? (
              grup.anggota.map((a, i) => (
                <ListGroup.Item key={i}>
                  👤 NIM: <strong>{a.nim}</strong>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>Tidak ada anggota.</ListGroup.Item>
            )}
          </ListGroup>

          <h5>Jadwal Terpilih:</h5>
          <ListGroup>
            {grup.jadwal && grup.jadwal.length > 0 ? (
              grup.jadwal.map((j, i) => (
                <ListGroup.Item key={i}>
                  <Badge bg="info" className="me-2">
                    🕒
                  </Badge>
                  {j}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>Tidak ada jadwal dipilih.</ListGroup.Item>
            )}
          </ListGroup>

          <div className="text-end mt-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/grup/${id}/diskusi`)}
            >
              Masuk Diskusi
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
