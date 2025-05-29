import { useState, useEffect, useContext } from "react";
import { Button, Card, Form, Table, Alert, Col, Row } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import {
  getJadwal,
  tambahJadwal,
  deleteJadwal,
  buatGrup,
  kirimAjakan,
} from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

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
      getJadwal(user.id).then((res) => setJadwal(res.data));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormJadwal({ ...formJadwal, [e.target.name]: e.target.value });
  };

  const handleSubmitJadwal = async (e) => {
    e.preventDefault();
    try {
      await tambahJadwal({ ...formJadwal, user_id: user.id });
      const res = await getJadwal(user.id);
      setJadwal(res.data);
      setFormJadwal({
        hari: "Senin",
        jam_mulai: "",
        jam_selesai: "",
        matkul: "",
      });
    } catch (err) {
      console.error("Error adding schedule:", err);
    }
  };

  const handleHapusJadwal = async (id) => {
    try {
      await deleteJadwal(id);
      const res = await getJadwal(user.id);
      setJadwal(res.data);
    } catch (err) {
      console.error("Error deleting schedule:", err);
    }
  };

  const handleCariJadwal = () => {
    // Dummy schedule suggestion
    const dummyJadwalKosong = ["Senin 10:00-12:00", "Rabu 08:00-10:00"];
    setJadwalKosong(dummyJadwalKosong);
  };

  const handleAjakAnggota = () => {
    if (searchNim && !anggota.some((a) => a.nim === searchNim)) {
      setAnggota([...anggota, { nim: searchNim }]);
      setSearchNim("");
    }
  };

  const handleBuatGrup = async () => {
    try {
      const res = await buatGrup({
        admin_id: user.id,
        anggota_nim: anggota.map((a) => a.nim),
      });

      const grupBaru = res.data.grup;

      await Promise.all(
        anggota.map((a) =>
          kirimAjakan({
            dari_user_id: user.id,
            ke_user_id: parseInt(a.nim),
            grup_id: grupBaru.id,
          })
        )
      );

      navigate(`/grup/${grupBaru.id}`);
    } catch (err) {
      console.error("Gagal membuat grup:", err);
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
              onClick={handleBuatGrup}
            >
              Buat Grup
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
