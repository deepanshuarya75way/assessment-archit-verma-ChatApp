import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "https://chatapp-backend-bupg.onrender.com/api"
      : "http://localhost:5001/api", 
  withCredentials: true,
});