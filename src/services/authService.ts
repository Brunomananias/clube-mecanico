/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "../config/api";

// authService.ts atualizado
export interface LoginRequest {
  email: string;
  senha: string;
  tipo: 0 | 1; // 0 = aluno, 1 = admin
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  expiresIn: number;
}

export interface Usuario {
  id: number;
  nome_Completo: string;
  email: string;
  cpf: string;
  tipo: 0 | 1; // 0 = aluno, 1 = admin
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/Auth/login', credentials);
      
      if (response.data?.token) {
        const userData = response.data.usuario || response.data.user || response.data;
        
        // Armazena o token
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Armazena valores de compatibilidade
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', userData.tipo.toString());
        localStorage.setItem('userEmail', userData.email);
        
        // Calcula expiry
        const expiresIn = response.data.expiresIn || 3600;
        const expiryDate = new Date(Date.now() + expiresIn * 1000);
        localStorage.setItem('token_expiry', expiryDate.toISOString());
        
        // Dispara evento para atualizar outros componentes
        window.dispatchEvent(new Event('storage'));
        
        return {
          token: response.data.token,
          usuario: userData,
          expiresIn: expiresIn
        };
      }
      throw new Error('Resposta do servidor inválida');
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Retornar um objeto LoginResponse mesmo em caso de erro
      return {
        token: '',
        usuario: {
          id: 0,
          nome_Completo: '',
          email: '',
          cpf: '',
          tipo: 0
        },
        expiresIn: 0
      };
    }
  },

  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      return false;
    }
    
    try {
      const user = JSON.parse(userStr);
      return !!user && (user.tipo === 0 || user.tipo === 1);
    } catch {
      return false;
    }
  },

  getUserType(): 0 | 1 | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    return user.tipo === 1 ? 1 : 0;
  }
};