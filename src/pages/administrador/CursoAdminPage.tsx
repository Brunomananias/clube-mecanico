/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Visibility,
  Add,
  School,
  AccessTime,
  People,
  CheckCircle,
  Block,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../../config/api';

interface ICurso {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  fotoUrl: string;
  valor: number;
  duracaoHoras: string;
  nivel: string;
  maxAlunos: number;
  ativo: boolean;
  conteudoProgramatico: string;
  certificadoDisponivel: string;
  destaques: string[];
  cor: string;
}

const CursosAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [filteredCursos, setFilteredCursos] = useState<ICurso[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState<ICurso | null>(null);

  // Dados simulados - em produção viria da API
  const buscarCursos = async () => {
  try {
    const response = await api.get<ICurso[]>("/cursos");
    setCursos(response.data);
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
  }
};

  useEffect(() => {
      buscarCursos();
      setCursos(cursos);
      setFilteredCursos(cursos);
      setLoading(false);
  }, []);

  // Filtrar cursos
  useEffect(() => {
    let resultado = cursos;

    // Filtro por busca
    if (searchTerm) {
      resultado = resultado.filter(curso =>
        curso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (filterStatus !== 'todos') {
      resultado = resultado.filter(curso => curso.ativo);
    }
    setFilteredCursos(resultado);
  }, [searchTerm, filterStatus, cursos]);

  // Funções de manipulação
  const handleEditCurso = (id: number) => {
    navigate(`/admin/curso/editar/${id}`);
  };

  const handleViewCurso = (id: number) => {
    navigate(`/curso/${id}`);
  };

  const handleDeleteClick = (curso: ICurso) => {
    setCursoToDelete(curso);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cursoToDelete) return;

    try {
      // Simulação de exclusão
      console.log('Excluindo curso:', cursoToDelete.id);
      
      // Em produção:
      // await fetch(`/api/cursos/${cursoToDelete.id}`, { method: 'DELETE' });
      
      setCursos(cursos.filter(c => c.id !== cursoToDelete.id));
      setDeleteDialogOpen(false);
      setCursoToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
    }
  };

  const handleToggleStatus = async (curso: ICurso) => {
    try {
      const novoStatus = curso.ativo;

      // Simulação de atualização
      console.log("Atualizando status do curso:", curso.id, "para", novoStatus);

      // Em produção:
      // await fetch(`/api/cursos/${curso.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: novoStatus })
      // });

      setCursos(
        cursos.map((c) =>
          c.id === curso.id ? { ...c, status: novoStatus } : c
        )
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    // Recarregar dados da API
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar userType="admin" />
      
      <Container maxWidth="xl" sx={{ mt: 11, mb: 6 }}>
        {/* Cabeçalho */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
              <School sx={{ verticalAlign: 'middle', mr: 2 }} />
              Gerenciamento de Cursos
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Gerencie todos os cursos do sistema
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Atualizar
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate('/admin/curso/novo')}
            >
              Novo Curso
            </Button>
          </Box>
        </Box>
        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            alignItems: 'center'
          }}>
            <TextField
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: '1 1 300px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Todos"
                onClick={() => setFilterStatus('todos')}
                color={filterStatus === 'todos' ? 'primary' : 'default'}
                variant={filterStatus === 'todos' ? 'filled' : 'outlined'}
              />
              <Chip
                label="Ativos"
                onClick={() => setFilterStatus('ativo')}
                color={filterStatus === 'ativo' ? 'primary' : 'default'}
                variant={filterStatus === 'ativo' ? 'filled' : 'outlined'}
                icon={<CheckCircle />}
              />
              <Chip
                label="Inativos"
                onClick={() => setFilterStatus('inativo')}
                color={filterStatus === 'inativo' ? 'primary' : 'default'}
                variant={filterStatus === 'inativo' ? 'filled' : 'outlined'}
                icon={<Block />}
              />
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {filteredCursos.length} cursos encontrados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </Typography>
          </Box>
        </Paper>

        {/* Lista de Cursos */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredCursos.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum curso encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Tente outra busca' : 'Adicione seu primeiro curso'}
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell>Curso</TableCell>
                  <TableCell>Nível</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Alunos</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCursos.map((curso) => (
                  <TableRow key={curso.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: 1,
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <Box
                            component="img"
                            src={curso.fotoUrl}
                            alt={curso.nome}
                            sx={{ 
                              width: '100%', 
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {curso.nome}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {curso.descricao}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              icon={<AccessTime fontSize="small" />}
                              label={curso.duracaoHoras}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Chip
                          label={curso.nivel}
                          size="small"
                          sx={{ 
                            bgcolor: curso.nivel === 'Iniciante' ? '#e3f2fd' : 
                                    curso.nivel === 'Intermediário' ? '#f3e5f5' : '#ffebee',
                            color: curso.nivel === 'Iniciante' ? '#1976d2' : 
                                   curso.nivel === 'Intermediário' ? '#7b1fa2' : '#d32f2f'
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        R$ {curso.valor.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        à vista
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People fontSize="small" color="action" />
                        <Typography variant="body1" fontWeight="medium">
                          {curso.maxAlunos}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          alunos
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={curso.ativo === true ? 'Ativo' : 'Inativo'}
                        color={curso.ativo === true ? 'success' : 'default'}
                        size="small"
                        icon={curso.ativo ? <CheckCircle /> : <Block />}
                        onClick={() => handleToggleStatus(curso)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewCurso(curso.id)}
                          title="Visualizar"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleEditCurso(curso.id)}
                          title="Editar"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(curso)}
                          title="Excluir"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Botão voltar */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/dashboard')}
          >
            Voltar para Dashboard
          </Button>
        </Box>
      </Container>

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          {cursoToDelete && (
            <>
              <Typography variant="body1" gutterBottom>
                Tem certeza que deseja excluir o curso?
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {cursoToDelete.nome}
                </Typography>
                <Typography variant="caption">
                  Esta ação não pode ser desfeita. {cursoToDelete.maxAlunos} alunos estão matriculados neste curso.
                </Typography>
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CursosAdminPage;