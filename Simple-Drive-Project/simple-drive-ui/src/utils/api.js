import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
});

export async function uploadBlob(id, base64) {
  return api.post("/", { id, data: base64 });
}

export async function getBlob(id) {
  return api.get(`/${encodeURIComponent(id)}`);
}
