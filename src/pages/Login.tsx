/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  PersonOutline as PersonIcon,
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"aluno" | "admin">("aluno");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validações básicas
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido");
      setLoading(false);
      return;
    }

    // Simulação de login (em um sistema real, você faria uma chamada API)
    setTimeout(() => {
      setLoading(false);
      
      // Credenciais de exemplo para demonstração
      if (userType === "admin") {
        if (email === "admin@clube.com" && password === "admin123") {
          // Login bem-sucedido como admin
          localStorage.setItem("userType", "admin");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          navigate("/admin/dashboard");
        } else {
          setError("Credenciais de administrador inválidas");
        }
      } else {
        // Login como aluno (simulação)
        localStorage.setItem("userType", "aluno");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        navigate("/aluno/dashboard");
      }
    }, 1500);
  };

  const handleDemoLogin = (type: "admin" | "aluno") => {
    if (type === "admin") {
      setEmail("admin@clube.com");
      setPassword("admin123");
      setUserType("admin");
    } else {
      setEmail("aluno@clube.com");
      setPassword("aluno123");
      setUserType("aluno");
    }
  };

  return (
    <Container component="main" maxWidth="sm" className="login-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} className="login-paper">
          {/* Logo/Cabeçalho */}
          <Box className="login-header">
            <Avatar className="login-avatar">
              <LockIcon />
            </Avatar>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography
                variant="h4"
                className="login-title"
                sx={{
                  background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                }}
              >
                CLUBE DO MECÂNICO
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Área do {userType === "admin" ? "Administrador" : "Aluno"}
              </Typography>
            </Box>
          </Box>

          {/* Seletor de Tipo de Usuário */}
          <Box className="user-type-selector">
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ flex: { xs: "1 1 100%", sm: "1" } }}>
                <Button
                  fullWidth
                  variant={userType === "aluno" ? "contained" : "outlined"}
                  color="primary"
                  startIcon={<SchoolIcon />}
                  onClick={() => setUserType("aluno")}
                  className="user-type-button"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderWidth: 2,
                  }}
                >
                  Aluno
                </Button>
              </Box>
              <Box sx={{ flex: { xs: "1 1 100%", sm: "1" } }}>
                <Button
                  fullWidth
                  variant={userType === "admin" ? "contained" : "outlined"}
                  color="secondary"
                  startIcon={<AdminIcon />}
                  onClick={() => setUserType("admin")}
                  className="user-type-button"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderWidth: 2,
                  }}
                >
                  Administrador
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Indicador de Tipo Ativo */}
          <Box className="user-type-indicator" sx={{ mt: 2, mb: 3 }}>
            <Chip
              icon={userType === "admin" ? <AdminIcon /> : <SchoolIcon />}
              label={
                userType === "admin"
                  ? "Modo Administrador"
                  : "Modo Aluno"
              }
              color={userType === "admin" ? "secondary" : "primary"}
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          {/* Formulário */}
          <Box component="form" onSubmit={handleSubmit} className="login-form">
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />

            <Box className="login-options">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Lembrar-me"
              />
              <Link href="/recuperar-senha" variant="body2">
                Esqueceu a senha?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              className="login-button"
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            {/* Login Rápido para Demonstração */}
            <Box className="demo-login" sx={{ mt: 3, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Demonstração rápida:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 1,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ flex: { xs: "1 1 100%", sm: "1" } }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => handleDemoLogin("aluno")}
                    disabled={loading}
                    startIcon={<SchoolIcon />}
                  >
                    Login Aluno Demo
                  </Button>
                </Box>
                <Box sx={{ flex: { xs: "1 1 100%", sm: "1" } }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    color="secondary"
                    onClick={() => handleDemoLogin("admin")}
                    disabled={loading}
                    startIcon={<AdminIcon />}
                  >
                    Login Admin Demo
                  </Button>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
            </Divider>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2" align="center" gutterBottom>
                {userType === "aluno"
                  ? "Não tem uma conta de aluno?"
                  : "Acesso restrito a administradores"}
              </Typography>
              
              {userType === "aluno" && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/cadastro")}
                  disabled={loading}
                >
                  Criar Conta de Aluno
                </Button>
              )}
              
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Voltar para o site
              </Button>
            </Box>
          </Box>

          {/* Informações Adicionais */}
          <Box className="login-info" sx={{ mt: 4, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              <strong>Informações:</strong>
              {userType === "admin" ? (
                " Acesso ao painel administrativo para gerenciar cursos, alunos e conteúdo."
              ) : (
                " Acesso aos seus cursos, certificados, materiais e suporte."
              )}
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login;