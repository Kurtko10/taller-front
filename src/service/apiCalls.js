import axios from "axios";


const API_URL = "http://localhost:3010"

// Login de usuario
export const loginCall = async (credentials) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, credentials);
    
    return res;

};

