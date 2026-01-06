/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  CardHeader,
  CardActions,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  School,
  MenuBook,
  CardMembership,
  Visibility,
  Edit,
  CheckCircle,
  AccessTime,
  MonetizationOn,
  VideoLibrary,
  PictureAsPdf,
  LocationOn,
  Email,
  Phone,
  CalendarToday,
  Fingerprint,
  Home,
  Map,
  Public,
  Place,
  CheckCircleOutline,
  ErrorOutline,
  Warning,
  VerifiedUser,
  AccountCircle,
  Add,
  Delete,
  InsertDriveFile,
  Image,
  Link,
  Article,
  AudioFile,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../../config/api';

interface IEndereco {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipo: 'principal' | 'secundario' | string;
  ativo: boolean;
  dataCadastro: string;
  dataAtualizacao?: string;
}

interface IUsuario {
  id: number;
  email: string;
  tipo: number; // 0 = aluno, 1 = admin
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  ativo: boolean;
  dataCadastro: string;
  ultimoLogin: string;
  enderecos: IEndereco[];
}

interface ICurso {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  duracaoHoras: number | string;
  nivel?: string;
  maxAlunos?: number;
  conteudoProgramatico?: string;
  certificadoDisponivel?: string;
  destaques?: string[];
  cor?: string;
}

interface IMatricula {
  id: number;
  alunoId: number;
  cursoId: number;
  curso: ICurso;
  dataMatricula: string;
  progresso: number;
  status: string;
  turma: {
    id: number;
    cursoId: number;
    dataInicio: string;
    dataFim: string;
    vagasTotal: number;
  };
}

interface IConteudoComplementar {
  id: number;
  titulo: string;
  curso_id: number;
  descricao: string;
  tipo: string;
  url: string;
  dataCriacao: string;
  cursoNome?: string;
}

const AlunoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);
  const [dadosUsuario, setDadosUsuario] = useState<IUsuario | null>(null);
  const [matriculas, setMatriculas] = useState<IMatricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conteudosCursoSelecionado, setConteudosCursoSelecionado] = useState<IConteudoComplementar[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<string>('');
  
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userType = localStorage.getItem("userType") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const listarDadosUsuario = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<IUsuario>(`/Usuarios/${id}`);
      setDadosUsuario(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      setError(error.response?.data?.message || 'Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const listarCursos = async (idAluno: number) => {
    try {
      console.log('Buscando cursos para aluno:', idAluno);
      const response = await api.get(`/cursos/buscarCursosAlunos`, {
        params: {
          idAluno: idAluno
        }
      });
      
      console.log('Resposta da API - cursos:', response.data);
      
      if (Array.isArray(response.data)) {
        setMatriculas(response.data);
        console.log('Cursos carregados:', response.data.length);
      } else {
        console.warn('Estrutura de resposta inesperada:', response.data);
        setMatriculas([]);
      }
      
    } catch (error: any) {
      console.error('Erro ao buscar cursos:', error);
      setError(error.response?.data?.message || 'Erro ao carregar cursos');
    }
  };

  const listarConteudosComplementaresPorCurso = async (cursoId: number, cursoNome: string): Promise<IConteudoComplementar[]> => {
  try {
    console.log(`Buscando conteúdos complementares para curso ${cursoId} (${cursoNome})...`);
    const response = await api.get(`/ConteudosComplementares/curso/${cursoId}`);
    
    console.log(`Resposta de conteúdos para curso ${cursoId}:`, response.data);
    
    // A API retorna { success: true, data: [...] }
    if (response.data && response.data.success === true && Array.isArray(response.data.data)) {
      // Adicionar nome do curso a cada conteúdo
      const conteudosComCurso = response.data.data.map((conteudo: any) => ({
        id: conteudo.id,
        titulo: conteudo.titulo,
        curso_id: cursoId,
        descricao: conteudo.descricao || '',
        tipo: conteudo.tipo || 'arquivo',
        url: conteudo.url || '#',
        dataCriacao: conteudo.dataCriacao || new Date().toISOString(),
        cursoNome: cursoNome
      }));
      console.log(`Conteúdos encontrados para curso ${cursoId}:`, conteudosComCurso.length);
      return conteudosComCurso;
    } else {
      console.log(`Nenhum conteúdo encontrado para curso ${cursoId} ou estrutura inválida:`, response.data);
      return [];
    }
  } catch (error: any) {
    console.error(`Erro ao buscar conteúdos do curso ${cursoId}:`, error);
    // Se a API retornar 404 ou outro erro, retornar array vazio
    return [];
  }
};

  const abrirDialogConteudos = async (cursoId: number, cursoNome: string) => {
    try {
      setLoading(true);
      setCursoSelecionado(cursoNome);
      
      const conteudos = await listarConteudosComplementaresPorCurso(cursoId, cursoNome);
      setConteudosCursoSelecionado(conteudos);
      setDialogOpen(true);
    } catch (error) {
      console.error('Erro ao abrir diálogo de conteúdos:', error);
      setError('Erro ao carregar conteúdos complementares');
    } finally {
      setLoading(false);
    }
  };

  const fecharDialogConteudos = () => {
    setDialogOpen(false);
    setConteudosCursoSelecionado([]);
    setCursoSelecionado('');
  };

  const getIconPorTipo = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    
    if (tipoLower.includes('pdf') || tipoLower.includes('documento')) {
      return <PictureAsPdf />;
    } else if (tipoLower.includes('video') || tipoLower.includes('vídeo')) {
      return <VideoLibrary />;
    } else if (tipoLower.includes('audio') || tipoLower.includes('áudio')) {
      return <AudioFile />;
    } else if (tipoLower.includes('imagem') || tipoLower.includes('image')) {
      return <Image />;
    } else if (tipoLower.includes('link') || tipoLower.includes('url')) {
      return <Link />;
    } else if (tipoLower.includes('artigo') || tipoLower.includes('article')) {
      return <Article />;
    } else {
      return <InsertDriveFile />;
    }
  };

  const getCorPorTipo = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    
    if (tipoLower.includes('pdf') || tipoLower.includes('documento')) {
      return "#F44336"; // Vermelho
    } else if (tipoLower.includes('video') || tipoLower.includes('vídeo')) {
      return "#FF5722"; // Laranja
    } else if (tipoLower.includes('audio') || tipoLower.includes('áudio')) {
      return "#9C27B0"; // Roxo
    } else if (tipoLower.includes('imagem') || tipoLower.includes('image')) {
      return "#4CAF50"; // Verde
    } else if (tipoLower.includes('link') || tipoLower.includes('url')) {
      return "#2196F3"; // Azul
    } else if (tipoLower.includes('artigo') || tipoLower.includes('article')) {
      return "#FF9800"; // Âmbar
    } else {
      return "#607D8B"; // Azul cinza
    }
  };

  useEffect(() => {
    const usuarioString = localStorage.getItem("user");
    
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        const idUsuario = usuario.id;
        
        if (idUsuario) {
          console.log('ID do usuário para buscar cursos:', idUsuario);
          listarDadosUsuario(idUsuario);
          listarCursos(idUsuario);
        } else {
          setError("ID do usuário não encontrado");
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
        setError("Erro ao ler dados do usuário");
        setLoading(false);
      }
    } else {
      setError("Usuário não encontrado no localStorage");
      setLoading(false);
    }
  }, []);

  // Funções auxiliares
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarDataSimples = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarTelefone = (telefone: string) => {
    const cleaned = telefone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    return telefone;
  };

  const calcularIdade = (dataNascimento: string) => {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const getStatusUsuario = (usuario: IUsuario) => {
    if (!usuario.ativo) return { texto: 'Inativo', cor: 'error', icone: <ErrorOutline /> };
    const ultimoLogin = new Date(usuario.ultimoLogin);
    const hoje = new Date();
    const diasDesdeUltimoLogin = Math.floor((hoje.getTime() - ultimoLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasDesdeUltimoLogin === 0) return { texto: 'Online hoje', cor: 'success', icone: <CheckCircleOutline /> };
    if (diasDesdeUltimoLogin <= 7) return { texto: 'Ativo recentemente', cor: 'success', icone: <CheckCircleOutline /> };
    if (diasDesdeUltimoLogin <= 30) return { texto: 'Ativo', cor: 'warning', icone: <Warning /> };
    return { texto: 'Inativo há muito tempo', cor: 'error', icone: <ErrorOutline /> };
  };

  const getStatusMatricula = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo': return { cor: 'success', texto: 'Ativo' };
      case 'concluído': return { cor: 'success', texto: 'Concluído' };
      case 'pendente': return { cor: 'warning', texto: 'Pendente' };
      case 'cancelado': return { cor: 'error', texto: 'Cancelado' };
      default: return { cor: 'info', texto: status };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <>
        <Navbar
          userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
          userName={isLoggedIn ? userName : undefined}
          userEmail={isLoggedIn ? userEmail : undefined}
        />
        <Box sx={{ mt: 10, p: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar
          userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
          userName={isLoggedIn ? userName : undefined}
          userEmail={isLoggedIn ? userEmail : undefined}
        />
        <Box sx={{ mt: 10, p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </Box>
      </>
    );
  }

  if (!dadosUsuario) {
    return (
      <>
        <Navbar
          userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
          userName={isLoggedIn ? userName : undefined}
          userEmail={isLoggedIn ? userEmail : undefined}
        />
        <Box sx={{ mt: 10, p: 3 }}>
          <Alert severity="info">
            Nenhum dado de usuário disponível
          </Alert>
        </Box>
      </>
    );
  }

  const statusUsuario = getStatusUsuario(dadosUsuario);
  const idade = dadosUsuario.dataNascimento ? calcularIdade(dadosUsuario.dataNascimento) : null;

  return (
    <>
      <Navbar
        userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
        userName={isLoggedIn ? dadosUsuario.nomeCompleto : undefined}
        userEmail={isLoggedIn ? dadosUsuario.email : undefined}
      />
      
      <Box sx={{ mt: 10, mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Container principal */}
        <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
          
          {/* Cabeçalho */}
          <Paper sx={{ 
            p: 3, 
            mb: 4,
            background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
            color: 'white',
            borderRadius: 2
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 3
            }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Avatar sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: statusUsuario.cor === 'success' ? '#4caf50' : 
                                 statusUsuario.cor === 'warning' ? '#ff9800' : '#f44336',
                        border: '2px solid white'
                      }}>
                        {statusUsuario.icone}
                      </Avatar>
                    }
                  >
                    <Avatar sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontSize: 40,
                      boxShadow: 3
                    }}>
                      <AccountCircle fontSize="inherit" />
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {dadosUsuario.nomeCompleto}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                      <Chip 
                        label={dadosUsuario.tipo === 0 ? 'ALUNO' : 'ADMIN'}
                        color={dadosUsuario.tipo === 0 ? 'primary' : 'secondary'}
                        sx={{ 
                          bgcolor: 'white',
                          color: 'primary.main',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip 
                        label={statusUsuario.texto}
                        color={statusUsuario.cor as any}
                        variant="outlined"
                        sx={{ 
                          borderColor: 'white',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
                  <Email sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {dadosUsuario.email}
                </Typography>
                
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Membro desde: {formatarDataSimples(dadosUsuario.dataCadastro)}
                  {dadosUsuario.ultimoLogin && (
                    <> • Último login: {formatarData(dadosUsuario.ultimoLogin)}</>
                  )}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                justifyContent: { xs: 'flex-start', md: 'flex-end' }
              }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => navigate('/aluno/perfil')}
                  sx={{ 
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  Editar Perfil
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<Person />}
                  onClick={handleLogout}
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { 
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)' 
                    }
                  }}
                >
                  Sair
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Abas principais */}
          <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': { 
                  minHeight: 64,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }
              }}
            >
              <Tab icon={<Person sx={{ fontSize: { xs: 20, sm: 24 } }} />} label="Dados Cadastrais" />
              <Tab icon={<LocationOn sx={{ fontSize: { xs: 20, sm: 24 } }} />} label="Endereços" />
              <Tab icon={<School sx={{ fontSize: { xs: 20, sm: 24 } }} />} label="Meus Cursos" />
              <Tab icon={<MenuBook sx={{ fontSize: { xs: 20, sm: 24 } }} />} label="Conteúdos" />
              <Tab icon={<CardMembership sx={{ fontSize: { xs: 20, sm: 24 } }} />} label="Certificados" />
            </Tabs>
          </Paper>

          {/* Conteúdo das abas */}
          <Box>
            {/* Tab 1: Dados Cadastrais */}
            {tabValue === 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Informações Pessoais */}
                <Card sx={{ 
                  flex: '1 1 300px',
                  minWidth: 300,
                  maxWidth: 'calc(50% - 12px)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardHeader
                    title={
                      <Typography variant="h6" fontWeight="bold">
                        <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Informações Pessoais
                      </Typography>
                    }
                    action={
                      <IconButton color="primary" onClick={() => navigate('/aluno/perfil')}>
                        <Edit />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <Person sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                          Nome Completo
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                          {dadosUsuario.nomeCompleto}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <Email sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                          E-mail
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                          {dadosUsuario.email}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <Phone sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                          Telefone
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                          {formatarTelefone(dadosUsuario.telefone)}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <Fingerprint sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                          CPF
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                          {formatarCPF(dadosUsuario.cpf)}
                        </Typography>
                      </Box>
                      
                      {dadosUsuario.dataNascimento && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            <CalendarToday sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                            Data de Nascimento
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                            {formatarDataSimples(dadosUsuario.dataNascimento)}
                            {idade && ` (${idade} anos)`}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Informações da Conta */}
                <Card sx={{ 
                  flex: '1 1 300px',
                  minWidth: 300,
                  maxWidth: 'calc(50% - 12px)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardHeader
                    title={
                      <Typography variant="h6" fontWeight="bold">
                        <VerifiedUser sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Informações da Conta
                      </Typography>
                    }
                  />
                  <Divider />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          ID do Usuário
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                          #{dadosUsuario.id.toString().padStart(6, '0')}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Tipo de Conta
                        </Typography>
                        <Typography component="div" variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                          {dadosUsuario.tipo === 0 ? (
                            <Chip label="Aluno" color="primary" size="small" />
                          ) : (
                            <Chip label="Administrador" color="secondary" size="small" />
                          )}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Data de Cadastro
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                          {formatarData(dadosUsuario.dataCadastro)}
                        </Typography>
                      </Box>
                      
                      {dadosUsuario.ultimoLogin && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Último Acesso
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                            {formatarData(dadosUsuario.ultimoLogin)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      color="primary"
                      onClick={() => navigate('/aluno/perfil')}
                    >
                      Atualizar Dados
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            )}

            {/* Tab 2: Endereços */}
            {tabValue === 1 && (
              <Box>
                {dadosUsuario.enderecos.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <LocationOn sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Nenhum endereço cadastrado
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Adicione seu endereço para receber certificados físicos e materiais.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/aluno/perfil')}
                    >
                      Adicionar Endereço
                    </Button>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {dadosUsuario.enderecos
                      .filter(endereco => endereco.ativo)
                      .map((endereco) => (
                        <Card key={endereco.id} sx={{ 
                          flex: '1 1 300px',
                          minWidth: 300,
                          maxWidth: 'calc(50% - 12px)',
                          display: 'flex',
                          flexDirection: 'column',
                          borderLeft: '4px solid',
                          borderLeftColor: endereco.tipo === 'principal' ? 'primary.main' : 'grey.400'
                        }}>
                          <CardHeader
                            title={
                              <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">
                                  <Home sx={{ verticalAlign: 'middle', mr: 1 }} />
                                  {endereco.tipo === 'principal' ? 'Endereço Principal' : 'Endereço Secundário'}
                                </Typography>
                                {endereco.tipo === 'principal' && (
                                  <Chip 
                                    label="PRINCIPAL" 
                                    color="primary" 
                                    size="small"
                                  />
                                )}
                              </Box>
                            }
                            subheader={`Cadastrado em: ${formatarDataSimples(endereco.dataCadastro)}`}
                          />
                          <Divider />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  <Place sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                                  Logradouro
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {endereco.logradouro}, {endereco.numero}
                                  {endereco.complemento && ` - ${endereco.complemento}`}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  <Map sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                                  Bairro
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {endereco.bairro}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  <Public sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                                  Cidade/Estado
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {endereco.cidade} - {endereco.estado}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  CEP
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {endereco.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Status
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {endereco.ativo ? (
                                    <Chip 
                                      label="Ativo" 
                                      color="success" 
                                      size="small"
                                      icon={<CheckCircleOutline />}
                                    />
                                  ) : (
                                    <Chip 
                                      label="Inativo" 
                                      color="error" 
                                      size="small"
                                      icon={<ErrorOutline />}
                                    />
                                  )}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              startIcon={<Edit />}
                              onClick={() => navigate('/aluno/perfil')}
                            >
                              Editar
                            </Button>
                            {endereco.tipo !== 'principal' && (
                              <Button 
                                size="small" 
                                color="error"
                                startIcon={<Delete />}
                              >
                                Remover
                              </Button>
                            )}
                          </CardActions>
                        </Card>
                      ))}
                  </Box>
                )}
                
                {/* Resumo dos endereços */}
                <Paper sx={{ 
                  p: 3, 
                  mt: 3,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Resumo de Endereços
                      </Typography>
                      <Typography variant="body2">
                        Total de endereços: {dadosUsuario.enderecos.filter(e => e.ativo).length}
                        {' • '}
                        Endereços principais: {dadosUsuario.enderecos.filter(e => e.tipo === 'principal' && e.ativo).length}
                        {' • '}
                        Endereços ativos: {dadosUsuario.enderecos.filter(e => e.ativo).length}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      sx={{ 
                        bgcolor: 'white',
                        color: 'primary.main',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                      onClick={() => navigate('/aluno/perfil')}
                    >
                      Novo Endereço
                    </Button>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* Tab 3: Cursos Comprados */}
            {tabValue === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {matriculas.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Nenhum curso matriculado
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Você ainda não possui cursos. Explore nosso catálogo para encontrar cursos interessantes!
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/cursos')}
                    >
                      Explorar Cursos
                    </Button>
                  </Paper>
                ) : (
                  matriculas.map((matricula) => {
                    const curso = matricula.curso;
                    const statusMatricula = getStatusMatricula(matricula.status);
                    
                    return (
                      <Paper key={matricula.id} sx={{ p: 3 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: 3
                        }}>
                          <Box sx={{ flexShrink: 0 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: curso.cor || 'primary.main', 
                                width: 80, 
                                height: 80, 
                                fontSize: 32,
                                boxShadow: 2
                              }}
                            >
                              <School />
                            </Avatar>
                          </Box>
                          
                          <Box sx={{ flex: '1 1 300px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                {curso.nome}
                              </Typography>
                              <Chip 
                                label={statusMatricula.texto}
                                color={statusMatricula.cor as any}
                                size="small"
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {curso.descricao}
                            </Typography>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: 2, 
                              mb: 2,
                              alignItems: 'center'
                            }}>
                              {curso.nivel && (
                                <Chip 
                                  label={curso.nivel}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {curso.duracaoHoras || "N/A"}h
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <MonetizationOn fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  R$ {curso.valor ? curso.valor.toFixed(2).replace('.', ',') : "0,00"}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarToday fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  Matriculado em: {formatarDataSimples(matricula.dataMatricula)}
                                </Typography>
                              </Box>
                            </Box>
                            
                            {curso.destaques && curso.destaques.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                  Destaques:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {curso.destaques.map((destaque, index) => (
                                    <Chip 
                                      key={index}
                                      label={destaque}
                                      size="small"
                                      variant="filled"
                                      sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })
                )}
              </Box>
            )}

            {/* Tab 4: Conteúdos Complementares (geral) */}
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  <MenuBook sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Conteúdos Complementares
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  Clique em "Conteúdos Complementares" em qualquer curso para visualizar os materiais disponíveis.
                </Typography>
                
                {matriculas.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <MenuBook sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Nenhum curso matriculado
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Matricule-se em um curso para ter acesso aos conteúdos complementares.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/cursos')}
                    >
                      Explorar Cursos
                    </Button>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {matriculas.map((matricula) => (
                      <Paper key={matricula.id} sx={{ p: 3 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 2
                        }}>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {matricula.curso.nome}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {matricula.curso.descricao}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<MenuBook />}
                            onClick={() => abrirDialogConteudos(matricula.curso.id, matricula.curso.nome)}
                          >
                            Ver Conteúdos
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* Tab 5: Certificados */}
            {tabValue === 4 && (
              <Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                  {matriculas
                    .filter(matricula => matricula.status.toLowerCase() === 'concluído' || matricula.progresso === 100)
                    .map((matricula) => (
                      <Paper key={matricula.id} sx={{ 
                        flex: '1 1 300px',
                        minWidth: 300,
                        maxWidth: 'calc(50% - 12px)',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        borderLeft: '4px solid',
                        borderLeftColor: 'success.main'
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2
                        }}>
                          <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                              <CardMembership sx={{ verticalAlign: 'middle', mr: 1 }} />
                              {matricula.curso.nome}
                            </Typography>
                            
                            <Stack spacing={0.5}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Código:</strong> CERT-{matricula.id.toString().padStart(6, '0')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Emitido em:</strong> {formatarDataSimples(new Date().toISOString())}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Carga horária:</strong> {matricula.curso.duracaoHoras || "N/A"} horas
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Progresso:</strong> {matricula.progresso}%
                              </Typography>
                            </Stack>
                          </Box>
                          
                          <Chip 
                            label="Concluído"
                            color="success"
                            size="small"
                            icon={<CheckCircle />}
                          />
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          justifyContent: 'flex-end',
                          mt: 'auto'
                        }}>
                          <Tooltip title="Visualizar Certificado">
                            <IconButton color="primary">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Compartilhar">
                            <IconButton color="primary">
                              <CardMembership />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>
                    ))}
                </Box>
                
                {matriculas.filter(m => m.status.toLowerCase() === 'concluído' || m.progresso === 100).length === 0 && (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <CardMembership sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Nenhum certificado disponível
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Complete seus cursos para obter certificados. Certificados serão emitidos automaticamente ao concluir um curso.
                    </Typography>
                  </Paper>
                )}
                
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'info.light', 
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'info.main'
                }}>
                  <Typography variant="body1" gutterBottom sx={{ color: 'info.contrastText' }}>
                    <strong>Total de certificados:</strong> {matriculas.filter(m => m.status.toLowerCase() === 'concluído' || m.progresso === 100).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'info.contrastText', opacity: 0.9 }}>
                    Você pode compartilhar seus certificados nas redes sociais ou incluí-los em seu currículo
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Diálogo para Conteúdos Complementares */}
      <Dialog
        open={dialogOpen}
        onClose={fecharDialogConteudos}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              <MenuBook sx={{ verticalAlign: 'middle', mr: 1 }} />
              Conteúdos Complementares - {cursoSelecionado}
            </Typography>
            <IconButton onClick={fecharDialogConteudos} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Box>
          ) : conteudosCursoSelecionado.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <MenuBook sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nenhum conteúdo complementar disponível
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Este curso ainda não possui conteúdos complementares.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, pt: 2 }}>
              {conteudosCursoSelecionado.map((conteudo) => {
                const cor = getCorPorTipo(conteudo.tipo);
                const icon = getIconPorTipo(conteudo.tipo);
                
                return (
                  <Card key={conteudo.id} sx={{ 
                    flex: '1 1 250px',
                    minWidth: 250,
                    maxWidth: 'calc(33.333% - 16px)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ 
                        height: 100, 
                        bgcolor: cor + '20', 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        border: `2px solid ${cor}40`
                      }}>
                        <Box sx={{ 
                          color: cor,
                          fontSize: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {icon}
                        </Box>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: 64,
                        fontSize: '1rem'
                      }}>
                        {conteudo.titulo}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        minHeight: 60
                      }}>
                        {conteudo.descricao || "Sem descrição disponível."}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Chip 
                          label={conteudo.tipo}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: cor,
                            color: cor
                          }}
                        />
                        
                        {conteudo.dataCriacao && (
                          <Typography variant="caption" color="text.secondary">
                            {formatarDataSimples(conteudo.dataCriacao)}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        fullWidth
                        onClick={() => window.open(conteudo.url, '_blank')}
                      >
                        Visualizar
                      </Button>
                    </CardActions>
                  </Card>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialogConteudos} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlunoDashboard;