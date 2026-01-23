/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
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
  Pagination,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  Visibility,
  Add,
  Person,
  Email,
  Phone,
  CalendarToday,
  CheckCircle,
  Block,
  Refresh,
  School,
  LocationOn,
  AdminPanelSettings,
  PersonOutline,
  Warning,
  Home,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../../config/api";
import { Snackbar } from "@mui/material";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface EnderecoResponse {
  id: number;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  isPrincipal: boolean;
}

interface IUsuario {
  id: number;
  email: string;
  tipo: number; // 1=Admin, 2=Professor, 3=Aluno
  nomeCompleto: string;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
  ativo: boolean;
  dataCadastro: string;
  ultimoLogin?: string;
  enderecos: EnderecoResponse[];
  fotoUrl?: string;
  matricula?: string;
  cursosMatriculados?: number;
  cursosConcluidos?: number;
}

interface ICursoMatriculado {
  id: number;
  nome: string;
  dataMatricula: string;
  status: "matriculado" | "concluído" | "cancelado";
  progresso: number;
}

const AlunosAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<IUsuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const [filterStatus, setFilterStatus] = useState<"todos" | "ativo" | "inativo">("todos");
  const [filterTipo, setFilterTipo] = useState<"todos" | 1 | 2 | 3>(3);
  const [filterOrder, setFilterOrder] = useState<"nome" | "dataCadastro" | "tipo">("nome");
  
  const [usuarioDetalhes, setUsuarioDetalhes] = useState<IUsuario | null>(null);
  const [cursosMatriculados, setCursosMatriculados] = useState<ICursoMatriculado[]>([]);
  const [detalhesOpen, setDetalhesOpen] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [usuariosPorPagina] = useState(10);

  const buscarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get<IUsuario[]>("/usuarios");
      setUsuarios(response.data);
      setFilteredUsuarios(response.data.filter(u => u.tipo === 3));
      setPaginaAtual(1);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar usuários",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarCursosMatriculados = async (usuarioId: number) => {
    try {
      const response = await api.get<ICursoMatriculado[]>(`/usuarios/${usuarioId}/cursos`);
      setCursosMatriculados(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  useEffect(() => {
    let resultado = [...usuarios];

    if (filterTipo !== "todos") {
      resultado = resultado.filter((usuario) => usuario.tipo === filterTipo);
    }

    if (searchTerm) {
      resultado = resultado.filter(
        (usuario) =>
          usuario.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (usuario.cpf && usuario.cpf.includes(searchTerm)) ||
          (usuario.matricula && usuario.matricula.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== "todos") {
      resultado = resultado.filter((usuario) => 
        filterStatus === "ativo" ? usuario.ativo : !usuario.ativo
      );
    }

    resultado.sort((a, b) => {
      switch (filterOrder) {
        case "nome":
          return a.nomeCompleto.localeCompare(b.nomeCompleto);
        case "dataCadastro":
          return new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime();
        case "tipo":
          return a.tipo - b.tipo;
        default:
          return 0;
      }
    });

    setFilteredUsuarios(resultado);
    setPaginaAtual(1);
  }, [searchTerm, filterStatus, filterTipo, filterOrder, usuarios]);

  const indiceUltimoUsuario = paginaAtual * usuariosPorPagina;
  const indicePrimeiroUsuario = indiceUltimoUsuario - usuariosPorPagina;
  const usuariosPaginaAtual = filteredUsuarios.slice(indicePrimeiroUsuario, indiceUltimoUsuario);
  const totalPaginas = Math.ceil(filteredUsuarios.length / usuariosPorPagina);

  const handleMudarPagina = (_event: React.ChangeEvent<unknown>, valor: number) => {
    setPaginaAtual(valor);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleViewUsuario = (usuario: IUsuario) => {
    setUsuarioDetalhes(usuario);
    if (usuario.tipo === 3) {
      buscarCursosMatriculados(usuario.id);
    }
    setDetalhesOpen(true);
  };

  const handleEditUsuario = (usuario: IUsuario) => {
    navigate(`/admin/usuarios/editar/${usuario.id}`);
  };

  const handleDeleteClick = async (usuario: IUsuario) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a excluir o usuário "${usuario.nomeCompleto}". Esta ação não pode ser desfeita!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#757575",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/usuarios/${usuario.id}`);
        await Swal.fire({
          title: "Excluído!",
          text: `O usuário "${usuario.nomeCompleto}" foi excluído com sucesso.`,
          icon: "success",
          confirmButtonColor: "#1976d2",
          timer: 2000,
        });

        buscarUsuarios();
      } catch (error: any) {
        console.error("Erro ao excluir usuário:", error);
        
        let errorMessage = "Erro ao excluir usuário";
        if (error.response?.status === 400) {
          errorMessage = "Não é possível excluir este usuário pois há registros associados";
        } else if (error.response?.status === 403) {
          errorMessage = "Você não tem permissão para excluir este usuário";
        }
        
        await Swal.fire({
          title: "Erro!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#d32f2f",
        });
      }
    }
  };

  const handleToggleStatus = async (usuario: IUsuario) => {
    const novoStatus = !usuario.ativo;
    const acao = novoStatus ? "ativar" : "inativar";

    const result = await Swal.fire({
      title: `Confirmar ${acao}?`,
      text: `Você está prestes a ${acao} o usuário "${usuario.nomeCompleto}".`,
      icon: novoStatus ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: novoStatus ? "#2e7d32" : "#ed6c02",
      cancelButtonColor: "#757575",
      confirmButtonText: `Sim, ${acao}!`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/usuarios/${usuario.id}/status`, { ativo: novoStatus });
        
        setUsuarios(
          usuarios.map((u) =>
            u.id === usuario.id ? { ...u, ativo: novoStatus } : u
          )
        );

        setSnackbar({
          open: true,
          message: `Usuário ${acao}do com sucesso`,
          severity: "success",
        });
      } catch (error) {
        console.error("Erro ao alterar status:", error);
        setSnackbar({
          open: true,
          message: "Erro ao alterar status do usuário",
          severity: "error",
        });
      }
    }
  };

  const handleRefresh = () => {
    buscarUsuarios();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Não informado";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return "N/A";
    const today = dayjs();
    const birth = dayjs(birthDate);
    return today.diff(birth, 'year');
  };

  const getTipoInfo = (tipo: number) => {
    switch (tipo) {
      case 1:
        return {
          label: "Administrador",
          icon: <AdminPanelSettings fontSize="small" />,
          color: "error" as "error" | "warning" | "primary" | "success" | "info",
          bgColor: "#ffebee",
          textColor: "#d32f2f"
        };
      case 2:
        return {
          label: "Professor",
          icon: <Person fontSize="small" />,
          color: "warning" as const,
          bgColor: "#fff3e0",
          textColor: "#f57c00"
        };
      case 3:
        return {
          label: "Aluno",
          icon: <PersonOutline fontSize="small" />,
          color: "primary" as const,
          bgColor: "#e3f2fd",
          textColor: "#1976d2"
        };
      default:
        return {
          label: "Desconhecido",
          icon: <Warning fontSize="small" />,
          color: "default" as const,
          bgColor: "#f5f5f5",
          textColor: "#757575"
        };
    }
  };

  const getEnderecoPrincipal = (enderecos: EnderecoResponse[]) => {
    return enderecos.find(endereco => endereco.isPrincipal) || enderecos[0];
  };

  const totalAlunos = usuarios.filter(u => u.tipo === 3).length;
  const totalProfessores = usuarios.filter(u => u.tipo === 2).length;
  const totalAdmins = usuarios.filter(u => u.tipo === 1).length;
  const usuariosAtivos = usuarios.filter(u => u.ativo).length;
  const novosHoje = usuarios.filter(u => 
    dayjs(u.dataCadastro).isSame(dayjs(), 'day')
  ).length;

  return (
    <>
      <Navbar userType="admin" />

      <Container maxWidth="xl" sx={{ mt: 11, mb: 6 }}>
        {/* Cabeçalho */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              <Person sx={{ verticalAlign: "middle", mr: 2 }} />
              Gerenciamento de Usuários
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Gerencie todos os usuários do sistema
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
              onClick={() => navigate("/admin/usuarios/novo")}
            >
              Novo Usuário
            </Button>
          </Box>
        </Box>

        {/* Estatísticas */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
          <Card sx={{ flex: "1 1 200px", minWidth: 200 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total de Usuários
              </Typography>
              <Typography variant="h4" color="primary">
                {usuarios.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {usuariosAtivos} ativos • {novosHoje} novos hoje
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: "1 1 200px", minWidth: 200 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Alunos
              </Typography>
              <Typography variant="h4" color="success.main">
                {totalAlunos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {usuarios.filter(u => u.tipo === 3 && u.ativo).length} ativos
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: "1 1 200px", minWidth: 200 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Professores
              </Typography>
              <Typography variant="h4" color="warning.main">
                {totalProfessores}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {usuarios.filter(u => u.tipo === 2 && u.ativo).length} ativos
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: "1 1 200px", minWidth: 200 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Administradores
              </Typography>
              <Typography variant="h4" color="error.main">
                {totalAdmins}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sistema
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Buscar por nome, email, CPF ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: "1 1 300px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e: SelectChangeEvent) => setFilterStatus(e.target.value as any)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="ativo">Ativos</MenuItem>
                  <MenuItem value="inativo">Inativos</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filterOrder}
                  label="Ordenar por"
                  onChange={(e: SelectChangeEvent) => setFilterOrder(e.target.value as any)}
                >
                  <MenuItem value="nome">Nome</MenuItem>
                  <MenuItem value="dataCadastro">Data de Cadastro</MenuItem>
                  <MenuItem value="tipo">Tipo</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
            <Chip
              label="Ativos"
              onClick={() => setFilterStatus("ativo")}
              color={filterStatus === "ativo" ? "primary" : "default"}
              variant={filterStatus === "ativo" ? "filled" : "outlined"}
              icon={<CheckCircle />}
            />
            <Chip
              label="Inativos"
              onClick={() => setFilterStatus("inativo")}
              color={filterStatus === "inativo" ? "default" : "default"}
              variant={filterStatus === "inativo" ? "filled" : "outlined"}
              icon={<Block />}
            />
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {filteredUsuarios.length} usuários encontrados
              {totalPaginas > 1 && ` (Página ${paginaAtual} de ${totalPaginas})`}
            </Typography>
          </Box>
        </Paper>

        {/* Controle de Paginação Superior */}
        {filteredUsuarios.length > usuariosPorPagina && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Pagination
              count={totalPaginas}
              page={paginaAtual}
              onChange={handleMudarPagina}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* Lista de Usuários */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredUsuarios.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Person sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum usuário encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? "Tente outra busca" : "Cadastre seu primeiro usuário"}
            </Typography>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.light" }}>
                    <TableCell>Usuário</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Contato</TableCell>
                    <TableCell>Endereço</TableCell>
                    <TableCell>Cadastro</TableCell>
                    <TableCell>Último Login</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuariosPaginaAtual.map((usuario) => {
                    const tipoInfo = getTipoInfo(usuario.tipo);
                    const enderecoPrincipal = getEnderecoPrincipal(usuario.enderecos);
                    
                    return (
                      <TableRow key={usuario.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                              sx={{ 
                                width: 50, 
                                height: 50,
                                bgcolor: tipoInfo.bgColor,
                                color: tipoInfo.textColor
                              }}
                            >
                              {usuario.nomeCompleto.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {usuario.nomeCompleto}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {usuario.cpf || "Sem CPF"}
                              </Typography>
                              {usuario.tipo === 3 && (
                                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                                  <Chip
                                    icon={<School fontSize="small" />}
                                    label={`${usuario.cursosMatriculados || 0} cursos`}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tipoInfo.label}
                            color={tipoInfo.color}
                            size="small"
                            icon={tipoInfo.icon}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">
                              <Email fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                              {usuario.email}
                            </Typography>
                            {usuario.telefone && (
                              <Typography variant="body2">
                                <Phone fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                {usuario.telefone}
                              </Typography>
                            )}
                            {usuario.dataNascimento && (
                              <Typography variant="caption" color="text.secondary">
                                <CalendarToday fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                {calculateAge(usuario.dataNascimento)} anos
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {enderecoPrincipal ? (
                            <Box>
                              <Typography variant="body2" noWrap>
                                <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                {enderecoPrincipal.cidade}, {enderecoPrincipal.estado}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {enderecoPrincipal.rua}, {enderecoPrincipal.numero}
                              </Typography>
                              {enderecoPrincipal.isPrincipal && (
                                <Chip
                                  label="Principal"
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                  icon={<Home fontSize="small" />}
                                />
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Sem endereço
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(usuario.dataCadastro)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(usuario.dataCadastro).fromNow()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {usuario.ultimoLogin ? (
                            <>
                              <Typography variant="body2">
                                {formatDateTime(usuario.ultimoLogin)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {dayjs(usuario.ultimoLogin).fromNow()}
                              </Typography>
                            </>
                          ) : (
                            <Chip
                              label="Nunca acessou"
                              size="small"
                              color="default"
                              icon={<Warning fontSize="small" />}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={usuario.ativo ? "Ativo" : "Inativo"}
                            color={usuario.ativo ? "success" : "default"}
                            size="small"
                            icon={usuario.ativo ? <CheckCircle /> : <Block />}
                            onClick={() => handleToggleStatus(usuario)}
                            sx={{ cursor: "pointer" }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                            <Tooltip title="Visualizar">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewUsuario(usuario)}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleEditUsuario(usuario)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {usuario.tipo !== 1 && (
                              <Tooltip title="Excluir">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteClick(usuario)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginação Inferior */}
            {filteredUsuarios.length > usuariosPorPagina && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPaginas}
                  page={paginaAtual}
                  onChange={handleMudarPagina}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* Informação da página */}
            {filteredUsuarios.length > 0 && (
              <Box sx={{ textAlign: "center", mt: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Mostrando {indicePrimeiroUsuario + 1} a{" "}
                  {Math.min(indiceUltimoUsuario, filteredUsuarios.length)} de{" "}
                  {filteredUsuarios.length} usuários
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Botão voltar */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/dashboard")}
          >
            Voltar para Dashboard
          </Button>
        </Box>
      </Container>

      {/* Modal de detalhes do usuário */}
      <Dialog
        open={detalhesOpen}
        onClose={() => setDetalhesOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {usuarioDetalhes && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{ 
                    width: 60, 
                    height: 60,
                    bgcolor: getTipoInfo(usuarioDetalhes.tipo).bgColor,
                    color: getTipoInfo(usuarioDetalhes.tipo).textColor
                  }}
                >
                  {usuarioDetalhes.nomeCompleto.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5">{usuarioDetalhes.nomeCompleto}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getTipoInfo(usuarioDetalhes.tipo).label} • {usuarioDetalhes.cpf || "Sem CPF"}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Informações Pessoais */}
                <Box sx={{ flex: '1 1 300px' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Informações Pessoais
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {usuarioDetalhes.email}
                      </Typography>
                    </Box>
                    {usuarioDetalhes.telefone && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Telefone
                        </Typography>
                        <Typography variant="body1">
                          {usuarioDetalhes.telefone}
                        </Typography>
                      </Box>
                    )}
                    {usuarioDetalhes.cpf && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          CPF
                        </Typography>
                        <Typography variant="body1">
                          {usuarioDetalhes.cpf}
                        </Typography>
                      </Box>
                    )}
                    {usuarioDetalhes.dataNascimento && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Data de Nascimento
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(usuarioDetalhes.dataNascimento)} ({calculateAge(usuarioDetalhes.dataNascimento)} anos)
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Informações do Sistema */}
                <Box sx={{ flex: '1 1 300px' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Informações do Sistema
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Tipo de Usuário
                      </Typography>
                      <Chip
                        label={getTipoInfo(usuarioDetalhes.tipo).label}
                        color={getTipoInfo(usuarioDetalhes.tipo).color}
                        icon={getTipoInfo(usuarioDetalhes.tipo).icon}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Data de Cadastro
                      </Typography>
                      <Typography variant="body1">
                        {formatDateTime(usuarioDetalhes.dataCadastro)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Último Login
                      </Typography>
                      <Typography variant="body1">
                        {usuarioDetalhes.ultimoLogin ? formatDateTime(usuarioDetalhes.ultimoLogin) : "Nunca"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={usuarioDetalhes.ativo ? "Ativo" : "Inativo"}
                        color={usuarioDetalhes.ativo ? "success" : "default"}
                        icon={usuarioDetalhes.ativo ? <CheckCircle /> : <Block />}
                      />
                    </Box>
                  </Stack>
                </Box>

                {/* Endereços */}
                {usuarioDetalhes.enderecos.length > 0 && (
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Endereços
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {usuarioDetalhes.enderecos.map((endereco, index) => (
                        <Paper 
                          key={endereco.id} 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            flex: '1 1 300px',
                            minWidth: 300 
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              {endereco.isPrincipal && (
                                <Chip
                                  label="Principal"
                                  size="small"
                                  sx={{ mr: 1 }}
                                  icon={<Home fontSize="small" />}
                                />
                              )}
                              Endereço {index + 1}
                            </Typography>
                            <Typography variant="body2">
                              {endereco.rua}, {endereco.numero}
                              {endereco.complemento && `, ${endereco.complemento}`}
                            </Typography>
                            <Typography variant="body2">
                              {endereco.bairro}
                            </Typography>
                            <Typography variant="body2">
                              {endereco.cidade} - {endereco.estado}
                            </Typography>
                            <Typography variant="body2">
                              CEP: {endereco.cep}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Cursos Matriculados */}
                {usuarioDetalhes.tipo === 3 && (
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Cursos Matriculados
                    </Typography>
                    {cursosMatriculados.length === 0 ? (
                      <Alert severity="info">
                        Este aluno não está matriculado em nenhum curso.
                      </Alert>
                    ) : (
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Curso</TableCell>
                              <TableCell>Data da Matrícula</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Progresso</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cursosMatriculados.map((curso) => (
                              <TableRow key={curso.id}>
                                <TableCell>{curso.nome}</TableCell>
                                <TableCell>{formatDate(curso.dataMatricula)}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={curso.status}
                                    size="small"
                                    color={
                                      curso.status === "concluído" ? "success" :
                                      curso.status === "cancelado" ? "error" : "primary"
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ flex: 1 }}>
                                      <Box 
                                        sx={{
                                          height: 8,
                                          bgcolor: 'grey.200',
                                          borderRadius: 4,
                                          overflow: 'hidden'
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: `${curso.progresso}%`,
                                            height: '100%',
                                            bgcolor: 'primary.main'
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                    <Typography variant="body2">
                                      {curso.progresso}%
                                    </Typography>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetalhesOpen(false)}>Fechar</Button>
              <Button
                variant="contained"
                onClick={() => {
                  setDetalhesOpen(false);
                  handleEditUsuario(usuarioDetalhes);
                }}
              >
                Editar Usuário
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AlunosAdminPage;