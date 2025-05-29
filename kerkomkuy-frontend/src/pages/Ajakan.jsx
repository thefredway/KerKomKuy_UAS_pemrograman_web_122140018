import { useContext, useEffect, useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { getGrupByUser, getGrupById, updateGrup, deleteGrup } from "../api/api"; // Mengimpor API yang diperlukan
import { useNavigate } from "react-router-dom";

export default function Ajakan() {
  const { user } = useContext(AuthContext);
  const [invitations, setInvitations] = useState([]);
  const navigate = useNavigate();

  // Mengambil ajakan yang belum diterima oleh user
  useEffect(() => {
    if (user) {
      getPendingInvitations(user.nim).then((res) => {
        setInvitations(res.data || []);
      });
    }
  }, [user]);

  // Mendapatkan ajakan pending dari backend
  const getPendingInvitations = async (nim) => {
    try {
      const response = await getGrupByUser(user.id); // Ambil grup yang dimiliki user
      const pending = response.data.filter((grup) =>
        grup.pending_invites.some((invite) => invite.nim === nim)
      );
      return { data: pending };
    } catch (err) {
      console.error("Error fetching pending invitations:", err);
      return { data: [] }; // Mengembalikan array kosong jika error
    }
  };

  const handleAccept = async (grup_id) => {
    try {
      // Ambil grup berdasarkan ID
      const grupResponse = await getGrupById(grup_id);
      const grup = grupResponse.data;

      // Menambahkan user ke dalam grup jika belum ada
      if (!grup.anggota.some((a) => a.nim === user.nim)) {
        grup.anggota.push({ nim: user.nim });
        await updateGrup(grup_id, grup); // Update grup di backend
      }

      // Menghapus ajakan dari daftar pending
      await deletePendingInvitation(grup_id); // Hapus ajakan dari pending di backend
      navigate(`/grup/${grup_id}`);
    } catch (err) {
      console.error("Error accepting invitation:", err);
    }
  };

  const handleRemove = async (grup_id) => {
    try {
      // Menghapus ajakan yang ditolak
      await deletePendingInvitation(grup_id); // Hapus ajakan dari pending di backend
      setInvitations((prev) => prev.filter((inv) => inv.grup_id !== grup_id)); // Update state ajakan
    } catch (err) {
      console.error("Error removing invitation:", err);
    }
  };

  // Fungsi untuk menghapus ajakan pending dari backend
  const deletePendingInvitation = async (grup_id) => {
    try {
      await deleteGrup(grup_id); // Menghapus ajakan grup yang ditolak
    } catch (err) {
      console.error("Error deleting pending invitation:", err);
    }
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
