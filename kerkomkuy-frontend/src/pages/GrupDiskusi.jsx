import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { getChatByGrup, kirimChat } from "../api/api";

export default function GrupDiskusi() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [chat, setChat] = useState([]);
  const [pesan, setPesan] = useState("");
  const chatContainerRef = useRef(null);

  // Auto-scroll ke bawah setiap kali chat diperbarui
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    let intervalId;

    const fetchChat = async () => {
      try {
        const res = await getChatByGrup(id);
        setChat(res.data || []);
      } catch (err) {
        console.error("Gagal mengambil chat:", err);
      }
    };

    fetchChat();
    intervalId = setInterval(fetchChat, 3000); // refresh setiap 3 detik

    return () => clearInterval(intervalId);
  }, [id]);

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
      setPesan(""); // Kosongkan input
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    }
  };

  return (
    <div className="p-4">
      <h3>Diskusi Grup ID: {id}</h3>
      <Card className="mb-3">
        <Card.Body>
          <ListGroup
            ref={chatContainerRef}
            className="chat-container"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
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
