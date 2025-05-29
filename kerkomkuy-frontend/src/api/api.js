import axios from "axios";

// ✅ Konfigurasi instance Axios
const api = axios.create({
  baseURL: "http://127.0.0.1:6543/api", // Sesuaikan dengan URL backend
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ==============================
// 🔐 Autentikasi
// ==============================

export const login = (nim, password) => api.post("/login", { nim, password });

// ==============================
// 👤 USER
// ==============================

export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ==============================
// 📅 JADWAL KULIAH
// ==============================

export const getJadwal = (userId) => api.get(`/jadwal?user_id=${userId}`);
export const getJadwalById = (id) => api.get(`/jadwal/${id}`);
export const tambahJadwal = (data) => api.post("/jadwal", data);
export const updateJadwal = (id, data) => api.put(`/jadwal/${id}`, data);
export const deleteJadwal = (id) => api.delete(`/jadwal/${id}`);

// ==============================
// 👥 GRUP
// ==============================

export const buatGrup = (data) => api.post("/grup", data);
export const getGrupByUser = (nim) => api.get(`/grup?nim=${nim}`);
export const getGrupById = (id) => api.get(`/grup/${id}`);
export const deleteGrup = (id) => api.delete(`/grup/${id}`);

// ==============================
// ✉️ AJAKAN
// ==============================

export const kirimAjakan = (data) => api.post("/ajakan", data);
export const getAjakanMasuk = (userId) => api.get(`/ajakan?user_id=${userId}`);
export const updateAjakanStatus = (id, status) =>
  api.put(`/ajakan/${id}`, { status });

// ==============================
// 💬 CHAT
// ==============================

export const kirimChat = (data) => api.post("/chat", data);
export const getChatByGrup = (grupId) => api.get(`/chat?grup_id=${grupId}`);

// ==============================

export default api;
