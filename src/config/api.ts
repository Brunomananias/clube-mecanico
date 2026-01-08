// src/services/api.ts
import axios from 'axios';

// Configuração base
const API_BASE_URL = 'https://clube-mecanico-api.onrender.com/api';
// const API_BASE_URL = 'https://localhost:7289/api';
// Cria instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento global de erros
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Acesso negado
      console.error('Acesso negado:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Exporta a instância configurada
export default api;
// Função para construir URL completa
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};