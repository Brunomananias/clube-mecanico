import React, { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Toolbar,
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  School,
  TrendingUp,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import CriarCursoModal from '../components/CriarCursoModal';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || 'admin@clube.com';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const students = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', course: 'Mecânica Básica', status: 'Ativo' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', course: 'Eletrônica', status: 'Ativo' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', course: 'Gestão', status: 'Inativo' },
    { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', course: 'Motos', status: 'Ativo' },
  ];

  return (
    <>
      <Navbar userType="admin" userEmail={userEmail} />
      <Toolbar />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="secondary">
              Painel Administrativo
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administrador: {userEmail}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setModalOpen(true)} // Abre o modal
          >
            Novo Curso
          </Button>
        </Box>

        {/* Cards de Estatísticas */}
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
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Alunos</Typography>
                  <Typography variant="h4" fontWeight="bold">1,248</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h6">Cursos Ativos</Typography>
                  <Typography variant="h4" fontWeight="bold">15</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">Matrículas (Mês)</Typography>
                  <Typography variant="h4" fontWeight="bold">86</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <AdminPanelSettings />
                </Avatar>
                <Box>
                  <Typography variant="h6">Taxa de Conclusão</Typography>
                  <Typography variant="h4" fontWeight="bold">74%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Tabela de Alunos */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Gerenciamento de Alunos
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              Adicionar Aluno
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.status}
                        color={student.status === 'Ativo' ? 'success' : 'error'}
                        size="small"
                        icon={student.status === 'Ativo' ? <CheckCircle /> : <Cancel />}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Seções de Gerenciamento */}
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
              Gerenciamento de Cursos
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              Ver Todos os Cursos
            </Button>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              Criar Novo Curso
            </Button>
            <Button variant="outlined" fullWidth>
              Estatísticas de Cursos
            </Button>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Configurações do Sistema
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              Configurações do Site
            </Button>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              Gerenciar Usuários
            </Button>
            <Button variant="outlined" fullWidth>
              Backup do Sistema
            </Button>
          </Paper>
        </Box>
      </Container>
      <CriarCursoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default AdminDashboard;