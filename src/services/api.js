import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // Ajuste para a porta do seu backend
  timeout: 10000,
});

export default api;
