import { Card, Form, Button, ListGroup, Badge, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Grup() {
  const { user } = useContext(AuthContext);
  const [pesan, setPesan] = useState("");
  const [chat, setChat] = useState([
    {
      id: 1,
      pengirim: "122140018",
      teks: "Halo, jadwal kita hari Rabu jam 10:00 ya!",
    },
    { id: 2, pengirim: "122140019", teks: "Siap, sudah saya catat" },
  ]);

  const handleKirimPesan = (e) => {
    e.preventDefault();
    if (!pesan.trim()) return;

    setChat([
      ...chat,
      {
        id: Date.now(),
        pengirim: user.nim,
        teks: pesan,
      },
    ]);
    setPesan("");
  };

  return (
    <div className="p-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Grup Diskusi KerKomKuy</h4>
          <Badge bg="success">Online</Badge>
        </Card.Header>
        <Card.Body style={{ height: "500px", overflowY: "auto" }}>
          <ListGroup variant="flush">
            {chat.map((msg) => (
              <ListGroup.Item
                key={msg.id}
                className={msg.pengirim === user.nim ? "text-end" : ""}
              >
                <small className="text-muted d-block">
                  {msg.pengirim === user.nim ? "Anda" : msg.pengirim}
                </small>
                <Alert
                  variant={msg.pengirim === user.nim ? "primary" : "light"}
                >
                  {msg.teks}
                </Alert>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
        <Card.Footer>
          <Form onSubmit={handleKirimPesan} className="d-flex gap-2">
            <Form.Control
              as="textarea"
              rows={1}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              placeholder="Ketik pesan..."
            />
            <Button variant="primary" type="submit">
              Kirim
            </Button>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
}
