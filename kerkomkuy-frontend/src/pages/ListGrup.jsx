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
  const debugStorage = () => {
    const stored = JSON.parse(localStorage.getItem("grup_list")) || [];
    console.log("All Groups:", stored);
    console.log("Current User:", user);
    console.log("Filtered Groups:", grupList);
  };

  const resetGrups = () => {
    if (window.confirm("Atur ulang semua data grup?")) {
      localStorage.removeItem("grup_list");
      setGrupList([]);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Daftar Grup Saya</h3>
        <div>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={debugStorage}
            className="me-2"
          >
            Debug
          </Button>
          <Button size="sm" variant="outline-danger" onClick={resetGrups}>
            Reset
          </Button>
        </div>
      </div>

      {grupList.length === 0 ? (
        <p>Kamu belum tergabung dalam grup manapun.</p>
      ) : (
        grupList.map((grup) => (
          <Card className="mb-3" key={grup.id}>
            <Card.Body>
              <Card.Title>Grup ID: {grup.id}</Card.Title>
              <p>Anggota: {grup.anggota?.map((a) => a.nim).join(", ")}</p>
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
