import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  Toolbar,
} from '@mui/material';
import {
  Book,
  Assignment,
  Badge,
  Settings,
  ExitToApp,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

const AlunoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'aluno@clube.com';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const courses = [
    { id: 1, name: 'Mecânica de Bicicletas Básico', progress: 75 },
    { id: 2, name: 'Manutenção de Freios', progress: 30 },
    { id: 3, name: 'Suspensão e Geometria', progress: 10 },
  ];

  return (
    <>
      <Navbar userType="aluno" userEmail={userEmail} />
      <Toolbar />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Painel do Aluno
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Bem-vindo, {userEmail}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Box>

        {/* Cards de Informações */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 4,
          '& > *': {
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' }
          }
        }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <Book />
              </Avatar>
              <Typography variant="h6">Cursos Ativos</Typography>
              <Typography variant="h4" fontWeight="bold">3</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                <Assignment />
              </Avatar>
              <Typography variant="h6">Tarefas</Typography>
              <Typography variant="h4" fontWeight="bold">5</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                <Badge />
              </Avatar>
              <Typography variant="h6">Certificados</Typography>
              <Typography variant="h4" fontWeight="bold">1</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h6">Progresso Médio</Typography>
              <Typography variant="h4" fontWeight="bold">38%</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Seção de Cursos */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Meus Cursos
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {courses.map((course) => (
            <Card key={course.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">{course.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <Box sx={{ 
                          width: '100%', 
                          height: 8, 
                          bgcolor: 'grey.300', 
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}>
                          <Box 
                            sx={{ 
                              width: `${course.progress}%`, 
                              height: '100%', 
                              bgcolor: 'primary.main',
                              borderRadius: 4
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2">{course.progress}%</Typography>
                    </Box>
                  </Box>
                  <Button variant="contained" color="primary">
                    Continuar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Paper>

        {/* Calendário e Atividades */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          '& > *': {
            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' }
          }
        }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              <CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />
              Próximas Aulas
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" color="text.secondary">
              Nenhuma aula agendada para os próximos dias.
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              <Settings sx={{ verticalAlign: 'middle', mr: 1 }} />
              Configurações da Conta
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
              Alterar Senha
            </Button>
            <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
              Editar Perfil
            </Button>
            <Button variant="outlined" fullWidth>
              Notificações
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default AlunoDashboard;