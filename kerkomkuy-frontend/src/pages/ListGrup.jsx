import { useEffect, useState, useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ListGrup() {
  const [grupList, setGrupList] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ambil data user login

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("grup_list")) || [];

    // Filter
    const milikSaya = stored.filter((grup) =>
      grup.anggota.some((a) => a.nim === user.nim)
    );

    setGrupList(milikSaya);
  }, [user]);

  return (
    <div className="p-4">
      <h3>Daftar Grup Saya</h3>
      {grupList.length === 0 ? (
        <p>Kamu belum tergabung dalam grup manapun.</p>
      ) : (
        grupList.map((grup) => (
          <Card className="mb-3" key={grup.id}>
            <Card.Body>
              <Card.Title>Grup ID: {grup.id}</Card.Title>
              <Button
                onClick={() => navigate(`/grup/${grup.id}`)}
                variant="primary"
              >
                Masuk Grup
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
