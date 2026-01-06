/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  type SelectChangeEvent,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Fingerprint,
  CalendarToday,
  LocationOn,
  Save,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../../config/api';

interface IEndereco {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipo: 'principal' | 'secundario' | string;
  ativo: boolean;
  dataCadastro: string;
  dataAtualizacao?: string;
}

interface IUsuario {
  id: number;
  email: string;
  tipo: number;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  ativo: boolean;
  dataCadastro: string;
  ultimoLogin: string;
  enderecos: IEndereco[];
}

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const AlunoPerfil: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editandoEndereco, setEditandoEndereco] = useState<number | null>(null);
  const [novoEndereco, setNovoEndereco] = useState(false);

  // Dados do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
  });

  // Dados do endereço
  const [enderecoForm, setEnderecoForm] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    tipo: 'principal' as 'principal' | 'secundario'
  });

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userType = localStorage.getItem("userType") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  // Buscar dados do usuário
  const carregarDadosUsuario = async () => {
    try {
      setLoading(true);
      const usuarioString = localStorage.getItem("user");
      
      if (usuarioString) {
        const usuarioObj = JSON.parse(usuarioString);
        const response = await api.get<IUsuario>(`/Usuarios/${usuarioObj.id}`);
        setUsuario(response.data);
        
        // Preencher formulário com dados atuais
        setFormData({
          nomeCompleto: response.data.nomeCompleto,
          email: response.data.email,
          telefone: response.data.telefone,
          cpf: response.data.cpf,
          dataNascimento: response.data.dataNascimento ? 
            new Date(response.data.dataNascimento).toISOString().split('T')[0] : '',
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do usuário:', error);
      setError(error.response?.data?.message || 'Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  // Buscar endereço pelo CEP
  const buscarCEP = async (cep: string) => {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      if (cepLimpo.length === 8) {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setEnderecoForm(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }));
        }
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  // Formatar CPF
  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Formatar telefone
  const formatarTelefone = (telefone: string) => {
    const cleaned = telefone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  // Manipular mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      // Permitir apenas números e limitar a 11 dígitos
      const cpfLimpo = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: cpfLimpo }));
    } else if (name === 'telefone') {
      // Permitir apenas números
      const telefoneLimpo = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: telefoneLimpo }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manipular mudanças no endereço
  // Manipular mudanças no endereço
const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  
  if (name === 'cep') {
    const cepLimpo = value.replace(/\D/g, '').slice(0, 8);
    setEnderecoForm(prev => ({ ...prev, [name]: cepLimpo }));
    
    // Buscar CEP quando tiver 8 dígitos
    if (cepLimpo.length === 8) {
      buscarCEP(cepLimpo);
    }
  } else if (name === 'numero') {
    const numeroLimpo = value.replace(/\D/g, '');
    setEnderecoForm(prev => ({ ...prev, [name]: numeroLimpo }));
  } else {
    setEnderecoForm(prev => ({ ...prev, [name]: value }));
  }
};

const handleEstadoChange = (e: SelectChangeEvent) => {
  setEnderecoForm(prev => ({ ...prev, estado: e.target.value as string }));
};

const handleTipoChange = (e: SelectChangeEvent) => {
  setEnderecoForm(prev => ({ ...prev, tipo: e.target.value as 'principal' | 'secundario' }));
};

  // Salvar dados do usuário
  const salvarDadosUsuario = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!usuario) return;

      // Validar dados obrigatórios
      if (!formData.nomeCompleto.trim()) {
        throw new Error('Nome completo é obrigatório');
      }

      if (!formData.email.trim()) {
        throw new Error('E-mail é obrigatório');
      }

      if (!formData.telefone.trim()) {
        throw new Error('Telefone é obrigatório');
      }

      // Formatar dados para envio
      const dadosAtualizados = {
        nomeCompleto: formData.nomeCompleto.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento || null,
      };

      console.log('Enviando dados:', dadosAtualizados);

      const response = await api.put(`/Usuarios/${usuario.id}`, dadosAtualizados);
      
      if (response.status === 200) {
        // Atualizar localStorage
        const usuarioAtualizado = { ...usuario, ...dadosAtualizados };
        localStorage.setItem("user", JSON.stringify(usuarioAtualizado));
        localStorage.setItem("userName", usuarioAtualizado.nomeCompleto);
        localStorage.setItem("userEmail", usuarioAtualizado.email);
        
        setSuccess('Dados atualizados com sucesso!');
        await carregarDadosUsuario(); // Recarregar dados atualizados
      }
    } catch (error: any) {
      console.error('Erro ao salvar dados:', error);
      setError(error.response?.data?.message || error.message || 'Erro ao salvar dados');
    } finally {
      setSaving(false);
    }
  };

  // Salvar/atualizar endereço
  const salvarEndereco = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!usuario) return;

      // Validar dados do endereço
      if (!enderecoForm.cep.trim()) {
        throw new Error('CEP é obrigatório');
      }

      if (!enderecoForm.logradouro.trim()) {
        throw new Error('Logradouro é obrigatório');
      }

      if (!enderecoForm.numero.trim()) {
        throw new Error('Número é obrigatório');
      }

      if (!enderecoForm.bairro.trim()) {
        throw new Error('Bairro é obrigatório');
      }

      if (!enderecoForm.cidade.trim()) {
        throw new Error('Cidade é obrigatório');
      }

      if (!enderecoForm.estado.trim()) {
        throw new Error('Estado é obrigatório');
      }

      const dadosEndereco = {
        ...enderecoForm,
        cep: enderecoForm.cep.replace(/\D/g, ''),
        ativo: true
      };

      let response;
      if (editandoEndereco) {
        // Atualizar endereço existente
        response = await api.put(`/Enderecos/${editandoEndereco}`, dadosEndereco);
      } else {
        // Criar novo endereço
        response = await api.post(`/Enderecos`, {
          ...dadosEndereco,
          usuarioId: usuario.id
        });
      }

      if (response.status === 200 || response.status === 201) {
        setSuccess(editandoEndereco ? 'Endereço atualizado com sucesso!' : 'Endereço adicionado com sucesso!');
        setEditandoEndereco(null);
        setNovoEndereco(false);
        setEnderecoForm({
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          tipo: 'principal'
        });
        await carregarDadosUsuario(); // Recarregar dados atualizados
      }
    } catch (error: any) {
      console.error('Erro ao salvar endereço:', error);
      setError(error.response?.data?.message || error.message || 'Erro ao salvar endereço');
    } finally {
      setSaving(false);
    }
  };

  // Editar endereço existente
  const editarEndereco = (endereco: IEndereco) => {
    setEditandoEndereco(endereco.id);
    setNovoEndereco(true);
    setEnderecoForm({
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      complemento: endereco.complemento || '',
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      tipo: endereco.tipo as 'principal' | 'secundario'
    });
  };

  // Remover endereço
  const removerEndereco = async (enderecoId: number) => {
    try {
      if (!window.confirm('Tem certeza que deseja remover este endereço?')) {
        return;
      }

      await api.delete(`/Enderecos/${enderecoId}`);
      setSuccess('Endereço removido com sucesso!');
      await carregarDadosUsuario(); // Recarregar dados atualizados
    } catch (error: any) {
      console.error('Erro ao remover endereço:', error);
      setError(error.response?.data?.message || 'Erro ao remover endereço');
    }
  };

  // Inicializar
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar
          userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
          userName={isLoggedIn ? userName : undefined}
          userEmail={isLoggedIn ? userEmail : undefined}
        />
        <Box sx={{ mt: 10, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Carregando...
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar
        userType={isLoggedIn ? (userType as "admin" | "aluno") : null}
        userName={isLoggedIn ? usuario?.nomeCompleto : undefined}
        userEmail={isLoggedIn ? usuario?.email : undefined}
      />

      <Box sx={{ mt: 10, mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Cabeçalho */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <IconButton onClick={() => navigate('/aluno/dashboard')}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight="bold">
                Editar Perfil
              </Typography>
            </Box>

            {/* Avatar e informações básicas */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
                <Person sx={{ fontSize: 50 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {usuario?.nomeCompleto}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {usuario?.email}
                </Typography>
                <Chip 
                  label={usuario?.tipo === 0 ? 'ALUNO' : 'ADMIN'}
                  color={usuario?.tipo === 0 ? 'primary' : 'secondary'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Mensagens de erro/sucesso */}
          <Snackbar 
            open={!!error} 
            autoHideDuration={6000} 
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Snackbar>

          <Snackbar 
            open={!!success} 
            autoHideDuration={6000} 
            onClose={() => setSuccess(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          </Snackbar>

          {/* Formulário de dados pessoais */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person />
              Dados Pessoais
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={formatarTelefone(formData.telefone)}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <TextField
                  fullWidth
                  label="CPF"
                  name="cpf"
                  value={formatarCPF(formData.cpf)}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Fingerprint />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <TextField
                  fullWidth
                  label="Data de Nascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={salvarDadosUsuario}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Dados Pessoais'}
              </Button>
            </Box>
          </Paper>

          {/* Endereços */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn />
                Endereços
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setNovoEndereco(true);
                  setEditandoEndereco(null);
                  setEnderecoForm({
                    cep: '',
                    logradouro: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    estado: '',
                    tipo: 'principal'
                  });
                }}
              >
                Novo Endereço
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {/* Formulário de endereço (apenas quando em modo de edição/criação) */}
            {novoEndereco && (
              <Card sx={{ mb: 3, border: '1px solid', borderColor: 'primary.main' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {editandoEndereco ? 'Editar Endereço' : 'Novo Endereço'}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
                      <TextField
                        fullWidth
                        label="CEP"
                        name="cep"
                        value={enderecoForm.cep}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </Box>

                    <Box sx={{ flex: '2 1 300px', minWidth: 300 }}>
                      <TextField
                        fullWidth
                        label="Logradouro"
                        name="logradouro"
                        value={enderecoForm.logradouro}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 150px', minWidth: 150 }}>
                      <TextField
                        fullWidth
                        label="Número"
                        name="numero"
                        value={enderecoForm.numero}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
                      <TextField
                        fullWidth
                        label="Complemento"
                        name="complemento"
                        value={enderecoForm.complemento}
                        onChange={handleEnderecoChange}
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
                      <TextField
                        fullWidth
                        label="Bairro"
                        name="bairro"
                        value={enderecoForm.bairro}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
                      <TextField
                        fullWidth
                        label="Cidade"
                        name="cidade"
                        value={enderecoForm.cidade}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 150px', minWidth: 150 }}>
                      <FormControl fullWidth required>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            name="estado"
                            value={enderecoForm.estado}
                            onChange={handleEstadoChange}
                            label="Estado"
                        >
                            {estadosBrasil.map((estado) => (
                            <MenuItem key={estado} value={estado}>
                                {estado}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ flex: '1 1 150px', minWidth: 150 }}>
                     <FormControl fullWidth>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            name="tipo"
                            value={enderecoForm.tipo}
                            onChange={handleTipoChange}
                            label="Tipo"
                        >
                            <MenuItem value="principal">Principal</MenuItem>
                            <MenuItem value="secundario">Secundário</MenuItem>
                        </Select>
                        </FormControl>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setNovoEndereco(false);
                        setEditandoEndereco(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={salvarEndereco}
                      disabled={saving}
                    >
                      {saving ? 'Salvando...' : 'Salvar Endereço'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Lista de endereços existentes */}
            {usuario?.enderecos && usuario.enderecos.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {usuario.enderecos
                  .filter(endereco => endereco.ativo)
                  .map((endereco) => (
                    <Box sx={{ flex: '1 1 300px', minWidth: 300 }} key={endereco.id}>
                      <Card 
                        sx={{ 
                          borderLeft: '4px solid',
                          borderLeftColor: endereco.tipo === 'principal' ? 'primary.main' : 'grey.400'
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6">
                              {endereco.tipo === 'principal' ? 'Endereço Principal' : 'Endereço Secundário'}
                            </Typography>
                            {endereco.tipo === 'principal' && (
                              <Chip label="PRINCIPAL" color="primary" size="small" />
                            )}
                          </Box>

                          <Typography variant="body2" color="text.secondary" paragraph>
                            <strong>Endereço:</strong> {endereco.logradouro}, {endereco.numero}
                            {endereco.complemento && ` - ${endereco.complemento}`}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" paragraph>
                            <strong>Bairro:</strong> {endereco.bairro}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" paragraph>
                            <strong>Cidade/Estado:</strong> {endereco.cidade} - {endereco.estado}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            <strong>CEP:</strong> {endereco.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => editarEndereco(endereco)}
                            >
                              Editar
                            </Button>
                            {endereco.tipo !== 'principal' && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => removerEndereco(endereco.id)}
                              >
                                Remover
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
              </Box>
            ) : (
              <Alert severity="info">
                Nenhum endereço cadastrado. Adicione um endereço para receber certificados e materiais.
              </Alert>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default AlunoPerfil;