import axios from "axios";

// BASE API URL
const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/";

// Konfigurasi axios
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token autentikasi jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fungsi-fungsi API
export const shortenUrl = async (originalUrl: string) => {
  const response = await api.post("/urls", { url: originalUrl });
  return response.data;
};

export const getUserUrls = async () => {
  const response = await api.get("/urls");
  return response.data;
};

export const getUrlStats = async (shortId: string) => {
  const response = await api.get(`/visits/${shortId}`);
  return response.data;
};

export const deleteUrl = async (shortId: string) => {
  const response = await api.delete(`/urls/${shortId}`);
  return response.data;
};

// Autentikasi
export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { username: email, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  // Backend hanya menerima username dan password, jadi kita gunakan email sebagai username
  const response = await api.post("/auth/register", {
    username: email,
    password,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    return null;
  }
};

export default api;
