import { useState, useEffect, useContext } from "react";
import { Button, Card, Form, Table, Alert, Col, Row } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import {
  getJadwal,
  tambahJadwal,
  deleteJadwal,
  cariJadwalKosong,
} from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Ikon hapus

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jadwal, setJadwal] = useState([]);
  const [searchNim, setSearchNim] = useState("");
  const [anggota, setAnggota] = useState([]);
  const [jadwalKosong, setJadwalKosong] = useState([]);
  const [formJadwal, setFormJadwal] = useState({
    hari: "Senin",
    jam_mulai: "",
    jam_selesai: "",
    matkul: "",
  });
  const [terpilih, setTerpilih] = useState([]);

  useEffect(() => {
    if (user) {
      getJadwal(user.id).then((res) => setJadwal(res.data)); // Memastikan jadwal user diambil dengan benar
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormJadwal({ ...formJadwal, [e.target.name]: e.target.value });
  };

  const handleSubmitJadwal = async (e) => {
    e.preventDefault();
    try {
      // Mengirim data jadwal baru
      await tambahJadwal({ ...formJadwal, user_id: user.id });
      // Mengambil jadwal terbaru setelah penambahan
      const res = await getJadwal(user.id);
      setJadwal(res.data); // Memperbarui jadwal yang ditampilkan
      // Reset form setelah penambahan
      setFormJadwal({
        hari: "Senin",
        jam_mulai: "",
        jam_selesai: "",
        matkul: "",
      });
    } catch (err) {
      console.error("Error adding schedule:", err); // Menangani error saat penambahan jadwal
    }
  };

  const handleHapusJadwal = async (id) => {
    try {
      // Memanggil API untuk menghapus jadwal berdasarkan ID
      await deleteJadwal(id);
      // Mengambil kembali jadwal yang sudah diperbarui setelah penghapusan
      const res = await getJadwal(user.id);
      setJadwal(res.data); // Memperbarui jadwal
    } catch (err) {
      console.error("Error deleting schedule:", err); // Menangani error saat penghapusan jadwal
    }
  };

  const handleCariJadwal = () => {
    const anggotaIds = anggota.map((a) => a.nim);
    cariJadwalKosong(anggotaIds).then((res) => {
      setJadwalKosong(res.data.jadwal_kosong); // Menampilkan jadwal kosong
    });
  };

  const handleAjakAnggota = () => {
    if (searchNim && !anggota.some((a) => a.nim === searchNim)) {
      setAnggota([...anggota, { nim: searchNim }]);
      setSearchNim("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="fw-bold mb-3" style={{ color: "#36586b" }}>
        Selamat Datang di KerKomKuy
      </h1>
      {user ? (
        <p className="mb-4">Semangat Kerkom, {user.namaLengkap}!</p>
      ) : (
        <p className="mb-4">Loading user data...</p>
      )}

      <h2>Jadwal Kuliah</h2>
      <Card className="mb-4 p-3 bg-white border-0 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmitJadwal}>
            <Row className="g-2">
              <Col md={3}>
                <Form.Select
                  name="hari"
                  value={formJadwal.hari}
                  onChange={handleInputChange}
                >
                  {[
                    "Senin",
                    "Selasa",
                    "Rabu",
                    "Kamis",
                    "Jumat",
                    "Sabtu",
                    "Minggu",
                  ].map((hari) => (
                    <option key={hari}>{hari}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Control
                  type="time"
                  name="jam_mulai"
                  value={formJadwal.jam_mulai}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="time"
                  name="jam_selesai"
                  value={formJadwal.jam_selesai}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="matkul"
                  placeholder="Mata Kuliah"
                  value={formJadwal.matkul}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={2}>
                <Button type="submit" variant="primary" className="w-100">
                  Tambah
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Tabel Jadwal */}
      <Table striped bordered className="mb-4">
        <thead>
          <tr>
            <th>Hari</th>
            <th>Jam Mulai</th>
            <th>Jam Selesai</th>
            <th>Mata Kuliah</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jadwal.map((item) => (
            <tr key={item.id}>
              <td>{item.hari}</td>
              <td>{item.jam_mulai}</td>
              <td>{item.jam_selesai}</td>
              <td>{item.matkul}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleHapusJadwal(item.id)}
                >
                  <FaTrash className="me-1" />
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Tambah Anggota */}
      <Card className="mb-4 p-3 bg-white border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3 fw-semibold">Tambah Anggota Kelompok</h5>
          <div className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="Cari by NIM"
              value={searchNim}
              onChange={(e) => setSearchNim(e.target.value)}
              className="me-2"
            />
            <Button onClick={handleAjakAnggota} variant="primary">
              Ajak Kerkom
            </Button>
          </div>
          {anggota.length > 0 && (
            <Alert variant="info" className="rounded-pill px-4 py-2">
              Anggota Terpilih: {anggota.map((a) => a.nim).join(", ")}
            </Alert>
          )}
          <Button
            variant="success"
            onClick={handleCariJadwal}
            disabled={anggota.length === 0}
          >
            Cari Jadwal Kosong
          </Button>
        </Card.Body>
      </Card>

      {/* Hasil Jadwal Kosong */}
      {jadwalKosong.length > 0 && (
        <Card className="p-3 bg-white border-0 shadow-sm">
          <Card.Body>
            <h5 className="fw-semibold">Jadwal Kosong Bersama</h5>
            <Form>
              {jadwalKosong.map((slot, index) => (
                <Form.Check
                  type="checkbox"
                  label={slot}
                  key={index}
                  id={`checkbox-${index}`}
                  checked={terpilih.includes(slot)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTerpilih([...terpilih, slot]);
                    } else {
                      setTerpilih(terpilih.filter((s) => s !== slot));
                    }
                  }}
                />
              ))}
            </Form>
            <Button
              className="mt-3"
              disabled={terpilih.length === 0}
              variant="primary"
              onClick={() => {
                const existingGrup =
                  JSON.parse(localStorage.getItem("grup_list")) || [];
                const newGrup = {
                  id: Date.now(),
                  anggota: anggota,
                  jadwal: terpilih,
                };

                const pending =
                  JSON.parse(localStorage.getItem("pending_invitations")) || {};
                anggota.forEach((a) => {
                  if (!pending[a.nim]) pending[a.nim] = [];
                  pending[a.nim].push({
                    grup_id: newGrup.id,
                    dari: user.nim,
                    jadwal: terpilih,
                  });
                });
                localStorage.setItem(
                  "pending_invitations",
                  JSON.stringify(pending)
                );
                localStorage.setItem(
                  "grup_list",
                  JSON.stringify([...existingGrup, newGrup])
                );
                navigate(`/grup/${newGrup.id}`);
              }}
            >
              Buat Grup
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
