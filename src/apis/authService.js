import axios from "axios";
import getEnvVariable from "../utils/getEnvVariable";

const authService = axios.create({
  baseURL: getEnvVariable("VITE_AUTH_SERVICE_URL"),
  headers: {
    "Content-Type": "application/json",
  },
});

export default authService;
