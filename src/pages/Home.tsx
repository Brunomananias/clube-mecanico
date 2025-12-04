import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./Home.css";
import logo from "../assets/logo.png";

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const cursos = [
    {
      id: 1,
      titulo: "Mecânica Automotiva Básica",
      descricao:
        "Aprenda os fundamentos da mecânica de automóveis, desde manutenção preventiva até correções simples.",
      icone: <DirectionsCarIcon fontSize="large" />,
      duracao: "40 horas",
      nivel: "Iniciante",
      cor: "#1976d2",
    },
    {
      id: 2,
      titulo: "Mecânica de Motos",
      descricao:
        "Especialização em manutenção e reparo de motocicletas, scooters e similares.",
      icone: <TwoWheelerIcon fontSize="large" />,
      duracao: "60 horas",
      nivel: "Intermediário",
      cor: "#2e7d32",
    },
    {
      id: 3,
      titulo: "Eletrônica Automotiva",
      descricao:
        "Diagnóstico e reparo de sistemas eletrônicos, injeção eletrônica e centralinas.",
      icone: <ElectricalServicesIcon fontSize="large" />,
      duracao: "80 horas",
      nivel: "Avançado",
      cor: "#ed6c02",
    },
    {
      id: 4,
      titulo: "Mecânica Pesada",
      descricao:
        "Manutenção de veículos pesados, caminhões, ônibus e máquinas agrícolas.",
      icone: <LocalShippingIcon fontSize="large" />,
      duracao: "120 horas",
      nivel: "Avançado",
      cor: "#9c27b0",
    },
    {
      id: 5,
      titulo: "Injeção Eletrônica",
      descricao:
        "Curso especializado em diagnóstico e programação de sistemas de injeção eletrônica.",
      icone: <BuildIcon fontSize="large" />,
      duracao: "50 horas",
      nivel: "Intermediário",
      cor: "#d32f2f",
    },
    {
      id: 6,
      titulo: "Gestão de Oficina",
      descricao:
        "Aprenda a administrar uma oficina mecânica com técnicas modernas de gestão.",
      icone: <PeopleIcon fontSize="large" />,
      duracao: "30 horas",
      nivel: "Todos os níveis",
      cor: "#0288d1",
    },
  ];

  const beneficios = [
  "Única escola especializada apenas em bicicletas",
  "Certificação reconhecida pela ABRACICLO",
  "Laboratório com bikes das melhores marcas",
  "Metodologia 70% prática, 30% teoria",
  "Parceria com 50+ bicicletarias para estágio",
  "Aulas presenciais e online ao vivo",
  "Kit de ferramentas profissional incluso",
  "Mentoria para abrir sua própria oficina"
];

  return (
    <>
      {/* Navbar Superior */}
      <AppBar position="fixed" color="primary" elevation={3}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <div className="nav-logo">
              <BuildIcon sx={{ mr: 2, fontSize: 32 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                className="logo-text"
              >
                CLUBE DO MECÂNICO
              </Typography>
            </div>

            {!isMobile ? (
              <div className="nav-links">
                <Button color="inherit" href="#inicio" className="nav-link">
                  Início
                </Button>
                <Button color="inherit" href="#sobre" className="nav-link">
                  Sobre
                </Button>
                <Button color="inherit" href="#cursos" className="nav-link">
                  Cursos
                </Button>
                <Button color="inherit" href="#contato" className="nav-link">
                  Contato
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  href="#inscricao"
                  className="nav-button"
                >
                  Matricule-se
                </Button>
              </div>
            ) : (
              <IconButton color="inherit">
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Espaço para a navbar fixa */}
      <Toolbar />

      {/* Seção Hero/Logo da Empresa */}
      <section id="inicio" className="hero-section">
        <Container maxWidth="lg">
          <div className="hero-container">
            <div className="hero-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  gutterBottom
                  className="hero-title"
                >
                  Clube do Mecânico
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mb: 3, opacity: 0.9 }}
                  className="hero-subtitle"
                >
                  Transformando paixão por automóveis em carreira de sucesso
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, fontSize: "1.1rem" }}
                  className="hero-description"
                >
                  Há mais de 15 anos formando os melhores profissionais da
                  mecânica automotiva. Excelência técnica e práticas modernas.
                </Typography>
                <div className="hero-buttons">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    className="hero-button"
                  >
                    Ver Cursos
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    className="hero-button-outline"
                  >
                    Fale Conosco
                  </Button>
                </div>
              </motion.div>
            </div>

            <div className="hero-image">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="image-wrapper">
                  <Box
                    component="img"
                    src={logo}
                    alt="Logo Clube Mecânico"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Seção Sobre a Empresa */}
{/* Seção Sobre a Empresa */}
<Container maxWidth="lg" sx={{ py: 8 }} id="sobre">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    <Typography
      variant="h3"
      align="center"
      fontWeight="bold"
      gutterBottom
      color="primary"
      className="section-title"
    >
      Do Pedal ao Profissional
    </Typography>
    <Typography
      variant="h6"
      align="center"
      color="text.secondary"
      className="section-subtitle"
    >
      Especialistas em formar mecânicos de bicicletas
    </Typography>

    {/* PRIMEIRA SEÇÃO - Foto ESQUERDA, Texto DIREITA */}
    <div className="sobre-container sobre-container-reverse">
      <div className="sobre-imagem">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&h=400&q=80"
            alt="Oficina de bicicletas"
            className="sobre-img"
          />
        </motion.div>
      </div>
      <div className="sobre-conteudo">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Nossa História
          </Typography>
          <Typography variant="body1" paragraph>
            Em 2015, transformamos paixão por bicicletas em uma escola de referência. 
            Começamos em uma pequena garagem e hoje formamos mais de <strong>3.200 mecânicos</strong> 
            especializados em todo o Brasil.
          </Typography>
          <Typography variant="body1" paragraph>
            Somos a <strong>primeira escola brasileira</strong> focada exclusivamente em 
            mecânica de bicicletas, com metodologia prática e reconhecimento nacional.
          </Typography>
        </motion.div>
      </div>
    </div>

    {/* SEGUNDA SEÇÃO - Foto DIREITA, Texto ESQUERDA */}
    <div className="sobre-container">
      <div className="sobre-conteudo">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Por que Escolher Bicicletas?
          </Typography>
          <Typography variant="body1" paragraph>
            • <strong>Mercado em crescimento</strong> de 25% ao ano<br/>
            • <strong>Baixo investimento</strong> para começar<br/>
            • <strong>Alta demanda</strong> por especialistas<br/>
            • <strong>Trabalho com propósito</strong> e sustentabilidade<br/>
          </Typography>
          
          <div className="estatisticas">
            <div className="estatistica">
              <Typography variant="h4" color="primary" fontWeight="bold">
                3.2K+
              </Typography>
              <Typography variant="body2">Mecânicos</Typography>
            </div>
            <div className="estatistica">
              <Typography variant="h4" color="primary" fontWeight="bold">
                94%
              </Typography>
              <Typography variant="body2">Empregados</Typography>
            </div>
            <div className="estatistica">
              <Typography variant="h4" color="primary" fontWeight="bold">
                15+
              </Typography>
              <Typography variant="body2">Cursos</Typography>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="sobre-imagem">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&h=400&q=80"
            alt="Mecânico trabalhando em bicicleta"
            className="sobre-img"
          />
        </motion.div>
      </div>
    </div>

    {/* TERCEIRA SEÇÃO - Foto ESQUERDA, Texto DIREITA */}
    <div className="sobre-container sobre-container-reverse">
      <div className="sobre-imagem">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1570870625148-2d2d9c9b49d3?auto=format&fit=crop&w=600&h=400&q=80"
            alt="Equipe do Clube do Mecânico"
            className="sobre-img"
          />
        </motion.div>
      </div>
      <div className="sobre-conteudo">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Nossa Metodologia
          </Typography>
          
          <div className="diferenciais">
            <div className="diferenciais-grid">
              {beneficios.map((beneficio, index) => (
                <div className="diferencial-item" key={index}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2">{beneficio}</Typography>
                  </Stack>
                </div>
              ))}
            </div>
          </div>
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<BuildIcon />}
              sx={{ borderRadius: 2 }}
            >
              Conheça Nossos Cursos
            </Button>
          </Box>
        </motion.div>
      </div>
    </div>

  </motion.div>
