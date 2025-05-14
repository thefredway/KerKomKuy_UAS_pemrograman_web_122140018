import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, ListGroup, Badge, Alert, Button } from "react-bootstrap";

export default function Grup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grup, setGrup] = useState(null);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("grup_list")) || [];
    const found = list.find((g) => g.id.toString() === id);
    setGrup(found);
  }, [id]);

  if (!grup) return <Alert variant="warning">Grup tidak ditemukan.</Alert>;

  return (
    <div className="p-4">
      <h3>Grup ID: {id}</h3>
      <Card>
        <Card.Body>
          <h5>Anggota:</h5>
          <ListGroup className="mb-3">
            {grup.anggota.map((a, i) => (
              <ListGroup.Item key={i}>{a.nim}</ListGroup.Item>
            ))}
          </ListGroup>

          <h5>Jadwal Pilihan:</h5>
          <ListGroup>
            {grup.jadwal.map((j, i) => (
              <ListGroup.Item key={i}>
                <Badge bg="info" className="me-2">
                  🕒
                </Badge>{" "}
                {j}
              </ListGroup.Item>
            ))}
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
