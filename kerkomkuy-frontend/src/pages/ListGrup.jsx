import { useEffect, useState, useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getGrupByUser } from "../api/api";

export default function ListGrup() {
  const [grupList, setGrupList] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let intervalId;
    const fetchGrupList = async () => {
      try {
        const res = await getGrupByUser(user.nim);
        const groups = res.data || [];
        // Sort groups to show groups where user is admin first
        groups.sort((a, b) => {
          const isAdminA = a.admin_id === user.id;
          const isAdminB = b.admin_id === user.id;
          return isAdminB - isAdminA;
        });
        setGrupList(groups);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    if (user) {
      fetchGrupList();
      // Poll for updates every 10 seconds
      intervalId = setInterval(fetchGrupList, 10000);
    }

    return () => clearInterval(intervalId);
  }, [user]);

  const debugStorage = () => {
    console.log("All Groups:", grupList);
    console.log("Current User:", user);
  };

  const resetGrups = () => {
    if (window.confirm("Atur ulang semua data grup?")) {
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
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Grup ID: {grup.id}</span>
                {grup.admin_id === user.id && (
                  <span className="badge bg-primary">Admin</span>
                )}
              </Card.Title>
              <p>
                <strong>Anggota:</strong>{" "}
                {grup.anggota && grup.anggota.length > 0
                  ? grup.anggota.map((a) => a.nama_lengkap || a.nim).join(", ")
                  : "Belum ada"}
              </p>
              <p>
                <strong>Jumlah Anggota:</strong> {grup.anggota?.length || 0}
              </p>
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
