import { useContext, useEffect, useState, useCallback } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { getAjakanMasuk, updateAjakanStatus } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Ajakan() {
  const { user } = useContext(AuthContext);
  const [invitations, setInvitations] = useState([]);
  const navigate = useNavigate(); // Fungsi untuk mengambil ajakan yang masuk
  const fetchAjakan = useCallback(async () => {
    if (!user) return;

    try {
      const res = await getAjakanMasuk(user.id);
      setInvitations(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil ajakan:", err);
    }
  }, [user]);

  // Ambil ajakan saat komponen dimount atau user berubah
  useEffect(() => {
    fetchAjakan();
  }, [fetchAjakan]);
  const handleAccept = async (ajakanId, grupId) => {
    try {
      await updateAjakanStatus(ajakanId, "accepted");
      // Hapus ajakan dari state sebelum navigasi
      setInvitations((prev) => prev.filter((a) => a.id !== ajakanId));
      // Navigasi ke halaman grup
      navigate(`/grup/${grupId}`);
    } catch (err) {
      console.error("Gagal menerima ajakan:", err);
      // Refresh data jika terjadi error
      fetchAjakan();
    }
  };
  const handleReject = async (ajakanId) => {
    try {
      await updateAjakanStatus(ajakanId, "rejected");
      // Hapus ajakan dari state
      setInvitations((prev) => prev.filter((a) => a.id !== ajakanId));
    } catch (err) {
      console.error("Gagal menolak ajakan:", err);
      // Refresh data jika terjadi error
      fetchAjakan();
    }
  };
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Ajakan Masuk Grup</h3>
        <Button variant="outline-primary" onClick={fetchAjakan}>
          Refresh
        </Button>
      </div>
      {invitations.length === 0 ? (
        <Alert variant="info">Belum ada ajakan masuk.</Alert>
      ) : (
        invitations.map((ajakan) => (
          <Card key={ajakan.id} className="mb-3">
            <Card.Body>
              <h5>Grup ID: {ajakan.grup_id}</h5>
              <p>Diajak oleh User ID: {ajakan.dari_user_id}</p>
              <div className="d-flex gap-2">
                <Button
                  variant="success"
                  onClick={() => handleAccept(ajakan.id, ajakan.grup_id)}
                >
                  Terima
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleReject(ajakan.id)}
                >
                  Tolak
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
