import { useEffect, useState, useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getGrupByUser, deleteGrup } from "../api/api";

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

        // Prioritaskan grup di mana user adalah admin
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
      intervalId = setInterval(fetchGrupList, 10000);
    }

    return () => clearInterval(intervalId);
  }, [user]);

  const handleDeleteGrup = async (grupId) => {
    const confirm = window.confirm("Yakin ingin menghapus grup ini?");
    if (!confirm) return;

    try {
      await deleteGrup(grupId);
      setGrupList((prev) => prev.filter((g) => g.id !== grupId));
    } catch (err) {
      console.error("Gagal menghapus grup:", err);
      alert("Terjadi kesalahan saat menghapus grup.");
    }
  };

  return (
    <div className="p-4">
      <div className="mb-3">
        <h3>Daftar Grup Saya</h3>
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

              <div className="d-flex gap-2">
                <Button
                  onClick={() => navigate(`/grup/${grup.id}`)}
                  variant="primary"
                >
                  Masuk Grup
                </Button>

                {grup.admin_id === user.id && (
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteGrup(grup.id)}
                  >
                    Hapus Grup
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
