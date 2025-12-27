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
} from "@mui/material";
import {
  ShoppingCart,
  AccessTime,
  School,
  CheckCircle,
  KeyboardArrowRight,
  Description,
  CardMembership,
  SupportAgent,
  Schedule,
  People,
  Book,
  Build,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import api from "../config/api";

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
const CursoDetalhePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [curso, setCurso] = useState<ICurso>();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userType = localStorage.getItem("userType") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  const listarCurso = async () => {
    try {
      const response = await api.get<ICurso>(`/cursos/${id}`);
      setCurso(response.data);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
  };

  const handleAddToCartOrLogin = () => {
  if (isLoggedIn) {
    navigate("/carrinho", { state: { curso } });
  } else {
    navigate("/login", { state: { from: `/curso/${id}` } });
  }
};

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    console.log(event);
  };

  useEffect(() => {
    listarCurso();
  }, []);

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
            </Box>

            {/* Informações do curso */}
            <Box sx={{ flex: "1 1 300px" }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {curso?.nome}
                </Typography>
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
                      {curso?.duracaoHoras}
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
                  <Schedule color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Carga horária
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
                      Vagas
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {curso?.maxAlunos}
                    </Typography>
                  </Box>
                </Box>
              </Box>

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
                  </Box>
                  
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCartOrLogin}
                    sx={{ mb: 2, py: 1.5 }}
                  >
                    {isLoggedIn ? "Adicionar ao Carrinho" : "Entrar para Comprar"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Matricular Agora
                  </Button>
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

                <Divider sx={{ my: 3 }} />
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Conteúdo Programático
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                  Este curso está dividido em{" "}
                  {curso?.conteudoProgramatico.length} módulos completos,
                  totalizando {curso?.duracaoHoras} horas de conteúdo prático e
                  teórico.
                </Typography>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Certificação
                </Typography>
                <Paper sx={{ p: 3, bgcolor: "primary.light" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    <CardMembership
                      sx={{ fontSize: 60, color: "primary.main" }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Certificado Digital Reconhecido
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Ao concluir o curso com aproveitamento mínimo de 70%,
                        você receberá um certificado digital reconhecido pela
                        ABRACICLO (Associação Brasileira do Setor de
                        Bicicletas).
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
              </Box>
            )}

            {tabValue === 3 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Nossos Instrutores
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                  Aprenda com os melhores profissionais do mercado, com anos de
                  experiência prática.
                </Typography>
              </Box>
            )}

            {tabValue === 4 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Metodologia de Ensino
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
                  <Paper
                    sx={{
                      p: 3,
                      flex: "1 1 300px",
                      textAlign: "center",
                    }}
                  >
                    <Build
                      sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      70% Prática
                    </Typography>
                    <Typography variant="body2">
                      Aulas hands-on com bicicletas reais e ferramentas
                      profissionais
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 3,
                      flex: "1 1 300px",
                      textAlign: "center",
                    }}
                  >
                    <Book sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      30% Teoria
                    </Typography>
                    <Typography variant="body2">
                      Fundamentos técnicos e conceitos essenciais para
                      entendimento completo
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 3,
                      flex: "1 1 300px",
                      textAlign: "center",
                    }}
                  >
                    <SupportAgent
                      sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Suporte Contínuo
                    </Typography>
                    <Typography variant="body2">
                      Grupo exclusivo e suporte dos instrutores por 1 ano após o
                      curso
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CursoDetalhePage;
