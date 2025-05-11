import axios from "axios";
import.meta.env.VITE_API_URL;
import { VITE_API_URL } from "./env.js";

const api = axios.create({
  baseURL: VITE_API_URL,
});

export const login = (nim, password) => {
  return api.post("/api/login", { nim, password });
};
