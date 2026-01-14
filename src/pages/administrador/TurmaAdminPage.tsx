/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Pagination,
  Stack,
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  CalendarToday,
  People,
  CheckCircle,
  Block,
  Class,
  Schedule,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../../config/api";
import Swal from "sweetalert2";

interface ITurma {
  id: number;
  cursoId: number;
  dataInicio: string;
  dataFim: string;
  horario: string;
  professor: string;
  vagasTotal: number;
  vagasDisponiveis: number;
  status: string;
  curso: {
    id: number;
    codigo: string;
    nome: string;
    valor: number;
    duracaoHoras: number;
  };
}

interface ICurso {
  id: number;
  codigo: string;
  nome: string;
}

const TurmasAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<ITurma[]>([]);
  const [filteredTurmas, setFilteredTurmas] = useState<ITurma[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "todos" | "ativa" | "inativa"
  >("todos");
  const [loading, setLoading] = useState(true);
  
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [turmasPorPagina] = useState(10); // 10 turmas por página
  
  // Estados para o modal de edição
  const [modalOpen, setModalOpen] = useState(false);
  const [turmaEditando, setTurmaEditando] = useState<ITurma | null>(null);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Estados do formulário
  const [formData, setFormData] = useState({
    cursoId: "",
    dataInicio: null as Date | null,
    dataFim: null as Date | null,
    horario: "",
    professor: "",
    vagasTotal: "",
    status: "ATIVA",
  });

  const buscarTurmas = async () => {
    try {
      setLoading(true);
      const response = await api.get<ITurma[]>("/turmas");
      setTurmas(response.data);
      setFilteredTurmas(response.data);
      setPaginaAtual(1); // Reseta para primeira página ao buscar
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao carregar turmas",
        icon: "error",
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarCursos = async () => {
    try {
      setLoadingCursos(true);
      const response = await api.get<ICurso[]>("/cursos");
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    } finally {
      setLoadingCursos(false);
    }
  };

  useEffect(() => {
    buscarTurmas();
    buscarCursos();
  }, []);

  // Filtrar turmas
  useEffect(() => {
    let resultado = turmas;

    // Filtro por busca
    if (searchTerm) {
      resultado = resultado.filter(
        (turma) =>
          turma.curso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          turma.curso.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          turma.professor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (filterStatus !== "todos") {
      const statusBusca = filterStatus === "ativa" ? "ATIVA" : "INATIVA";
      resultado = resultado.filter((turma) => turma.status === statusBusca);
    }

    setFilteredTurmas(resultado);
    setPaginaAtual(1); // Reseta para primeira página ao filtrar
  }, [searchTerm, filterStatus, turmas]);

  // Cálculos para paginação
  const indiceUltimaTurma = paginaAtual * turmasPorPagina;
  const indicePrimeiraTurma = indiceUltimaTurma - turmasPorPagina;
  const turmasPaginaAtual = filteredTurmas.slice(indicePrimeiraTurma, indiceUltimaTurma);
  const totalPaginas = Math.ceil(filteredTurmas.length / turmasPorPagina);

  const handleMudarPagina = (_event: React.ChangeEvent<unknown>, valor: number) => {
    setPaginaAtual(valor);
    // Rolar para o topo da tabela
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const abrirModalEdicao = (turma: ITurma) => {
    setTurmaEditando(turma);
    setFormData({
      cursoId: turma.cursoId.toString(),
      dataInicio: new Date(turma.dataInicio),
      dataFim: new Date(turma.dataFim),
      horario: turma.horario,
      professor: turma.professor,
      vagasTotal: turma.vagasTotal.toString(),
      status: turma.status,
    });
    setErro("");
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setTurmaEditando(null);
    setFormData({
      cursoId: "",
      dataInicio: null,
      dataFim: null,
      horario: "",
      professor: "",
      vagasTotal: "",
      status: "ATIVA",
    });
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalvarTurma = async () => {
    // Validações
    if (!formData.cursoId) {
      setErro("Selecione um curso");
      return;
    }
    if (!formData.dataInicio) {
      setErro("Informe a data de início");
      return;
    }
    if (!formData.dataFim) {
      setErro("Informe a data de término");
      return;
    }
    if (formData.dataFim < formData.dataInicio) {
      setErro("Data de término não pode ser anterior à data de início");
      return;
    }
    if (!formData.horario.trim()) {
      setErro("Informe o horário");
      return;
    }
    if (!formData.vagasTotal || parseInt(formData.vagasTotal) <= 0) {
      setErro("Número de vagas inválido");
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      const dadosAtualizacao = {
        cursoId: parseInt(formData.cursoId),
        dataInicio: formData.dataInicio.toISOString().split('T')[0],
        dataFim: formData.dataFim.toISOString().split('T')[0],
        horario: formData.horario.trim(),
        professor: formData.professor.trim(),
        vagasTotal: parseInt(formData.vagasTotal),
        status: formData.status,
      };

      if (turmaEditando) {
        // Editar turma existente
        await api.put(`/turmas/${turmaEditando.id}`, dadosAtualizacao);
        
        Swal.fire({
          title: "Sucesso!",
          text: "Turma atualizada com sucesso",
          icon: "success",
          timer: 1500,
        });
      } else {
        // Criar nova turma
        await api.post("/turmas", dadosAtualizacao);
        
        Swal.fire({
          title: "Sucesso!",
          text: "Turma criada com sucesso",
          icon: "success",
          timer: 1500,
        });
      }

      fecharModal();
      buscarTurmas(); // Recarrega a lista

    } catch (error: any) {
      console.error("Erro ao salvar turma:", error);
      setErro(error.response?.data?.mensagem || "Erro ao salvar turma");
    } finally {
      setSalvando(false);
    }
  };

  const handleDeleteClick = async (turma: ITurma) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a excluir a turma do curso "${turma.curso.nome}".`,
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
        await api.delete(`/turmas/${turma.id}`);
        
        Swal.fire({
          title: "Excluído!",
          text: "Turma excluída com sucesso.",
          icon: "success",
          confirmButtonColor: "#1976d2",
          timer: 2000,
        });

        buscarTurmas();
      } catch (error: any) {
        console.error("Erro ao excluir turma:", error);
        
        let errorMessage = "Erro ao excluir turma";
        if (error.response?.status === 400) {
          errorMessage = "Não é possível excluir turma com alunos matriculados";
        }
        
        Swal.fire({
          title: "Erro!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#d32f2f",
        });
      }
    }
  };

  const handleToggleStatus = async (turma: ITurma) => {
    const novoStatus = turma.status === "ATIVA" ? "INATIVA" : "ATIVA";
    const acao = novoStatus === "ATIVA" ? "ativar" : "inativar";

    const result = await Swal.fire({
      title: `Confirmar ${acao}?`,
      text: `Você está prestes a ${acao} esta turma.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: novoStatus === "ATIVA" ? "#2e7d32" : "#ed6c02",
      cancelButtonColor: "#757575",
      confirmButtonText: `Sim, ${acao}!`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/turmas/${turma.id}/status`, { status: novoStatus });
        
        // Atualiza localmente
        setTurmas(
          turmas.map((t) =>
            t.id === turma.id ? { ...t, status: novoStatus } : t
          )
        );

        Swal.fire({
          title: "Sucesso!",
          text: `Turma ${acao}da com sucesso.`,
          icon: "success",
          timer: 1500,
        });
      } catch (error) {
        console.error("Erro ao alterar status:", error);
        Swal.fire({
          title: "Erro!",
          text: "Erro ao alterar status da turma",
          icon: "error",
        });
      }
    }
  };

  return (
    <>
      <Navbar userType="admin" />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Container maxWidth="xl" sx={{ mt: 11, mb: 6 }}>
          {/* Cabeçalho */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                <Class sx={{ verticalAlign: "middle", mr: 2 }} />
                Gerenciamento de Turmas
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Gerencie todas as turmas do sistema
              </Typography>
            </Box>
          </Box>

          {/* Filtros */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
              <TextField
                placeholder="Buscar turmas..."
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

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label="Todas"
                  onClick={() => setFilterStatus("todos")}
                  color={filterStatus === "todos" ? "primary" : "default"}
                  variant={filterStatus === "todos" ? "filled" : "outlined"}
                />
                <Chip
                  label="Ativas"
                  onClick={() => setFilterStatus("ativa")}
                  color={filterStatus === "ativa" ? "primary" : "default"}
                  variant={filterStatus === "ativa" ? "filled" : "outlined"}
                  icon={<CheckCircle />}
                />
                <Chip
                  label="Inativas"
                  onClick={() => setFilterStatus("inativa")}
                  color={filterStatus === "inativa" ? "primary" : "default"}
                  variant={filterStatus === "inativa" ? "filled" : "outlined"}
                  icon={<Block />}
                />
              </Box>
            </Box>
          </Paper>

          {/* Contador e Info de Paginação */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h6">
              {filteredTurmas.length} turmas encontradas
              {totalPaginas > 1 && ` (Página ${paginaAtual} de ${totalPaginas})`}
            </Typography>
            
            {totalPaginas > 1 && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Mostrando {turmasPorPagina} por página
                </Typography>
                <Pagination
                  count={totalPaginas}
                  page={paginaAtual}
                  onChange={handleMudarPagina}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            )}
          </Box>

          {/* Lista de Turmas */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredTurmas.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Class sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma turma encontrada
              </Typography>
            </Paper>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.light" }}>
                      <TableCell>Curso</TableCell>
                      <TableCell>Data/Horário</TableCell>
                      <TableCell>Professor</TableCell>
                      <TableCell>Vagas</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {turmasPaginaAtual.map((turma) => {
                      return (
                        <TableRow key={turma.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {turma.curso.nome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Código: {turma.curso.codigo}
                              </Typography>
                              <Box sx={{ mt: 0.5 }}>
                                <Chip
                                  label={`${turma.curso.duracaoHoras}h`}
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  label={`R$ ${turma.curso.valor.toFixed(2)}`}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                <CalendarToday fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                                {formatarData(turma.dataInicio)}
                                {turma.dataFim !== turma.dataInicio && ` até ${formatarData(turma.dataFim)}`}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                <Schedule fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                                {turma.horario}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {turma.professor || "Não definido"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <People fontSize="small" color="action" />
                              <Typography variant="body1" fontWeight="medium">
                                {turma.vagasDisponiveis}/{turma.vagasTotal}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={turma.status === "ATIVA" ? "Ativa" : "Inativa"}
                              color={turma.status === "ATIVA" ? "success" : "default"}
                              size="small"
                              icon={turma.status === "ATIVA" ? <CheckCircle /> : <Block />}
                              onClick={() => handleToggleStatus(turma)}
                              sx={{ cursor: "pointer" }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => abrirModalEdicao(turma)}
                                title="Editar"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(turma)}
                                title="Excluir"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Paginação Inferior */}
              {totalPaginas > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 3,
                  mb: 4
                }}>
                  <Stack spacing={2} alignItems="center">
                    <Pagination
                      count={totalPaginas}
                      page={paginaAtual}
                      onChange={handleMudarPagina}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                      siblingCount={1}
                      boundaryCount={1}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Mostrando {indicePrimeiraTurma + 1} a {Math.min(indiceUltimaTurma, filteredTurmas.length)} de {filteredTurmas.length} turmas
                    </Typography>
                  </Stack>
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

          {/* Modal de Edição/Criação */}
          <Dialog 
            open={modalOpen} 
            onClose={fecharModal}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {turmaEditando ? "Editar Turma" : "Nova Turma"}
            </DialogTitle>
            <DialogContent>
              {erro && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {erro}
                </Alert>
              )}
              
              <Box sx={{ mt: 1 }}>
                {/* Curso */}
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Curso *</InputLabel>
                    <Select
                      value={formData.cursoId}
                      label="Curso *"
                      onChange={(e) => handleFormChange("cursoId", e.target.value)}
                      disabled={loadingCursos || !!turmaEditando}
                    >
                      {loadingCursos ? (
                        <MenuItem disabled>Carregando cursos...</MenuItem>
                      ) : (
                        cursos.map((curso) => (
                          <MenuItem key={curso.id} value={curso.id}>
                            {curso.codigo} - {curso.nome}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Box>

                {/* Datas */}
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <DatePicker
                      label="Data de Início *"
                      value={formData.dataInicio}
                      onChange={(date) => handleFormChange("dataInicio", date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <DatePicker
                      label="Data de Término *"
                      value={formData.dataFim}
                      onChange={(date) => handleFormChange("dataFim", date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Horário e Professor */}
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      label="Horário *"
                      fullWidth
                      value={formData.horario}
                      onChange={(e) => handleFormChange("horario", e.target.value)}
                      placeholder="Ex: 14:00 - 18:00"
                      required
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      label="Professor"
                      fullWidth
                      value={formData.professor}
                      onChange={(e) => handleFormChange("professor", e.target.value)}
                      placeholder="Nome do professor"
                    />
                  </Box>
                </Box>

                {/* Vagas e Status */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      label="Vagas Totais *"
                      fullWidth
                      type="number"
                      value={formData.vagasTotal}
                      onChange={(e) => handleFormChange("vagasTotal", e.target.value)}
                      inputProps={{ min: 1 }}
                      required
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) => handleFormChange("status", e.target.value)}
                      >
                        <MenuItem value="ATIVA">Ativa</MenuItem>
                        <MenuItem value="INATIVA">Inativa</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={fecharModal} disabled={salvando}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSalvarTurma} 
                variant="contained"
                disabled={salvando}
              >
                {salvando ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Salvando...
                  </>
                ) : turmaEditando ? "Atualizar" : "Criar"}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </LocalizationProvider>
    </>
  );
};

export default TurmasAdminPage;