import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5173",
});

// Mock endpoints
mock.onGet("/api/jadwal").reply(200, {
  jadwal: [
    {
      id: 1,
      hari: "Senin",
      jam_mulai: "08:00",
      jam_selesai: "10:00",
      matkul: "Pemrograman Web",
    },
  ],
});

mock.onPost("/api/cari-jadwal").reply(200, {
  jadwal_kosong: ["Senin 10:00-12:00", "Rabu 13:00-15:00"],
});

export const getJadwal = () => api.get("/api/jadwal");
export const cariJadwalKosong = (anggotaIds) =>
  api.post("/api/cari-jadwal", { anggota_ids: anggotaIds });

export default api;
