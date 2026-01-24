/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../config/api";
// Interfaces
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
      console.error('❌ Erro no login:', error);
      throw error; // Não retornar objeto vazio, lançar o erro
    }
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token_expiry');
    
    // Dispara evento para atualizar outros componentes
    window.dispatchEvent(new Event('storage'));
  },

  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    
    try {
      const user = JSON.parse(userStr);
      return user;
    } catch (error) {
      return null;
    }
  },

  // VERIFICAÇÃO CORRIGIDA DO TOKEN
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      return false;
    }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      if (expiryTime < currentTime) {
        this.logout(); // Limpa os dados expirados
        return false;
      }
      // Verifica se o usuário é válido
      const user = JSON.parse(userStr);
      const isValidUser = user && (user.tipo === 0 || user.tipo === 1);
      return isValidUser;
      
    } catch (error) {
      this.logout(); // Se não conseguir decodificar, faz logout
      return false;
    }
  },

  // VERIFICAÇÃO DE PERMISSÕES ADICIONADA
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    const isAdmin = user?.tipo === 1;
    return isAdmin;
  },

  isAluno(): boolean {
    const user = this.getCurrentUser();
    const isAluno = user?.tipo === 0;
    return isAluno;
  },

  getUserType(): 0 | 1 | null {
    const user = this.getCurrentUser();
    const type = user?.tipo;
    return type === 1 ? 1 : (type === 0 ? 0 : null);
  },

  // NOVO: Método para verificar token antes de cada requisição
  getAuthHeader(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    const token = localStorage.getItem('auth_token');
    return token ? `Bearer ${token}` : null;
  },

  // NOVO: Refresh do token (se necessário no futuro)
  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        return response.data.token;
      }
      return null;
    } catch (error) {
      this.logout();
      return null;
    }
  }
};