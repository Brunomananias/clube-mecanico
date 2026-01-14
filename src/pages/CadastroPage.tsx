/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/CadastroPage.tsx
import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  CalendarToday,
  LocationOn,
  Lock,
  AssignmentInd,
  Home,
  Numbers,
  Apartment,
  School,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../config/api";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";

interface EnderecoForm {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipo: string;
}

interface CriarContaForm {
  nome_Completo: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpf: string;
  telefone: string;
  data_Nascimento: Dayjs | null;
  tipo: number;
  endereco: EnderecoForm;
}

const CadastroPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<CriarContaForm>({
    nome_Completo: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    telefone: "",
    data_Nascimento: null,
    tipo: 0,
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      tipo: "principal",
    },
  });

  const formatarCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return cpf;
  };

  const formatarTelefone = (telefone: string) => {
    telefone = telefone.replace(/\D/g, "");
    if (telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (telefone.length === 10) {
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  };

  const formatarCEP = (cep: string) => {
    cep = cep.replace(/\D/g, "");
    if (cep.length === 8) {
      return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    return cep;
  };

  const buscarEnderecoPorCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: data.logradouro || "",
              bairro: data.bairro || "",
              cidade: data.localidade || "",
              estado: data.uf || "",
            },
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name?: string; value: unknown } }
  ) => {
    const { name, value } = "target" in e ? e.target : e;

    if (name === "cpf") {
      const formattedCPF = formatarCPF(value as string);
      setFormData((prev) => ({ ...prev, cpf: formattedCPF }));
    } else if (name === "telefone") {
      const formattedPhone = formatarTelefone(value as string);
      setFormData((prev) => ({ ...prev, telefone: formattedPhone }));
    } else if (name === "endereco.cep") {
      const formattedCEP = formatarCEP(value as string);
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, cep: formattedCEP },
      }));

      if (formattedCEP.length === 9) {
        buscarEnderecoPorCEP(formattedCEP);
      }
    } else if (name?.startsWith("endereco.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [field]: value as string },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name as string]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Email inválido");
      return;
    }

    // Preparar dados para envio
    const dadosEnvio = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, ""),
      telefone: formData.telefone.replace(/\D/g, ""),
      data_Nascimento: formData.data_Nascimento
        ? formData.data_Nascimento.format("YYYY-MM-DD")
        : null,
      endereco: {
        ...formData.endereco,
        cep: formData.endereco.cep.replace(/\D/g, ""),
      },
    };

    setLoading(true);

    try {
      const response = await api.post("/Auth/register", dadosEnvio);

      if (response.status === 200 || response.status === 201) {
        setSuccess("Conta criada com sucesso! Redirecionando para login...");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Erro ao criar conta:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
          <Card elevation={6} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              {/* Cabeçalho */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "white",
                    p: 2,
                    borderRadius: "50%",
                    mb: 2,
                  }}
                >
                  <AssignmentInd sx={{ fontSize: 40 }} />
                </Box>
                <Typography
                  variant="h4"
                  color="primary"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Criar Nova Conta
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Preencha seus dados para começar a aprender mecânica
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Alertas */}
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {success}
                </Alert>
              )}

              {/* Formulário */}
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Dados Pessoais */}
                  <Paper
                    elevation={1}
                    sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Person color="primary" />
                      Dados Pessoais
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        fullWidth
                        required
                        label="Nome Completo"
                        name="nome_Completo"
                        value={formData.nome_Completo}
                        onChange={handleChange}
                        placeholder="Digite seu nome completo"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        disabled={loading}
                        sx={{ bgcolor: "white" }}
                      />

                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                          fullWidth
                          required
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="seu.email@exemplo.com"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="action" />
                              </InputAdornment>
                            ),
                          }}
                          disabled={loading}
                          sx={{ flex: 1, minWidth: 200, bgcolor: "white" }}
                        />

                        <Box sx={{ flex: 1, minWidth: 200 }}>
                          <DatePicker
                            label="Data de Nascimento"
                            value={formData.data_Nascimento}
                            onChange={(newValue: any) => {
                              setFormData((prev) => ({
                                ...prev,
                                data_Nascimento: newValue,
                              }));
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                InputProps: {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CalendarToday color="action" />
                                    </InputAdornment>
                                  ),
                                },
                                sx: { bgcolor: "white" },
                              },
                            }}
                            disabled={loading}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                          fullWidth
                          label="CPF"
                          name="cpf"
                          value={formData.cpf}
                          onChange={handleChange}
                          placeholder="000.000.000-00"
                          disabled={loading}
                          sx={{ flex: 1, minWidth: 200, bgcolor: "white" }}
                          inputProps={{ maxLength: 14 }}
                        />

                        <TextField
                          fullWidth
                          label="Telefone"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                          disabled={loading}
                          sx={{ flex: 1, minWidth: 200, bgcolor: "white" }}
                        />
                      </Box>
                    </Box>
                  </Paper>

                  {/* Senha */}
                  <Paper
                    elevation={1}
                    sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Lock color="primary" />
                      Segurança
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <TextField
                        fullWidth
                        required
                        label="Senha"
                        name="senha"
                        type={showPassword ? "text" : "password"}
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={loading}
                        sx={{ flex: 1, minWidth: 200, bgcolor: "white" }}
                      />

                      <TextField
                        fullWidth
                        required
                        label="Confirmar Senha"
                        name="confirmarSenha"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        placeholder="Digite a senha novamente"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                edge="end"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={loading}
                        sx={{ flex: 1, minWidth: 200, bgcolor: "white" }}
                      />
                    </Box>
                  </Paper>

                  {/* Endereço */}
                  <Paper
                    elevation={1}
                    sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <LocationOn color="primary" />
                      Endereço
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                          fullWidth
                          label="CEP"
                          name="endereco.cep"
                          value={formData.endereco.cep}
                          onChange={handleChange}
                          placeholder="00000-000"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Numbers color="action" />
                              </InputAdornment>
                            ),
                          }}
                          disabled={loading}
                          sx={{ flex: 1, minWidth: 200, bgcolor: "white" }}
                        />

                        <TextField
                          fullWidth
                          label="Número"
                          name="endereco.numero"
                          value={formData.endereco.numero}
                          onChange={handleChange}
                          placeholder="123"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Home color="action" />
                              </InputAdornment>
                            ),
                          }}
                          disabled={loading}
                          sx={{ flex: 1, minWidth: 100, bgcolor: "white" }}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Logradouro"
                        name="endereco.logradouro"
                        value={formData.endereco.logradouro}
                        onChange={handleChange}
                        placeholder="Rua, Avenida, etc."
                        disabled={loading}
                        sx={{ bgcolor: "white" }}
                      />

                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                          fullWidth
                          label="Complemento"
                          name="endereco.complemento"
                          value={formData.endereco.complemento}
                          onChange={handleChange}
                          placeholder="Apto, Bloco, etc."
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Apartment color="action" />
                              </InputAdornment>
                            ),
                          }}
                          disabled={loading}
                          sx={{ flex: 2, minWidth: 200, bgcolor: "white" }}
                        />

                        <TextField
                          fullWidth
                          label="Bairro"
                          name="endereco.bairro"
                          value={formData.endereco.bairro}
                          onChange={handleChange}
                          disabled={loading}
                          sx={{ flex: 1, minWidth: 200, bgcolor: "white" }}
                        />
                      </Box>

                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                          fullWidth
                          label="Cidade"
                          name="endereco.cidade"
                          value={formData.endereco.cidade}
                          onChange={handleChange}
                          disabled={loading}
                          sx={{ flex: 2, minWidth: 200, bgcolor: "white" }}
                        />

                        <FormControl
                          fullWidth
                          sx={{ flex: 1, minWidth: 200, bgcolor: "white" }}
                        >
                          <InputLabel>Estado</InputLabel>
                          <Select
                            name="endereco.estado"
                            value={formData.endereco.estado}
                            onChange={handleChange}
                            label="Estado"
                            disabled={loading}
                          >
                            <MenuItem value="">Selecione</MenuItem>
                            {[
                              "AC",
                              "AL",
                              "AP",
                              "AM",
                              "BA",
                              "CE",
                              "DF",
                              "ES",
                              "GO",
                              "MA",
                              "MT",
                              "MS",
                              "MG",
                              "PA",
                              "PB",
                              "PR",
                              "PE",
                              "PI",
                              "RJ",
                              "RN",
                              "RS",
                              "RO",
                              "RR",
                              "SC",
                              "SP",
                              "SE",
                              "TO",
                            ].map((uf) => (
                              <MenuItem key={uf} value={uf}>
                                {uf}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Tipo de Conta */}
                  <Paper
                    elevation={1}
                    sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <School color="primary" />
                      Tipo de Conta
                    </Typography>

                    <FormControl fullWidth sx={{ bgcolor: "white" }}>
                      <InputLabel>Tipo de Usuário</InputLabel>
                      <Select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        label="Tipo de Usuário"
                        disabled={loading}
                      >
                        <MenuItem value={0}>
                          Aluno (Quero aprender mecânica)
                        </MenuItem>
                        <MenuItem value={1}>
                          Administrador (Gerenciar sistema)
                        </MenuItem>
                      </Select>
                      <FormHelperText>
                        {formData.tipo === 0
                          ? "Acesso a cursos e certificados"
                          : "Acesso completo ao sistema"}
                      </FormHelperText>
                    </FormControl>
                  </Paper>

                  {/* Botões */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        borderRadius: 2,
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Criar Conta"
                      )}
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/login")}
                      disabled={loading}
                      sx={{ borderRadius: 2 }}
                    >
                      Já tenho uma conta
                    </Button>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{ mt: 2 }}
                    >
                      Ao criar uma conta, você concorda com nossos{" "}
                      <Link component={RouterLink} to="/termos" color="primary">
                        Termos de Uso
                      </Link>{" "}
                      e{" "}
                      <Link
                        component={RouterLink}
                        to="/privacidade"
                        color="primary"
                      >
                        Política de Privacidade
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default CadastroPage;
