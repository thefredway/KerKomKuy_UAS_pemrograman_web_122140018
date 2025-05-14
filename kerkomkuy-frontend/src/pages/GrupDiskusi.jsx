import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function GrupDiskusi() {
  const { id } = useParams();
  const { user } = useContext(AuthContext); // ambil user login
  const [chat, setChat] = useState([]);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`chat_grup_${id}`)) || [];
    setChat(stored);
  }, [id]);

  const handleKirim = (e) => {
    e.preventDefault();
    if (!pesan.trim()) return;

    const newMessage = {
      sender: user.nim,
      teks: pesan,
      waktu: new Date().toLocaleString(),
    };

    const newChat = [...chat, newMessage];
    setChat(newChat);
    setPesan("");
    localStorage.setItem(`chat_grup_${id}`, JSON.stringify(newChat));
  };

  return (
    <div className="p-4">
      <h3>Diskusi Grup ID: {id}</h3>
      <Card className="mb-3">
        <Card.Body>
          <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
            {chat.map((msg, i) => (
              <ListGroup.Item key={i}>
                <div>
                  <strong className="text-primary">{msg.sender}</strong> —{" "}
                  <small className="text-muted">{msg.waktu}</small>
                </div>
                <div>{msg.teks}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
        <Card.Footer>
          <Form onSubmit={handleKirim} className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Tulis pesan..."
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
            />
            <Button type="submit">Kirim</Button>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
}
