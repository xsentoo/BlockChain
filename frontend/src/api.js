import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/bloc/";
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});
export const apiAffiche = {
    generer: () => api.get("generer"),
    miner: () => api.get("miner")
};

export default api;