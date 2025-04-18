import axios from "axios";

export const instanseAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
