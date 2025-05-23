import { useState, useEffect, useContext } from "react";
import { Button, Card, Form, Table, Alert, Col, Row } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { getJadwal, cariJadwalKosong } from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  console.log("Dashboard component rendered"); // Log tambahan

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
  const [terpilih, setTerpilih] = useState([]); // State untuk jadwal terpilih

  // Load jadwal saat komponen mount
  useEffect(() => {
    if (user) {
      getJadwal().then((res) => setJadwal(res.data.jadwal));
    }
  }, [user]);

  // Log state user dan jadwal
  useEffect(() => {
    console.log("Dashboard user:", user);
    console.log("Jadwal state:", jadwal);
  }, [user, jadwal]);

  // Handle form input jadwal
  const handleInputChange = (e) => {
    setFormJadwal({ ...formJadwal, [e.target.name]: e.target.value });
  };

  const handleSubmitJadwal = (e) => {
    e.preventDefault();
    setJadwal([...jadwal, { ...formJadwal, id: Date.now() }]);
    setFormJadwal({
      hari: "Senin",
      jam_mulai: "",
      jam_selesai: "",
      matkul: "",
    });
  };
  // Handle cari jadwal kosong
  const handleCariJadwal = () => {
    const anggotaIds = anggota.map((a) => a.nim); // Use nim instead of id
    cariJadwalKosong(anggotaIds).then((res) => {
      setJadwalKosong(res.data.jadwal_kosong);
    });
  };

  // Handle ajak anggota
  const handleAjakAnggota = () => {
    if (searchNim && !anggota.some((a) => a.nim === searchNim)) {
      setAnggota([...anggota, { nim: searchNim }]);
      setSearchNim("");
    }
  };

  return (
    <div className="p-4">
      <h1>Selamat Datang di KerKomKuy</h1>
      {user ? (
        <p>Semangat Kerkom, {user.namaLengkap}!</p>
      ) : (
        <p>Loading user data...</p>
      )}

      <h2>Jadwal Kuliah</h2>

      {/* Form Input Jadwal */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmitJadwal}>
            <Row>
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
                <Button type="submit" variant="primary">
                  Tambah
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Daftar Jadwal */}
      <Table striped bordered className="mb-4">
        <thead>
          <tr>
            <th>Hari</th>
            <th>Jam Mulai</th>
            <th>Jam Selesai</th>
            <th>Mata Kuliah</th>
          </tr>
        </thead>
        <tbody>
          {jadwal.map((item) => (
            <tr key={item.id}>
              <td>{item.hari}</td>
              <td>{item.jam_mulai}</td>
              <td>{item.jam_selesai}</td>
              <td>{item.matkul}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Manajemen Kelompok */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Tambah Anggota Kelompok</h5>
          <div className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="Cari by NIM"
              value={searchNim}
              onChange={(e) => setSearchNim(e.target.value)}
              className="me-2"
            />
            <Button onClick={handleAjakAnggota}>Ajak Kerkom</Button>
          </div>
          {anggota.length > 0 && (
            <Alert variant="info">
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
        <Card>
          <Card.Body>
            <h5>Jadwal Kosong Bersama:</h5>
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
            </Form>{" "}
            <Button
              className="mt-3"
              disabled={terpilih.length === 0}
              variant="primary"
              onClick={() => {
                const existingGrup =
                  JSON.parse(localStorage.getItem("grup_list")) || [];

                // Make sure current user is included in the group members
                let allMembers = [...anggota];

                // Check if current user is already in the members list
                const isCurrentUserIncluded = allMembers.some(
                  (member) => member.nim === user.nim
                );

                // If not, add the current user to the members list
                if (!isCurrentUserIncluded) {
                  allMembers.push({ nim: user.nim });
                }

                const newGrup = {
                  id: Date.now(),
                  anggota: allMembers,
                  jadwal: terpilih,
                };

                const updated = [...existingGrup, newGrup];
                localStorage.setItem("grup_list", JSON.stringify(updated));

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
