import { useContext, useEffect, useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Ajakan() {
  const { user } = useContext(AuthContext);
  const [invitations, setInvitations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("pending_invitations")) || {};
    setInvitations(stored[user.nim] || []);
  }, [user.nim]);

  const handleAccept = (grup_id) => {
    // Tambahkan ke grup yang ada
    const list = JSON.parse(localStorage.getItem("grup_list")) || [];
    const target = list.find((g) => g.id === grup_id);
    if (target) {
      // Hindari duplikat
      if (!target.anggota.some((a) => a.nim === user.nim)) {
        target.anggota.push({ nim: user.nim });
        localStorage.setItem("grup_list", JSON.stringify(list));
      }
    }

    handleRemove(grup_id);
    navigate(`/grup/${grup_id}`);
  };

  const handleRemove = (grup_id) => {
    const stored =
      JSON.parse(localStorage.getItem("pending_invitations")) || {};
    const updated = (stored[user.nim] || []).filter(
      (g) => g.grup_id !== grup_id
    );
    stored[user.nim] = updated;
    localStorage.setItem("pending_invitations", JSON.stringify(stored));
    setInvitations(updated);
  };

  return (
    <div className="p-4">
      <h3>Ajakan Masuk Grup</h3>
      {invitations.length === 0 ? (
        <Alert variant="info">Belum ada ajakan masuk.</Alert>
      ) : (
        invitations.map((ajakan) => (
          <Card key={ajakan.grup_id} className="mb-3">
            <Card.Body>
              <h5>Grup ID: {ajakan.grup_id}</h5>
              <p>Diajak oleh: {ajakan.dari}</p>
              <Button
                variant="success"
                className="me-2"
                onClick={() => handleAccept(ajakan.grup_id)}
              >
                Terima
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => handleRemove(ajakan.grup_id)}
              >
                Tolak
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
