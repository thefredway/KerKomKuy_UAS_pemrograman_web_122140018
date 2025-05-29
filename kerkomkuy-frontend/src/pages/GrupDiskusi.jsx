import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { getChatByGrup, kirimChat } from "../api/api"; // ✅ Ganti ke API

export default function GrupDiskusi() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [chat, setChat] = useState([]);
  const [pesan, setPesan] = useState("");

  // Ambil chat dari backend
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await getChatByGrup(id);
        setChat(res.data || []);
      } catch (err) {
        console.error("Gagal mengambil chat:", err);
      }
    };
    fetchChat();
  }, [id]);

  // Kirim chat ke backend
  const handleKirim = async (e) => {
    e.preventDefault();
    if (!pesan.trim()) return;

    const newMsg = {
      grup_id: parseInt(id),
      pengirim_id: user.id,
      pesan: pesan,
    };

    try {
      await kirimChat(newMsg);
      // Ambil ulang semua chat setelah kirim
      const res = await getChatByGrup(id);
      setChat(res.data || []);
      setPesan("");
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    }
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
                  <strong className="text-primary">
                    {msg.pengirim_nim || `User ${msg.pengirim_id}`}
                  </strong>{" "}
                  —{" "}
                  <small className="text-muted">
                    {new Date(msg.timestamp).toLocaleString()}
                  </small>
                </div>
                <div>{msg.pesan}</div>
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
