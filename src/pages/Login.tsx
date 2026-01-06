/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Divider,
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
import { authService } from "../services/authService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<0 | 1>(0); // 0 = aluno, 1 = admin
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

    try {
      // Autenticação REAL com o backend
      const credentials = {
        email: email.trim(),
        senha: password,
        tipo: userType
      };

      await authService.login(credentials);
      
      // Redirecionar baseado no tipo de usuário
      if (userType === 1) {
        navigate("/admin/dashboard");
      } else {
        navigate("/aluno/dashboard");
      }
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Mensagens de erro mais específicas
      if (error.message === 'Credenciais inválidas') {
        setError("Email ou senha incorretos");
      } else if (error.message.includes('conectar')) {
        setError("Servidor indisponível. Tente novamente mais tarde.");
      } else {
        setError(error.message || "Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeLabel = (type: 0 | 1) => {
    return type === 1 ? "Administrador" : "Aluno";
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
                Área do {getUserTypeLabel(userType)}
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
                  variant={userType === 0 ? "contained" : "outlined"}
                  color="primary"
                  startIcon={<SchoolIcon />}
                  onClick={() => setUserType(0)}
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
                  variant={userType === 1 ? "contained" : "outlined"}
                  color="secondary"
                  startIcon={<AdminIcon />}
                  onClick={() => setUserType(1)}
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

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
            </Divider>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2" align="center" gutterBottom>
                {userType === 0
                  ? "Não tem uma conta de aluno?"
                  : "Acesso restrito a administradores"}
              </Typography>
              
              {userType === 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/cadastrar")}
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
              {userType === 1 ? (
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