</Container>

      {/* Seção de Cursos */}
      <section id="cursos" className="cursos-section">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              align="center"
              fontWeight="bold"
              gutterBottom
              color="primary"
              className="section-title"
            >
              Nossos Cursos
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              className="section-subtitle"
            >
              Formação completa para todas as áreas da mecânica automotiva
            </Typography>

            <div className="cursos-grid">
              {cursos.map((curso, index) => (
                <motion.div
                  key={curso.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="curso-card-wrapper"
                >
                  <Card className="curso-card">
                    <div
                      className="curso-header"
                      style={{ backgroundColor: curso.cor }}
                    >
                      {curso.icone}
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        className="curso-titulo"
                      >
                        {curso.titulo}
                      </Typography>
                    </div>

                    <CardContent className="curso-conteudo">
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        className="curso-descricao"
                      >
                        {curso.descricao}
                      </Typography>

                      <div className="curso-tags">
                        <Chip
                          label={curso.duracao}
                          size="small"
                          color="primary"
                          variant="outlined"
                          className="curso-tag"
                        />
                        <Chip
                          label={curso.nivel}
                          size="small"
                          color="secondary"
                          className="curso-tag"
                        />
                      </div>
                    </CardContent>

                    <div className="curso-rodape">
                      <Button
                        fullWidth
                        variant="contained"
                        className="curso-botao"
                        style={{
                          backgroundColor: curso.cor,
                        }}
                      >
                        Saiba Mais
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="cursos-rodape">
              <Button
                variant="outlined"
                color="primary"
                size="large"
                className="botao-todos-cursos"
              >
                Ver Todos os Cursos
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Seção Call to Action */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="inscricao">
        <Paper className="cta-paper">
          <SchoolIcon className="cta-icone" />
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            className="cta-titulo"
          >
            Pronto para Transformar sua Carreira?
          </Typography>
          <Typography variant="h6" className="cta-subtitulo">
            Invista no seu futuro com os melhores cursos de mecânica do mercado
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            className="cta-botao"
          >
            Matricule-se Agora
          </Button>
        </Paper>
      </Container>

      {/* Footer/Contato */}
      <footer id="contato" className="footer">
        <Container maxWidth="lg">
          <div className="footer-conteudo">
            <div className="footer-coluna">
              <div className="footer-logo">
                <BuildIcon className="footer-icone-logo" />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  className="footer-titulo"
                >
                  CLUBE MECÂNICO
                </Typography>
              </div>
              <Typography variant="body2" className="footer-descricao">
                Formando os melhores profissionais da mecânica automotiva há
                mais de 15 anos. Excelência, tradição e inovação.
              </Typography>
              <div className="footer-redes-sociais">
                <IconButton
                  color="inherit"
                  size="small"
                  className="rede-social"
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="small"
                  className="rede-social"
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="small"
                  className="rede-social"
                >
                  <YouTubeIcon />
                </IconButton>
              </div>
            </div>

            <div className="footer-coluna">
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                className="footer-coluna-titulo"
              >
                Contato
              </Typography>
              <div className="footer-contatos">
                <div className="footer-contato">
                  <PhoneIcon className="contato-icone" />
                  <Typography variant="body2">(11) 99999-9999</Typography>
                </div>
                <div className="footer-contato">
                  <EmailIcon className="contato-icone" />
                  <Typography variant="body2">
                    contato@clubemecanico.com
                  </Typography>
                </div>
                <div className="footer-contato">
                  <LocationOnIcon className="contato-icone" />
                  <Typography variant="body2" className="contato-endereco">
                    Av. Automóvel, 1234 - Centro
                    <br />
                    São Paulo - SP
                  </Typography>
                </div>
              </div>
            </div>

            <div className="footer-coluna">
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                className="footer-coluna-titulo"
              >
                Horários
              </Typography>
              <Typography variant="body2" className="footer-horarios">
                <strong>Secretaria:</strong>
                <br />
                Segunda a Sexta: 8h às 18h
                <br />
                Sábado: 8h às 12h
              </Typography>
              <Typography variant="body2" className="footer-aulas">
                <strong>Aulas:</strong>
                <br />
                Manhã, Tarde e Noite
                <br />
                Turmas aos Sábados
              </Typography>
            </div>
          </div>

          <Divider className="footer-divisor" />

          <Typography
            variant="body2"
            align="center"
            className="footer-copyright"
          >
            © {new Date().getFullYear()} Clube Mecânico. Todos os direitos
            reservados.
          </Typography>
        </Container>
      </footer>
    </>
  );
};

export default Home;
