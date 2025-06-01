import { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  Form,
  Table,
  Alert,
  Col,
  Row,
  Accordion,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import {
  getJadwal,
  tambahJadwal,
  deleteJadwal,
  buatGrup,
  kirimAjakan,
  getUsers,
  cariJadwalKosong,
} from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jadwal, setJadwal] = useState([]);
  const [searchNim, setSearchNim] = useState("");
  const [anggota, setAnggota] = useState([]);
  const [jadwalKosong, setJadwalKosong] = useState({});
  const [terpilih, setTerpilih] = useState([]);
  const [formJadwal, setFormJadwal] = useState({
    hari: "Senin",
    jam_mulai: "",
    jam_selesai: "",
    matkul: "",
  });

  useEffect(() => {
    if (user?.id) {
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

  const handleCariJadwal = async () => {
    try {
      const allIds = [user.id, ...anggota.map((a) => a.id)];
      const res = await cariJadwalKosong({ anggota_ids: allIds });
      setJadwalKosong(res.data);
    } catch (err) {
      console.error("Gagal mencari jadwal kosong:", err);
    }
  };

  const handleAjakAnggota = async () => {
    if (!searchNim) return;
    try {
      const res = await getUsers();
      const found = res.data.find((u) => u.nim === searchNim);
      if (found) {
        const alreadyAdded = anggota.some((a) => a.id === found.id);
        if (!alreadyAdded) {
          setAnggota([...anggota, found]);
        }
        setSearchNim("");
      } else {
        alert("NIM tidak ditemukan.");
      }
    } catch (err) {
      console.error("Gagal mencari user:", err);
    }
  };

  const handleBuatGrup = async () => {
    try {
      if (!anggota.every((a) => a.id)) {
        console.error("Ada anggota tanpa ID:", anggota);
        alert("Semua anggota harus valid dan memiliki ID.");
        return;
      }

      const res = await buatGrup({
        admin_id: user.id,
        anggota_nim: anggota.map((a) => a.nim),
        jadwal: terpilih, // ✅ TERPILIH JADWAL IKUT DIKIRIM
      });

      const grupBaru = { id: res.data.grup_id };
      console.log("Grup berhasil dibuat:", grupBaru);

      await Promise.all(
        anggota.map((a) =>
          kirimAjakan({
            dari_user_id: user.id,
            ke_user_id: a.id,
            grup_id: grupBaru.id,
          })
        )
      );

      navigate(`/grup/${grupBaru.id}`);
    } catch (err) {
      console.error("Gagal membuat grup:", err);
      alert("Terjadi kesalahan saat membuat grup. Silakan coba lagi.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="fw-bold mb-3" style={{ color: "#36586b" }}>
        Selamat Datang di KerKomKuy
      </h1>
      {user ? (
        <p className="mb-4">Semangat Kerkom, {user.nama_lengkap}!</p>
      ) : (
        <p className="mb-4">Loading user data...</p>
      )}

      {/* Jadwal Kuliah */}
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
              Anggota Terpilih:{" "}
              {anggota.map((a) => a.nama_lengkap || a.nim).join(", ")}
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
      {Object.keys(jadwalKosong).length > 0 && (
        <Card className="p-3 bg-white border-0 shadow-sm">
          <Card.Body>
            <h5 className="fw-semibold">Jadwal Kosong Bersama</h5>
            <Accordion>
              {Object.entries(jadwalKosong).map(([hari, slots], index) => (
                <Accordion.Item eventKey={index.toString()} key={hari}>
                  <Accordion.Header>{hari}</Accordion.Header>
                  <Accordion.Body>
                    {slots.length === 0 ? (
                      <div className="text-muted">
                        Tidak ada waktu kosong di hari ini
                      </div>
                    ) : (
                      slots.map((slot, i) => {
                        const label = `${hari} ${slot}`;
                        return (
                          <Form.Check
                            key={`${hari}-${i}`}
                            type="checkbox"
                            label={label}
                            id={`${hari}-${i}`}
                            checked={terpilih.includes(label)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTerpilih([label]);
                              } else {
                                setTerpilih([]);
                              }
                            }}
                          />
                        );
                      })
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
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
