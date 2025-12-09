/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  Toolbar,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CriarCursoModal from '../components/CriarCursoModal';
import CriarTurmaModal from '../components/CriarTurmaModal';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNovaTurmaOpen, setModalNovaTurmaOpen] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || 'admin@clube.com';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleSaveTurma = async (turmaData: any) => {
  console.log('Salvando turma:', turmaData);
  
  try {
    // Simulação de salvamento
    // const novaTurma = {
    //   id: turmas.length + 1,
    //   cursoId: parseInt(turmaData.cursoId),
    //   cursoNome: cursos.find(c => c.id === parseInt(turmaData.cursoId))?.titulo || '',
    //   dataInicio: turmaData.dataInicio,
    //   dataFim: turmaData.dataFim,
    //   horario: turmaData.horario,
    //   professor: turmaData.professor,
    //   vagasTotal: turmaData.vagasTotal,
    //   vagasDisponiveis: turmaData.vagasDisponiveis,
    //   status: turmaData.status
    // };
    
    // // setTurmas([...turmas, novaTurma]);
    // console.log('Turma simulada criada:', novaTurma);
    
  } catch (error) {
    console.error('Erro ao criar turma:', error);
    throw error;
  }
};

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
           <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setModalNovaTurmaOpen(true)} // Abre o modal
          >
            Nova Turma
          </Button>
        </Box>

        {/* Seções de Gerenciamento */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          '& > *': {
            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' }
          }
        }}>
          <Paper sx={{ p: 3}}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Gerenciamento de Cursos
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => {
              navigate("/admin/cursos")
            }}>
              Ver Todos os Cursos
            </Button>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              Criar Novo Curso
            </Button>
          </Paper>
        </Box>
      </Container>
      <CriarCursoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <CriarTurmaModal
      open={modalNovaTurmaOpen}
      onClose={() => setModalNovaTurmaOpen(false)}
      onSave={handleSaveTurma}
/>
    </>
  );
};

export default AdminDashboard;