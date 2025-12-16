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
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import BuildIcon from "@mui/icons-material/Build";
import EngineeringIcon from "@mui/icons-material/Engineering";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SpeedIcon from "@mui/icons-material/Speed";
import SettingsIcon from "@mui/icons-material/Settings";
import ElectricBikeIcon from "@mui/icons-material/ElectricBike";
import PsychologyIcon from "@mui/icons-material/Psychology";
import VerifiedIcon from "@mui/icons-material/Verified";
import "./Home.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType') || '';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    handleMenuClose();
    window.location.reload();
  };

  // Cursos especializados em bicicletas
  const cursos = [
    {
      id: 1,
      titulo: "Mecânica de Bicicletas Básica",
      descricao: "Aprenda os fundamentos da manutenção de bicicletas, ajustes essenciais e reparos comuns.",
      icone: <DirectionsBikeIcon fontSize="large" />,
      duracao: "40 horas",
      nivel: "Iniciante",
      cor: "#1976d2",
      destaque: "Essencial para ciclistas"
    },
    {
      id: 2,
      titulo: "Sistemas de Suspensão",
      descricao: "Especialização em manutenção e regulagem de amortecedores e garfos de mountain bike.",
      icone: <SettingsIcon fontSize="large" />,
      duracao: "60 horas",
      nivel: "Avançado",
      cor: "#2e7d32",
      destaque: "Para mecânicos profissionais"
    },
    {
      id: 3,
      titulo: "Freios Hidráulicos",
      descricao: "Diagnóstico e reparo completo de sistemas de freio hidráulico, sangria e manutenção.",
      icone: <EngineeringIcon fontSize="large" />,
      duracao: "35 horas",
      nivel: "Intermediário",
      cor: "#d32f2f",
      destaque: "Segurança em primeiro lugar"
    },
    {
      id: 4,
      titulo: "Transmissão e Câmbios",
      descricao: "Ajuste fino e manutenção de câmbios, cassetes, correntes e sistemas de transmissão.",
      icone: <SpeedIcon fontSize="large" />,
      duracao: "45 horas",
      nivel: "Intermediário",
      cor: "#9c27b0",
      destaque: "Performance garantida"
    },
    {
      id: 5,
      titulo: "Bicicletas Elétricas",
      descricao: "Curso especializado em sistemas elétricos, motores, baterias e controladores de e-bikes.",
      icone: <ElectricBikeIcon fontSize="large" />,
      duracao: "50 horas",
      nivel: "Avançado",
      cor: "#ed6c02",
      destaque: "Mercado em expansão"
    },
    {
      id: 6,
      titulo: "Gestão de Oficina de Bikes",
      descricao: "Aprenda a administrar uma oficina especializada com técnicas modernas de gestão.",
      icone: <PsychologyIcon fontSize="large" />,
      duracao: "30 horas",
      nivel: "Todos os níveis",
      cor: "#0288d1",
      destaque: "Empreendedorismo"
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

  // Navbar para usuário logado
  const renderLoggedInNavbar = () => (
    <AppBar position="fixed" color="primary" elevation={3}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div className="nav-logo">
            <DirectionsBikeIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              className="logo-text"
              sx={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              CLUBE DO MECÂNICO
            </Typography>
          </div>

          {!isMobile ? (
            <div className="nav-links">
              <Button 
                color="inherit" 
                className="nav-link"
                onClick={() => {
                  const element = document.getElementById('inicio');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Início
              </Button>
              <Button 
                color="inherit" 
                className="nav-link"
                onClick={() => {
                  const element = document.getElementById('sobre');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Sobre
              </Button>
              <Button 
                color="inherit" 
                className="nav-link"
                onClick={() => {
                  const element = document.getElementById('cursos');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Cursos
              </Button>
              <Button 
                color="inherit" 
                className="nav-link"
                onClick={() => {
                  const element = document.getElementById('contato');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contato
              </Button>
              
              <Button
                color="inherit"
                className="nav-link"
                startIcon={<ShoppingCartIcon />}
                onClick={() => navigate('/carrinho')}
              >
                Carrinho
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                className="nav-button"
                startIcon={<DashboardIcon />}
                onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/aluno/dashboard')}
              >
                Meu Dashboard
              </Button>

              <IconButton
                onClick={handleMenuClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {userEmail}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => navigate('/carrinho')}>
                  <ShoppingCartIcon fontSize="small" sx={{ mr: 2 }} />
                  Meu Carrinho
                </MenuItem>
                <MenuItem onClick={() => navigate('/cursos')}>
                  <SchoolIcon fontSize="small" sx={{ mr: 2 }} />
                  Meus Cursos
                </MenuItem>
                <MenuItem onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/aluno/dashboard')}>
                  <DashboardIcon fontSize="small" sx={{ mr: 2 }} />
                  Dashboard
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ExitToAppIcon fontSize="small" sx={{ mr: 2 }} />
                  Sair
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <IconButton color="inherit">
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );

  // Navbar para visitante
  const renderVisitorNavbar = () => (
    <AppBar position="fixed" color="primary" elevation={3}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div className="nav-logo">
            <DirectionsBikeIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              className="logo-text"
              sx={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              CLUBE DO MECÂNICO
            </Typography>
          </div>

          {!isMobile ? (
            <div className="nav-links">
              <Button 
                color="inherit" 
                className="nav-link"
                onClick={() => {
                  const element = document.getElementById('inicio');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Início
              </Button>
              <Button 
                color="inherit" 
                className="nav-link"
                onClick={() => {
                  const element = document.getElementById('sobre');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Sobre
              </Button>
              <Button 
                color="inherit" 
                className="nav-link"
                onClick={() => {
                  const element = document.getElementById('cursos');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Cursos
              </Button>
              <Button 
                color="inherit" 
                className="nav-link"
                onClick={() => {
                  const element = document.getElementById('contato');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contato
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                className="nav-button"
                onClick={() => navigate("/cadastrar")}
              >
                Matricule-se
              </Button>
              
              <Button
                color="inherit"
                className="nav-link"
                onClick={() => navigate("/login")}
              >
                Login
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
  );

  return (
    <>
      {isLoggedIn ? renderLoggedInNavbar() : renderVisitorNavbar()}
      <Toolbar />

      {/* Seção Hero */}
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
                  variant="h1"
                  fontWeight="bold"
                  gutterBottom
                  className="hero-title"
                  sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                >
                  O Seu Próximo Nível Começa Aqui
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mb: 3, opacity: 0.9 }}
                  className="hero-subtitle"
                >
                  Mais do que uma escola, somos um centro de excelência em mecânica de bicicletas
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, fontSize: "1.1rem", maxWidth: "800px" }}
                  className="hero-description"
                >
                  Seja bem-vindo ao Clube do Mecânico, a única referência em cursos de mecânica 
                  de bicicletas na nossa região. Nascemos da paixão por duas rodas e da crença 
                  de que o conhecimento técnico é o elo que transforma ciclistas e mecânicos 
                  em verdadeiros mestres do equipamento.
                </Typography>
                <div className="hero-buttons">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    className="hero-button"
                    onClick={() => navigate("/cursos")}
                    startIcon={<DirectionsBikeIcon />}
                  >
                    Ver Cursos
                  </Button>
                  {isLoggedIn ? (
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      className="hero-button-outline"
                      onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/aluno/dashboard')}
                      startIcon={<DashboardIcon />}
                    >
                      Acessar Dashboard
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      className="hero-button-outline"
                      onClick={() => navigate("/cadastrar")}
                      startIcon={<SchoolIcon />}
                    >
                      Começar Agora
                    </Button>
                  )}
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
                    alt="Logo Clube do Mecânico"
                    sx={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
          
          {isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Paper 
                sx={{ 
                  mt: 4, 
                  p: 3, 
                  bgcolor: 'primary.light',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <VerifiedIcon color="success" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Bem-vindo de volta, {userEmail}!
                  </Typography>
                  <Typography variant="body2">
                    Continue sua jornada de aprendizado em mecânica de bicicletas.
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/aluno/dashboard')}
                  startIcon={<DashboardIcon />}
                >
                  Ir para Dashboard
                </Button>
              </Paper>
            </motion.div>
          )}
        </Container>
      </section>

      {/* Seção: Para Quem é o Clube? */}
      <section className="para-quem-section" style={{ backgroundColor: '#ffffffff', padding: '80px 0' }}>
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
              Para Quem é o Clube?
            </Typography>

            <div className="publico-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
              {/* Card Mecânicos Profissionais */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card sx={{ height: '100%', borderRadius: 2, overflow: 'hidden', border: '2px solid', borderColor: 'primary.main' }}>
                  <div style={{ backgroundColor: 'primary.main', padding: '20px', textAlign: 'center' }}>
                    <EngineeringIcon sx={{ fontSize: 48, color: 'white' }} />
                  </div>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                      Mecânicos Profissionais
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                      Oferecemos o caminho para a sua especialização. Se você busca aprofundar seu 
                      conhecimento em sistemas específicos (suspensão, hidráulica, eletrônicos) e se 
                      destacar no mercado, nossos cursos são a chave para elevar sua carreira.
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip label="Especialização" size="small" color="primary" />
                      <Chip label="Carreira" size="small" color="secondary" />
                      <Chip label="Mercado" size="small" />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card Ciclistas e Entusiastas */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card sx={{ height: '100%', borderRadius: 2, overflow: 'hidden', border: '2px solid', borderColor: 'secondary.main' }}>
                  <div style={{ backgroundColor: 'secondary.main', padding: '20px', textAlign: 'center' }}>
                    <PedalBikeIcon sx={{ fontSize: 48, color: 'white' }} />
                  </div>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom color="secondary">
                      Ciclistas e Entusiastas
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                      Sua bicicleta é uma máquina complexa. Aprender a sua mecânica não é um luxo, 
                      é uma necessidade. Nossos cursos dão a autonomia necessária para que você 
                      identifique e solucione pequenos reparos, garantindo que um pneu furado ou 
                      um ajuste de câmbio não interrompam seu treino ou comprometam sua performance.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Autonomia" size="small" color="primary" />
                      <Chip label="Segurança" size="small" color="success" />
                      <Chip label="Performance" size="small" />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Seção Sobre */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="sobre">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
            color="primary"
            className="section-title"
          >
            Onde a Técnica Encontra a Paixão
          </Typography>
          
          {/* Texto introdutório */}
          <Paper sx={{ p: 4, mb: 6, borderRadius: 2, bgcolor: 'primary.light' }}>
            <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem' }}>
              Em um mercado que muitas vezes segue o mesmo caminho, o Clube do Mecânico tem uma missão: 
              ser autêntico e único. O que você encontra aqui é uma metodologia voltada para a prática 
              real, cobrindo desde o básico essencial até as mais avançadas especializações.
            </Typography>
            <Typography variant="h6" align="center" fontWeight="bold" color="black">
              Junte-se a nós. Seja para buscar a maestria na sua profissão ou a confiança para cuidar 
              do seu equipamento, o Clube do Mecânico é o lugar onde a técnica encontra a paixão.
            </Typography>
          </Paper>

          {/* Diferenciais */}
          <div className="sobre-container">
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
                  Por que Somos Diferentes?
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
                    onClick={() => navigate("/cursos")}
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
      <section id="cursos" className="cursos-section" style={{ backgroundColor: '#f5f5f5' }}>
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
              Nossos Cursos Especializados
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              className="section-subtitle"
              sx={{ mb: 4 }}
            >
              Formação completa em mecânica de bicicletas
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
                  <Card className="curso-card" sx={{ height: '100%' }}>
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

                    <CardContent className="curso-conteudo" sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        className="curso-descricao"
                      >
                        {curso.descricao}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={curso.destaque}
                          size="small"
                          color="info"
                          variant="filled"
                          sx={{ mb: 1 }}
                        />
                      </Box>

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
                        onClick={() => navigate(`/curso/${curso.id}`)}
                        startIcon={<DirectionsBikeIcon />}
                      >
                        {isLoggedIn ? 'Ver Detalhes' : 'Saiba Mais'}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="cursos-rodape" style={{ textAlign: 'center', marginTop: '40px' }}>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                className="botao-todos-cursos"
                onClick={() => navigate("/cursos")}
                startIcon={<SchoolIcon />}
              >
                Ver Todos os Cursos
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Seção Call to Action */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="inscricao">
        <Paper className="cta-paper" sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)' }}>
          <DirectionsBikeIcon className="cta-icone" sx={{ fontSize: 64, color: 'white' }} />
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            className="cta-titulo"
            sx={{ color: 'white' }}
          >
            Pronto para Transformar sua Relação com as Bicicletas?
          </Typography>
          <Typography variant="h6" className="cta-subtitulo" sx={{ color: 'white', opacity: 0.9, mb: 4 }}>
            Seja para profissionalizar sua carreira ou para ganhar autonomia no pedal
          </Typography>
          {isLoggedIn ? (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className="cta-botao"
              onClick={() => navigate("/cursos")}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
              startIcon={<DirectionsBikeIcon />}
            >
              Explorar Cursos
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className="cta-botao"
              onClick={() => navigate("/cadastrar")}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
              startIcon={<SchoolIcon />}
            >
              Matricule-se Agora
            </Button>
          )}
        </Paper>
      </Container>

      {/* Footer/Contato */}
      <footer id="contato" className="footer" style={{ backgroundColor: '#2c3e50' }}>
        <Container maxWidth="lg">
          <div className="footer-conteudo">
            <div className="footer-coluna">
              <div className="footer-logo">
                <DirectionsBikeIcon className="footer-icone-logo" sx={{ fontSize: 32, color: 'white' }} />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  className="footer-titulo"
                  sx={{ color: 'white' }}
                >
                  CLUBE DO MECÂNICO
                </Typography>
              </div>
              <Typography variant="body2" className="footer-descricao" sx={{ color: '#b0bec5', mt: 2 }}>
                A única referência em cursos de mecânica de bicicletas na região. 
                Centro de excelência onde a técnica encontra a paixão.
              </Typography>
              <div className="footer-redes-sociais" style={{ marginTop: '20px' }}>
                <IconButton
                  color="inherit"
                  size="small"
                  className="rede-social"
                  sx={{ color: 'white' }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="small"
                  className="rede-social"
                  sx={{ color: 'white' }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="small"
                  className="rede-social"
                  sx={{ color: 'white' }}
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
                sx={{ color: 'white' }}
              >
                Contato
              </Typography>
              <div className="footer-contatos">
                <div className="footer-contato">
                  <PhoneIcon className="contato-icone" sx={{ color: '#90caf9' }} />
                  <Typography variant="body2" sx={{ color: '#b0bec5' }}>(11) 99999-9999</Typography>
                </div>
                <div className="footer-contato">
                  <EmailIcon className="contato-icone" sx={{ color: '#90caf9' }} />
                  <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                    contato@clubedomecanico.com
                  </Typography>
                </div>
                <div className="footer-contato">
                  <LocationOnIcon className="contato-icone" sx={{ color: '#90caf9' }} />
                  <Typography variant="body2" className="contato-endereco" sx={{ color: '#b0bec5' }}>
                    Av. das Bicicletas, 1234 - Centro
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
                sx={{ color: 'white' }}
              >
                {isLoggedIn ? 'Acesso Rápido' : 'Horários'}
              </Typography>
              {isLoggedIn ? (
                <>
                  <Button
                    variant="text"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', mb: 1, color: 'white' }}
                    onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/aluno/dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', mb: 1, color: 'white' }}
                    onClick={() => navigate('/cursos')}
                  >
                    Meus Cursos
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', color: 'white' }}
                    onClick={() => navigate('/carrinho')}
                  >
                    Meu Carrinho
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="body2" className="footer-horarios" sx={{ color: '#b0bec5' }}>
                    <strong style={{ color: 'white' }}>Secretaria:</strong>
                    <br />
                    Segunda a Sexta: 8h às 18h
                    <br />
                    Sábado: 8h às 12h
                  </Typography>
                  <Typography variant="body2" className="footer-aulas" sx={{ color: '#b0bec5', mt: 2 }}>
                    <strong style={{ color: 'white' }}>Aulas:</strong>
                    <br />
                    Manhã, Tarde e Noite
                    <br />
                    Turmas aos Sábados
                  </Typography>
                </>
              )}
            </div>
          </div>

          <Divider className="footer-divisor" sx={{ borderColor: '#455a64', my: 4 }} />

          <Typography
            variant="body2"
            align="center"
            className="footer-copyright"
            sx={{ color: '#b0bec5' }}
          >
            © {new Date().getFullYear()} Clube do Mecânico. Todos os direitos reservados.
            <br />
            "Onde a técnica encontra a paixão"
          </Typography>
        </Container>
      </footer>
    </>
  );
};

export default Home;