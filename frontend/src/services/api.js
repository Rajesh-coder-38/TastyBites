import axios from "axios";

const api = axios.create({
  baseURL: "https://tasty-bites-rg3x.vercel.app/api",
});

export default api;