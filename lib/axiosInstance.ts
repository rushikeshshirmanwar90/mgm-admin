import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DOMAIN}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
