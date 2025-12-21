/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Box,
  Container,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import {
  Search,
  ShoppingCart,
  AccessTime,
  Group,
  Sort,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import Navbar from './components/Navbar';

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
  conteudoProgramatico: string;
  certificadoDisponivel: string;
  destaques: string[];
  cor: string;
}

interface ITurma {
  id: number;
  cursoId: number;
  nome: string;
  dataInicio: string;
  dataFim: string;
  horario: string;
  professor: string;
  vagasTotal: number;
  vagasDisponiveis: number;
  status: string;
}

interface IUser {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

const CursosPage: React.FC = () => {
  const navigate = useNavigate();
  // Estados do navbar
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cartCount, setCartCount] = useState(0);
  
  // Estados da página
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [nivel, setNivel] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('relevancia');
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [turmasPorCurso, setTurmasPorCurso] = useState<{[key: number]: ITurma[]}>({});
  const [turmaSelecionada, setTurmaSelecionada] = useState<{[key: number]: number}>({});
  const [loadingTurmas, setLoadingTurmas] = useState<{[key: number]: boolean}>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // Verificar se o usuário está logado
   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userType = localStorage.getItem("userType") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    handleMenuClose();
    navigate('/login');
  };

  // Buscar contagem do carrinho
  const buscarContagemCarrinho = async () => {
    if (isLoggedIn) {
      try {
        const response = await api.get('/carrinho/itens');
        if (response.data.success) {
          setCartCount(response.data.dados.totalItens || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
      }
    }
  };

  // Funções da página de cursos
  const listarCursos = async () => {
    try {
      const response = await api.get<ICurso[]>("/cursos");
      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar cursos',
        severity: 'error'
      });
    }
  }

  const carregarTurmas = async (cursoId: number) => {
    try {
      setLoadingTurmas(prev => ({...prev, [cursoId]: true}));
      const response = await api.get(`/cursos/${cursoId}/turmas`);
      const turmasData = response.data.dados || [];
      const turmasAtivas = turmasData.filter((turma: any) => 
        turma.status === 'ABERTO'
      );
      
      setTurmasPorCurso(prev => ({
        ...prev,
        [cursoId]: turmasAtivas
      }));
      
      // Seleciona a primeira turma automaticamente
      if (turmasAtivas.length > 0 && !turmaSelecionada[cursoId]) {
        setTurmaSelecionada(prev => ({
          ...prev,
          [cursoId]: turmasAtivas[0].id
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      setTurmasPorCurso(prev => ({
        ...prev,
        [cursoId]: []
      }));
    } finally {
      setLoadingTurmas(prev => ({...prev, [cursoId]: false}));
    }
  }

  const handleVerCurso = (cursoId: number) => {
    navigate(`/curso/${cursoId}`);
  };

  const cursosFiltrados = cursos.filter(curso => {
    const titulo = curso.nome || '';
    const descricao = curso.descricao || '';
    const nivelCurso = curso.nivel || '';
    
    const matchesSearch = titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNivel = nivel === 'todos' || nivelCurso === nivel;
    
    return matchesSearch && matchesNivel;
  });

  const handleAddToCart = async (curso: ICurso) => {
    // Verifica se está logado
    if (!isLoggedIn) {
      setSnackbar({
        open: true,
        message: 'Você precisa estar logado para adicionar ao carrinho',
        severity: 'warning'
      });
      navigate('/login', { state: { from: '/cursos' } });
      return;
    }

    const turmaId = turmaSelecionada[curso.id];
    
    if (!turmaId) {
      setSnackbar({
        open: true,
        message: 'Por favor, selecione uma turma antes de adicionar ao carrinho',
        severity: 'warning'
      });
      return;
    }

    try {
      const response = await api.post('/carrinho/adicionar', {
        cursoId: curso.id,
        turmaId: turmaId,
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: response.data.mensagem,
          severity: 'success'
        });
        // Atualiza contagem do carrinho
        await buscarContagemCarrinho();
      } else {
        setSnackbar({
          open: true,
          message: response.data.mensagem,
          severity: 'warning'
        });
      }
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Sessão expirada. Faça login novamente.',
          severity: 'error'
        });
        handleLogout();
      } else {
        setSnackbar({
          open: true,
          message: error.response?.data?.mensagem || 'Erro ao adicionar curso ao carrinho',
          severity: 'error'
        });
      }
    }
  };

  const handleTurmaChange = (cursoId: number, turmaId: number) => {
    setTurmaSelecionada(prev => ({
      ...prev,
      [cursoId]: turmaId
    }));
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Carrega turmas quando o curso é renderizado
  useEffect(() => {
    cursos.forEach(curso => {
      if (!turmasPorCurso[curso.id]) {
        carregarTurmas(curso.id);
      }
    });
  }, [cursos]);

  useEffect(() => {
    listarCursos();
    if (isLoggedIn) {
      buscarContagemCarrinho();
    }
  }, [isLoggedIn]);

  return (
    <>
      <Navbar
        userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
        userName={isLoggedIn ? userName : undefined}
        userEmail={isLoggedIn ? userEmail : undefined}
      />
      {/* Espaço para a navbar fixa */}
      <Toolbar />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
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
              Nossos Cursos
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Escolha o curso perfeito para sua carreira
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isLoggedIn && (
              <Button
                variant="outlined"
                startIcon={<ShoppingCart />}
                onClick={() => navigate('/carrinho')}
              >
                Ver Carrinho
                {cartCount > 0 && (
                  <Box
                    sx={{
                      ml: 1,
                      backgroundColor: 'error.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {cartCount}
                  </Box>
                )}
              </Button>
            )}
          </Box>
        </Box>

        {/* Filtros e Busca */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
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
            
            <FormControl sx={{ flex: '1 1 200px' }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={categoria}
                label="Categoria"
                onChange={(e) => setCategoria(e.target.value)}
              >
                <MenuItem value="todos">Todas categorias</MenuItem>
                <MenuItem value="Mecânica Básica">Mecânica Básica</MenuItem>
                <MenuItem value="Freios">Freios</MenuItem>
                <MenuItem value="Suspensão">Suspensão</MenuItem>
                <MenuItem value="Transmissão">Transmissão</MenuItem>
                <MenuItem value="Elétrica">Elétrica</MenuItem>
                <MenuItem value="Gestão">Gestão</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ flex: '1 1 200px' }}>
              <InputLabel>Nível</InputLabel>
              <Select
                value={nivel}
                label="Nível"
                onChange={(e) => setNivel(e.target.value)}
              >
                <MenuItem value="todos">Todos os níveis</MenuItem>
                <MenuItem value="Iniciante">Iniciante</MenuItem>
                <MenuItem value="Intermediário">Intermediário</MenuItem>
                <MenuItem value="Avançado">Avançado</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ flex: '1 1 200px' }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={ordenacao}
                label="Ordenar por"
                onChange={(e) => setOrdenacao(e.target.value)}
                startAdornment={<Sort sx={{ mr: 1 }} />}
              >
                <MenuItem value="relevancia">Mais relevantes</MenuItem>
                <MenuItem value="preco-crescente">Menor preço</MenuItem>
                <MenuItem value="preco-decrescente">Maior preço</MenuItem>
                <MenuItem value="duracao">Menor duração</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Resultados */}
        <Typography variant="h6" sx={{ mb: 3 }}>
          {cursosFiltrados.length} cursos encontrados
        </Typography>

        {/* Lista de Cursos */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {cursosFiltrados.map((curso) => {
            const turmasDisponiveis = turmasPorCurso[curso.id] || [];
            const temTurmas = turmasDisponiveis.length > 0;
            
            return (
              <Box 
                key={curso.id} 
                sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: 'calc(33.333% - 16px)' },
                  minWidth: { xs: '100%', sm: '300px' }
                }}
              >
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  {/* Imagem do curso */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={curso.fotoUrl}
                    alt={curso.nome}
                    sx={{ 
                      objectFit: 'cover',
                      borderBottom: `4px solid ${curso.cor}`
                    }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Categoria e nível */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
                    </Box>
                    
                    {/* Título e descrição */}
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {curso.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {curso.descricao}
                    </Typography>
                    
                    {/* Destaques */}
                    <Box sx={{ mb: 3 }}>
                      {(curso.destaques || []).slice(0, 2).map((destaque, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            mb: 0.5
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {destaque}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    {/* Seletor de Turma */}
                    <Box sx={{ mb: 3 }}>
                      {loadingTurmas[curso.id] ? (
                        <Typography variant="body2" color="text.secondary">
                          Carregando turmas...
                        </Typography>
                      ) : temTurmas ? (
                        <FormControl fullWidth size="small">
                          <InputLabel id={`turma-label-${curso.id}`}>Selecione a turma</InputLabel>
                          <Select
                            labelId={`turma-label-${curso.id}`}
                            value={turmaSelecionada[curso.id] || ''}
                            label="Selecione a turma"
                            onChange={(e) => handleTurmaChange(curso.id, Number(e.target.value))}
                          >
                            {turmasDisponiveis.map((turma) => (
                              <MenuItem key={turma.id} value={turma.id}>
                                <Box>
                                  <Typography variant="body2">
                                    {formatarData(turma.dataInicio)} - {turma.horario}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {turma.vagasDisponiveis} vaga(s) - Prof. {turma.professor}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Typography variant="body2" color="error">
                          Nenhuma turma disponível no momento
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Detalhes */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2">{curso.duracaoHoras}h</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Group fontSize="small" color="action" />
                          <Typography variant="body2">{curso.maxAlunos} alunos</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          R$ {curso.valor.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          à vista
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  {/* Ações */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    p: 2, 
                    pt: 0,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleAddToCart(curso)}
                      startIcon={<ShoppingCart />}
                      sx={{ 
                        bgcolor: curso.cor,
                        '&:hover': { bgcolor: curso.cor, opacity: 0.9 }
                      }}
                      disabled={!temTurmas || !turmaSelecionada[curso.id] || !isLoggedIn}
                    >
                      {!isLoggedIn ? 'Login para comprar' : !temTurmas ? 'Sem turmas' : 'Adicionar'}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleVerCurso(curso.id)}
                      endIcon={<KeyboardArrowRight />}
                    >
                      Detalhes
                    </Button>
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>

        {/* Mensagem se não houver cursos */}
        {cursosFiltrados.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum curso encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tente alterar os filtros ou buscar por outro termo
            </Typography>
          </Paper>
        )}
        
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={() => setSnackbar({...snackbar, open: false})}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({...snackbar, open: false})} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default CursosPage;