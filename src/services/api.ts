// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  // URL baseada na porta 3000 definida no server.js
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token automaticamente
api.interceptors.request.use(
  (config) => {
    // Pegamos o token que o Login devolveu
    const token = localStorage.getItem('tradedata_token');
    
    // O middleware do back espera apenas o token cru ou Bearer. 
    // Pelo código 'const cToken = req.headers.authorization', ele lê tudo.
    // Vamos mandar direto. Se falhar, tentamos adicionar 'Bearer '.
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;