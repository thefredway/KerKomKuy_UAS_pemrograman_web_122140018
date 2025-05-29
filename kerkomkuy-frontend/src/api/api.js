import axios from "axios";

// Membuat instance axios dengan base URL yang sesuai
const api = axios.create({
  baseURL: "http://127.0.0.1:6543/api", // Sesuaikan dengan URL backend Anda
});

// Fungsi untuk login
export const login = (nim, password) => api.post("/login", { nim, password });

// Fungsi untuk mendapatkan semua pengguna
export const getUsers = () => api.get("/users");

// Fungsi untuk mendapatkan jadwal berdasarkan user_id
export const getJadwal = (userId) => api.get(`/jadwal?user_id=${userId}`);

// Fungsi untuk menambah jadwal baru
export const tambahJadwal = (jadwal) => api.post("/jadwal", jadwal);

// User
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Jadwal
export const getJadwalById = (id) => api.get(`/jadwal/${id}`);
export const updateJadwal = (id, data) => api.put(`/jadwal/${id}`, data);
export const deleteJadwal = (id) => api.delete(`/jadwal/${id}`);

// Grup
export const buatGrup = (data) => api.post("/grup", data);
export const getGrupByUser = (userId) => api.get(`/grup?user_id=${userId}`);
export const getGrupById = (id) => api.get(`/grup/${id}`);
export const deleteGrup = (id) => api.delete(`/grup/${id}`);

export default api;
