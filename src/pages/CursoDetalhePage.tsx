/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Tab,
  Tabs,
  Card,
  CardContent,
  Alert,
  Chip,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import {
  ShoppingCart,
  AccessTime,
  School,
  CheckCircle,
  KeyboardArrowRight,
  Description,
  CardMembership,
  People,
  Book,
  ErrorOutline,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import api from "../config/api";

interface ICurso {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  descricaoDetalhada: string;
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

const CursoDetalhePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [curso, setCurso] = useState<ICurso>();
  const [turmas, setTurmas] = useState<ITurma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | "">("");
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userType = localStorage.getItem("userType") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  const listarCurso = async () => {
    try {
      setLoading(true);
      const response = await api.get<ICurso>(`/cursos/${id}`);
      setCurso(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar informações do curso",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const listarTurmas = async () => {
    if (!id) return;
    
    try {
      setLoadingTurmas(true);
      const response = await api.get(`/cursos/${id}/turmas`);
      const turmasData = response.data.dados || [];
      const turmasAtivas = turmasData.filter((turma: ITurma) => 
        turma.status === 'ATIVA' && turma.vagasDisponiveis > 0
      );
      
      setTurmas(turmasAtivas);
      
      // Seleciona a primeira turma automaticamente
      if (turmasAtivas.length > 0) {
        setTurmaSelecionada(turmasAtivas[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      setTurmas([]);
      setSnackbar({
        open: true,
        message: "Erro ao carregar turmas disponíveis",
        severity: "warning",
      });
    } finally {
      setLoadingTurmas(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setSnackbar({
        open: true,
        message: "Você precisa estar logado para adicionar ao carrinho",
        severity: "warning",
      });
      navigate("/login", { state: { from: `/curso/${id}` } });
      return;
    }

    if (!turmaSelecionada) {
      setSnackbar({
        open: true,
        message: "Por favor, selecione uma turma",
        severity: "warning",
      });
      return;
    }

    try {
      const response = await api.post('/carrinho/adicionar', {
        cursoId: curso?.id,
        turmaId: turmaSelecionada,
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: response.data.mensagem || "Curso adicionado ao carrinho com sucesso!",
          severity: "success",
        });
        
        // Opcional: navegar para o carrinho após adicionar
        setTimeout(() => {
          navigate("/carrinho");
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: response.data.mensagem || "Erro ao adicionar ao carrinho",
          severity: "error",
        });
      }
    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      
      let errorMessage = "Erro ao adicionar curso ao carrinho";
      if (error.response?.status === 401) {
        errorMessage = "Sessão expirada. Faça login novamente.";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (error.response?.data?.mensagem) {
        errorMessage = error.response.data.mensagem;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleTurmaChange = (event: SelectChangeEvent<number>) => {
    setTurmaSelecionada(event.target.value as number);
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const temTurmasDisponiveis = turmas.length > 0;
  const podeAdicionarAoCarrinho = isLoggedIn && temTurmasDisponiveis && turmaSelecionada !== "";

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    listarCurso();
  }, [id]);

  useEffect(() => {
    if (curso?.id) {
      listarTurmas();
    }
  }, [curso]);

  if (loading) {
    return (
      <>
        <Navbar
          userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
          userName={isLoggedIn ? userName : undefined}
          userEmail={isLoggedIn ? userEmail : undefined}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!curso) {
    return (
      <>
        <Navbar
          userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
          userName={isLoggedIn ? userName : undefined}
          userEmail={isLoggedIn ? userEmail : undefined}
        />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
          <Alert severity="error" sx={{ mt: 4 }}>
            Curso não encontrado ou não disponível.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/cursos")}
            sx={{ mt: 2 }}
          >
            Voltar para Cursos
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar
        userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
        userName={isLoggedIn ? userName : undefined}
        userEmail={isLoggedIn ? userEmail : undefined}
      />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        {/* Cabeçalho do curso */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Button
              variant="text"
              onClick={() => navigate("/cursos")}
              startIcon={
                <KeyboardArrowRight sx={{ transform: "rotate(180deg)" }} />
              }
            >
              Voltar para cursos
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              alignItems: "flex-start",
            }}
          >
            {/* Imagem e informações principais */}
            <Box sx={{ flex: "1 1 300px" }}>
              <Paper
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  mb: 3,
                }}
              >
                <Box
                  component="img"
                  src={curso?.fotoUrl}
                  alt={curso?.nome}
                  sx={{
                    width: "100%",
                    height: { xs: 300, md: 400 },
                    objectFit: "cover",
                  }}
                />
              </Paper>
              
              {/* Destaques */}
              {curso.destaques && curso.destaques.length > 0 && (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Destaques do Curso:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {curso.destaques.map((destaque, index) => (
                      <Chip
                        key={index}
                        label={destaque}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Informações do curso */}
            <Box sx={{ flex: "1 1 300px" }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {curso?.nome}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Chip
                    label={curso.nivel}
                    color="primary"
                    variant="filled"
                    size="small"
                  />
                  {curso.certificadoDisponivel && (
                    <Chip
                      label="Com Certificado"
                      color="success"
                      variant="outlined"
                      size="small"
                      icon={<CheckCircle />}
                    />
                  )}
                </Box>
              </Box>

              {/* Descrição */}
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {curso?.descricao}
              </Typography>

              {/* Detalhes técnicos */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flex: "1 1 120px",
                  }}
                >
                  <AccessTime color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Duração
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {curso?.duracaoHoras} horas
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flex: "1 1 120px",
                  }}
                >
                  <People color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Vagas por turma
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {curso?.maxAlunos} alunos
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flex: "1 1 120px",
                  }}
                >
                  <School color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Nível
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {curso?.nivel}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Seletor de Turma */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Turmas Disponíveis
                </Typography>
                
                {loadingTurmas ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : temTurmasDisponiveis ? (
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="turma-select-label">
                        Selecione uma turma
                      </InputLabel>
                      <Select
                        labelId="turma-select-label"
                        value={turmaSelecionada}
                        onChange={handleTurmaChange}
                        label="Selecione uma turma"
                      >
                        {turmas.map((turma) => (
                          <MenuItem key={turma.id} value={turma.id}>
                            <Box>
                              <Typography variant="body1">
                                {turma.nome} - {formatarData(turma.dataInicio)} a {formatarData(turma.dataFim)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {turma.horario} • {turma.vagasDisponiveis} vagas disponíveis
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    {turmaSelecionada && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          Turma selecionada: {
                            turmas.find(t => t.id === turmaSelecionada)?.nome
                          }
                        </Typography>
                      </Alert>
                    )}
                  </>
                ) : (
                  <Alert severity="warning">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ErrorOutline />
                      <Typography variant="body2">
                        Nenhuma turma disponível no momento. Entre em contato para mais informações.
                      </Typography>
                    </Box>
                  </Alert>
                )}
              </Paper>

              {/* Card de compra */}
              <Card sx={{ position: "sticky", top: 20 }}>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h3"
                        color="primary"
                        fontWeight="bold"
                      >
                        R$ {curso?.valor.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        à vista
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {curso?.duracaoHoras} horas de conteúdo
                    </Typography>
                  </Box>
                  
                  {/* Botão de Adicionar ao Carrinho */}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={!podeAdicionarAoCarrinho}
                    sx={{ 
                      mb: 2, 
                      py: 1.5,
                      opacity: podeAdicionarAoCarrinho ? 1 : 0.7
                    }}
                  >
                    {isLoggedIn 
                      ? (temTurmasDisponiveis 
                          ? "Adicionar ao Carrinho" 
                          : "Sem Turmas Disponíveis")
                      : "Entrar para Comprar"
                    }
                  </Button>

                  {/* Mensagens informativas */}
                  {!isLoggedIn && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Faça login para adicionar este curso ao carrinho
                    </Alert>
                  )}
                  
                  {isLoggedIn && !temTurmasDisponiveis && (
                    <Alert severity="warning">
                      Este curso não possui turmas disponíveis no momento
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Tabs de conteúdo */}
        <Paper sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab icon={<Description />} label="Descrição" />
            <Tab icon={<Book />} label="Conteúdo" />
            <Tab icon={<CardMembership />} label="Certificação" />
          </Tabs>

          {/* Conteúdo das tabs */}
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Sobre este curso
                </Typography>
                <Typography variant="body1" paragraph>
                  {curso?.descricao}
                </Typography>

                {curso.descricaoDetalhada && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>
                      Descrição Detalhada
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {curso.descricaoDetalhada}
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Conteúdo Programático
                </Typography>
                {curso.conteudoProgramatico ? (
                  <Box sx={{ whiteSpace: "pre-line" }}>
                    {curso.conteudoProgramatico}
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Conteúdo programático em desenvolvimento.
                  </Typography>
                )}
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Certificação
                </Typography>
                {curso.certificadoDisponivel ? (
                  <Paper sx={{ p: 3, bgcolor: "success.light" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        flexWrap: "wrap",
                      }}
                    >
                      <CardMembership
                        sx={{ fontSize: 60, color: "success.main" }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Certificado Digital Incluso
                        </Typography>
                        <Typography variant="body1" paragraph>
                          Ao concluir o curso com aproveitamento mínimo de 70%,
                          você receberá um certificado digital reconhecido.
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 3,
                            mt: 2,
                          }}
                        >
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <CheckCircle color="success" />
                            <Typography variant="body2">
                              Código de autenticação único
                            </Typography>
                          </Box>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <CheckCircle color="success" />
                            <Typography variant="body2">
                              Válido em todo território nacional
                            </Typography>
                          </Box>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <CheckCircle color="success" />
                            <Typography variant="body2">
                              Pode ser compartilhado no LinkedIn
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ) : (
                  <Alert severity="info">
                    Este curso não inclui certificado.
                  </Alert>
                )}
              </Box>
            )}

          </Box>
        </Paper>
        
        {/* Snackbar para feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
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
      </Container>
    </>
  );
};

export default CursoDetalhePage;