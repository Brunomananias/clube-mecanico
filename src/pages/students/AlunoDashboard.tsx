/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const AlunoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    console.log('AlunoDashboard montado');
    
    // Verificar autenticação
    if (!authService.isAuthenticated()) {
      console.log('Não autenticado, redirecionando para login');
      navigate('/login');
      return;
    }

    // Obter usuário atual
    const currentUser = authService.getCurrentUser();
    console.log('Usuário atual:', currentUser);
    
    if (!currentUser) {
      console.log('Usuário não encontrado');
      navigate('/login');
      return;
    }

    // Verificar se é aluno
    if (currentUser.tipoUsuario !== 'aluno') {
      console.log('Não é aluno, redirecionando');
      if (currentUser.tipoUsuario === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4">Carregando...</Typography>
        <Typography variant="body1">Aguarde enquanto carregamos seus dados.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Painel do Aluno
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Sair
          </Button>
        </Box>

        <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Olá, {user?.nome || 'Aluno'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Email: {user?.email}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tipo: {user?.tipoUsuario}
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Seus Cursos
          </Typography>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="body1">
              Em breve você verá seus cursos aqui.
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default AlunoDashboard;