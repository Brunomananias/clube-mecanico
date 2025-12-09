/* eslint-disable no-useless-catch */
// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { authService, type Usuario } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (
    email: string, 
    password: string, 
    userType: 'aluno' | 'admin'
  ) => {
    try {
      const response = await authService.login({
        email,
        senha: password,
        tipoUsuario: userType
      });
      
      setUser(response.usuario);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    checkAuth
  };
};