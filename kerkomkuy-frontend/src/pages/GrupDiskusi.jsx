import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { Card, Form, Button, ListGroup, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { getChatByGrup, kirimChat } from "../api/api";

export default function GrupDiskusi() {
  const { id: grupId } = useParams();
  const { user } = useContext(AuthContext);
  const [daftarChat, setDaftarChat] = useState([]);
  const [isiPesan, setIsiPesan] = useState("");
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);

  // Auto-scroll ke bawah setiap kali chat diperbarui
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [daftarChat]);

  // Ambil chat berkala
  useEffect(() => {
    let intervalId;

    const fetchChat = async () => {
      try {
        const res = await getChatByGrup(grupId);
        setDaftarChat(res.data || []);
      } catch (err) {
        console.error("Gagal mengambil chat:", err);
        setError("Gagal mengambil data chat.");
      }
    };

    fetchChat();
    intervalId = setInterval(fetchChat, 3000);

    return () => clearInterval(intervalId);
  }, [grupId]);

  const handleKirim = async (e) => {
    e.preventDefault();
    setError("");

    if (!isiPesan.trim()) return;

    const newMessage = {
      sender_nim: user.nim,
      teks: isiPesan,
    };

    try {
      await kirimChat(grupId, newMessage);
      setIsiPesan(""); // Kosongkan input setelah kirim
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      setError("Pesan gagal dikirim. Coba lagi.");
    }
  };

  return (
    <div className="p-4">
      <h3>Diskusi Grup ID: {grupId}</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-3">
        <Card.Body>
          <ListGroup
            ref={chatContainerRef}
            className="chat-container"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {daftarChat.length === 0 ? (
              <ListGroup.Item className="text-muted text-center">
                Belum ada pesan.
              </ListGroup.Item>
            ) : (
              daftarChat.map((msg, i) => (
                <ListGroup.Item key={i}>
                  <div>
                    <strong className="text-primary">{msg.sender_nim}</strong> —{" "}
                    <small className="text-muted">
                      {new Date(msg.waktu).toLocaleString()}
                    </small>
                  </div>
                  <div>{msg.teks}</div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card.Body>

        <Card.Footer>
          <Form onSubmit={handleKirim} className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Tulis pesan..."
              value={isiPesan}
              onChange={(e) => setIsiPesan(e.target.value)}
              autoFocus
            />
            <Button type="submit">Kirim</Button>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
}
