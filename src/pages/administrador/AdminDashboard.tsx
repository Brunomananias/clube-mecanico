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
  PictureAsPdf,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CriarCursoModal from '../components/CriarCursoModal';
import CriarTurmaModal from '../components/CriarTurmaModal';
import AdicionarPdfModal from '../components/AdicionarPdfModal';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNovaTurmaOpen, setModalNovaTurmaOpen] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || 'admin@clube.com';
 const [modalPdfOpen, setModalPdfOpen] = useState(false);

  const handleSavePdf = (pdfData: any) => {
    console.log('PDF salvo com sucesso:', pdfData);
    // Aqui você pode:
    // 1. Atualizar a lista de PDFs
    // 2. Mostrar uma notificação
    // 3. Recarregar dados se necessário
    alert('PDF adicionado com sucesso!');
  };
//   const handleSaveTurma = async (turmaData: any) => {
//     const novaTurma = {
//       cursoId: parseInt(turmaData.cursoId),
//       dataInicio: turmaData.dataInicio,
//       dataFim: turmaData.dataFim,
//       horario: turmaData.horario,
//       professor: turmaData.professor,
//       vagasTotal: turmaData.vagasTotal,
//       vagasDisponiveis: turmaData.vagasDisponiveis,
//       status: turmaData.status
//     };

//     const response = await api.post("/turmas", novaTurma);
//     alert("turma criada com sucesso!")
//     setModalNovaTurmaOpen(false);
//     return response.data;
  
// };

  return (
    <>
      <Navbar userType="admin" userEmail={userEmail} />
      <Toolbar />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="secondary">
              Painel Administrativo
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administrador: {userEmail}
            </Typography>
          </Box>
          <Box
            sx={{
              display:"flex",
              gap: 2,
              flexWrap: "wrap"
            }}>

          
          <Button
            variant="contained"
            color="primary"
            sx={{whiteSpace: "nowrap"}}
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
        </Box>
         <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PictureAsPdf />}
            onClick={() => setModalPdfOpen(true)}
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              }
            }}
          >
            Adicionar PDF Complementar
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
/>
<AdicionarPdfModal
        open={modalPdfOpen}
        onClose={() => setModalPdfOpen(false)}
        onSave={handleSavePdf}
      />
    </>
  );
};

export default AdminDashboard;