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
} from "@mui/material";
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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../../config/api";
import EditarCursoModal from "../components/EditarCursoModal"; // Ajuste o caminho
import { Snackbar } from "@mui/material";
import Swal from "sweetalert2";

interface ICurso {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  descricaoDetalhada: string;
  fotoUrl: string;
  valor: number;
  duracaoHoras: number;
  nivel: string;
  maxAlunos: number;
  conteudoProgramatico: string;
  certificadoDisponivel: boolean;
  ativo?: boolean;
}

const CursosAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [filteredCursos, setFilteredCursos] = useState<ICurso[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "todos" | "ativo" | "inativo"
  >("todos");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState<ICurso | null>(null);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalExcluirOpen, setModalExcluirOpen] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState<ICurso | null>(null);
  const [cursoParaExcluir, setCursoParaExcluir] = useState<{
    id: number;
    nome: string;
  } | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  // Dados simulados - em produção viria da API
  const buscarCursos = async () => {
    try {
      setLoading(true);
      const response = await api.get<ICurso[]>("/cursos");
      setCursos(response.data);
      setFilteredCursos(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar cursos",
        severity: "error",
      });
    } finally {
      setLoading(false);
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
      resultado = resultado.filter(
        (curso) =>
          curso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          curso.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (filterStatus !== "todos") {
      resultado = resultado.filter((curso) => curso.ativo);
    }
    setFilteredCursos(resultado);
  }, [searchTerm, filterStatus, cursos]);

  const handleViewCurso = (id: number) => {
    navigate(`/curso/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!cursoToDelete) return;

    try {
      // Simulação de exclusão
      console.log("Excluindo curso:", cursoToDelete.id);

      // Em produção:
      // await fetch(`/api/cursos/${cursoToDelete.id}`, { method: 'DELETE' });

      setCursos(cursos.filter((c) => c.id !== cursoToDelete.id));
      setDeleteDialogOpen(false);
      setCursoToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
    }
  };

  const handleEditCurso = (curso: ICurso) => {
    setCursoSelecionado(curso);
    setModalEditarOpen(true);
  };

  const handleDeleteClick = async (curso: ICurso) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a excluir o curso "${curso.nome}". Esta ação não pode ser desfeita!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#757575",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#fff",
      iconColor: "#d32f2f",
      customClass: {
        title: "swal2-title-custom",
        confirmButton: "swal2-confirm-custom",
        cancelButton: "swal2-cancel-custom",
      },
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/cursos/${curso.id}`);
        await Swal.fire({
          title: "Excluído!",
          text: `O curso "${curso.nome}" foi excluído com sucesso.`,
          icon: "success",
          confirmButtonColor: "#1976d2",
          timer: 2000,
          timerProgressBar: true,
        });

        // Recarregar lista de cursos
        buscarCursos();
      } catch (error: any) {
        console.error("Erro ao excluir curso:", error);

        let errorMessage = "Erro ao excluir curso";
        if (error.response?.status === 400) {
          errorMessage =
            "Não é possível excluir este curso pois há turmas associadas";
        } else if (error.response?.status === 404) {
          errorMessage = "Curso não encontrado";
        } else if (error.response?.status === 401) {
          errorMessage = "Sessão expirada. Faça login novamente.";
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

  // Adicione estas funções para os callbacks:
  const handleCursoAtualizado = () => {
    buscarCursos(); // Recarrega a lista de cursos
    setSnackbar({
      // Você precisa adicionar o estado de snackbar
      open: true,
      message: "Curso atualizado com sucesso!",
      severity: "success",
    });
  };

  const handleToggleStatus = async (curso: ICurso) => {
    const novoStatus = !curso.ativo;
    const acao = novoStatus ? "ativar" : "inativar";

    const result = await Swal.fire({
      title: `Confirmar ${acao}?`,
      text: `Você está prestes a ${acao} o curso "${curso.nome}".`,
      icon: novoStatus ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: novoStatus ? "#2e7d32" : "#ed6c02",
      cancelButtonColor: "#757575",
      confirmButtonText: `Sim, ${acao}!`,
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await api.patch(
          `/cursos/${curso.id}/status`,
          { ativo: novoStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Atualiza localmente
        setCursos(
          cursos.map((c) =>
            c.id === curso.id ? { ...c, ativo: novoStatus } : c
          )
        );

        await Swal.fire({
          title: "Sucesso!",
          text: `Curso ${acao}do com sucesso.`,
          icon: "success",
          confirmButtonColor: "#1976d2",
          timer: 1500,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error("Erro ao alterar status:", error);

        await Swal.fire({
          title: "Erro!",
          text: "Erro ao alterar status do curso",
          icon: "error",
          confirmButtonColor: "#d32f2f",
        });
      }
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
              <School sx={{ verticalAlign: "middle", mr: 2 }} />
              Gerenciamento de Cursos
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Gerencie todos os cursos do sistema
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
              onClick={() => navigate("/admin/curso/novo")}
            >
              Novo Curso
            </Button>
          </Box>
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
              placeholder="Buscar cursos..."
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
                label="Todos"
                onClick={() => setFilterStatus("todos")}
                color={filterStatus === "todos" ? "primary" : "default"}
                variant={filterStatus === "todos" ? "filled" : "outlined"}
              />
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
                color={filterStatus === "inativo" ? "primary" : "default"}
                variant={filterStatus === "inativo" ? "filled" : "outlined"}
                icon={<Block />}
              />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {filteredCursos.length} cursos encontrados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última atualização: {new Date().toLocaleString("pt-BR")}
            </Typography>
          </Box>
        </Paper>

        {/* Lista de Cursos */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredCursos.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <School sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum curso encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? "Tente outra busca" : "Adicione seu primeiro curso"}
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.light" }}>
                  <TableCell>Curso</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Nível</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Alunos</TableCell>
                  <TableCell>Certificado</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCursos.map((curso) => (
                  <TableRow key={curso.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            component="img"
                            src={curso.fotoUrl}
                            alt={curso.nome}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {curso.nome}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {curso.descricao}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
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
                      <Chip
                        label={curso.codigo}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Chip
                          label={curso.nivel}
                          size="small"
                          sx={{
                            bgcolor:
                              curso.nivel === "Iniciante"
                                ? "#e3f2fd"
                                : curso.nivel === "Intermediário"
                                ? "#f3e5f5"
                                : "#ffebee",
                            color:
                              curso.nivel === "Iniciante"
                                ? "#1976d2"
                                : curso.nivel === "Intermediário"
                                ? "#7b1fa2"
                                : "#d32f2f",
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="primary"
                      >
                        R$ {curso.valor.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        à vista
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={curso.duracaoHoras + "h"}
                        size="small"
                        variant="outlined"
                        icon={<AccessTime fontSize="small" />}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                        label={curso.certificadoDisponivel ? "Sim" : "Não"}
                        size="small"
                        color={
                          curso.certificadoDisponivel ? "success" : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={curso.ativo === true ? "Ativo" : "Inativo"}
                        color={curso.ativo === true ? "success" : "default"}
                        size="small"
                        icon={curso.ativo ? <CheckCircle /> : <Block />}
                        onClick={() => handleToggleStatus(curso)}
                        sx={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
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
                          onClick={() => handleEditCurso(curso)} // Agora passa o curso completo
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
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/dashboard")}
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
        <DialogTitle>Confirmar Exclusão</DialogTitle>
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
                  Esta ação não pode ser desfeita. {cursoToDelete.maxAlunos}{" "}
                  alunos estão matriculados neste curso.
                </Typography>
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      <EditarCursoModal
        open={modalEditarOpen}
        onClose={() => setModalEditarOpen(false)}
        curso={cursoSelecionado}
        onCursoAtualizado={handleCursoAtualizado}
      />

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

export default CursosAdminPage;
