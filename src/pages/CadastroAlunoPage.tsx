import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Home,
  CalendarToday,
  AssignmentInd,
  Lock,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

const CadastroAlunoPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    celular: '',
    dataNascimento: null as Dayjs | null,
    email: '',
    senha: '',
    confirmarSenha: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const steps = ['Dados Pessoais', 'Contato e Acesso', 'Endereço'];

  const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleInputChange = (field: string, value: string | Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpa erro do campo quando o usuário começa a digitar
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCepChange = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    handleInputChange('cep', cepLimpo);
    
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
            complemento: data.complemento || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório';
      if (!formData.cpf.trim()) errors.cpf = 'CPF é obrigatório';
      else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
        errors.cpf = 'CPF inválido';
      }
      if (!formData.celular.trim()) errors.celular = 'Celular é obrigatório';
      if (!formData.dataNascimento) errors.dataNascimento = 'Data de nascimento é obrigatória';
      else {
        const idade = dayjs().diff(formData.dataNascimento, 'year');
        if (idade < 16) errors.dataNascimento = 'É necessário ter pelo menos 16 anos';
      }
    }

    if (step === 1) {
      if (!formData.email.trim()) errors.email = 'E-mail é obrigatório';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'E-mail inválido';
      }
      if (!formData.senha) errors.senha = 'Senha é obrigatória';
      else if (formData.senha.length < 6) {
        errors.senha = 'Senha deve ter pelo menos 6 caracteres';
      }
      if (!formData.confirmarSenha) errors.confirmarSenha = 'Confirme sua senha';
      else if (formData.senha !== formData.confirmarSenha) {
        errors.confirmarSenha = 'As senhas não coincidem';
      }
    }

    if (step === 2) {
      if (!formData.cep.trim()) errors.cep = 'CEP é obrigatório';
      if (!formData.logradouro.trim()) errors.logradouro = 'Logradouro é obrigatório';
      if (!formData.numero.trim()) errors.numero = 'Número é obrigatório';
      if (!formData.bairro.trim()) errors.bairro = 'Bairro é obrigatório';
      if (!formData.cidade.trim()) errors.cidade = 'Cidade é obrigatória';
      if (!formData.estado.trim()) errors.estado = 'Estado é obrigatório';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!aceitaTermos) {
      setFormErrors(prev => ({ ...prev, termos: 'Você precisa aceitar os termos' }));
      return;
    }

    if (validateStep(2)) {
      // Preparar dados para envio
      const dadosEnvio = {
        ...formData,
        dataNascimento: formData.dataNascimento?.format('YYYY-MM-DD'),
      };

      console.log('Dados para cadastro:', dadosEnvio);
      
      // Aqui você faria a chamada API para cadastrar o aluno
      // Exemplo:
      // try {
      //   const response = await fetch('/api/alunos/cadastrar', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(dadosEnvio)
      //   });
      //   
      //   if (response.ok) {
      //     navigate('/login', { 
      //       state: { 
      //         message: 'Cadastro realizado com sucesso! Faça login para continuar.' 
      //       }
      //     });
      //   }
      // } catch (error) {
      //   console.error('Erro ao cadastrar:', error);
      // }

      // Simulação de sucesso
      alert('Cadastro realizado com sucesso! Redirecionando para login...');
      navigate('/login');
    }
  };

  const formatCPF = (value: string) => {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length <= 11) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const cep = value.replace(/\D/g, '');
    if (cep.length <= 8) {
      return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        {/* Botão voltar */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Voltar para Home
        </Button>

        {/* Cabeçalho */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
            Cadastro de Aluno
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Complete seu cadastro para acessar todos os cursos
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Formulário */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                <Person sx={{ verticalAlign: 'middle', mr: 2 }} />
                Dados Pessoais
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  error={!!formErrors.nome}
                  helperText={formErrors.nome}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: '1 1 300px' }}
                />

                <TextField
                  fullWidth
                  label="CPF"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                  error={!!formErrors.cpf}
                  helperText={formErrors.cpf}
                  placeholder="000.000.000-00"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssignmentInd />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: '1 1 300px' }}
                />

                <TextField
                  fullWidth
                  label="Celular"
                  value={formData.celular}
                  onChange={(e) => handleInputChange('celular', formatPhone(e.target.value))}
                  error={!!formErrors.celular}
                  helperText={formErrors.celular}
                  placeholder="(11) 99999-9999"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: '1 1 300px' }}
                />

                <Box sx={{ flex: '1 1 300px' }}>
                  <DatePicker
                    label="Data de Nascimento"
                    value={formData.dataNascimento}
                    onChange={(date) => handleInputChange('dataNascimento', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!formErrors.dataNascimento,
                        helperText: formErrors.dataNascimento,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                <Email sx={{ verticalAlign: 'middle', mr: 2 }} />
                Contato e Acesso
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: '1 1 300px' }}
                />

                <TextField
                  fullWidth
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={(e) => handleInputChange('senha', e.target.value)}
                  error={!!formErrors.senha}
                  helperText={formErrors.senha}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: '1 1 300px' }}
                />

                <TextField
                  fullWidth
                  label="Confirmar Senha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmarSenha}
                  onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                  error={!!formErrors.confirmarSenha}
                  helperText={formErrors.confirmarSenha}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: '1 1 300px' }}
                />
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  A senha deve conter pelo menos 6 caracteres, incluindo letras e números.
                </Typography>
              </Alert>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                <Home sx={{ verticalAlign: 'middle', mr: 2 }} />
                Endereço
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <TextField
                  fullWidth
                  label="CEP"
                  value={formatCEP(formData.cep)}
                  onChange={(e) => handleCepChange(e.target.value)}
                  error={!!formErrors.cep}
                  helperText={formErrors.cep}
                  placeholder="00000-000"
                  sx={{ flex: '1 1 300px' }}
                />

                <TextField
                  fullWidth
                  label="Logradouro"
                  value={formData.logradouro}
                  onChange={(e) => handleInputChange('logradouro', e.target.value)}
                  error={!!formErrors.logradouro}
                  helperText={formErrors.logradouro}
                  sx={{ flex: '1 1 300px' }}
                />

                <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
                  <TextField
                    label="Número"
                    value={formData.numero}
                    onChange={(e) => handleInputChange('numero', e.target.value)}
                    error={!!formErrors.numero}
                    helperText={formErrors.numero}
                    sx={{ flex: '1 1 150px' }}
                  />

                  <TextField
                    fullWidth
                    label="Complemento"
                    value={formData.complemento}
                    onChange={(e) => handleInputChange('complemento', e.target.value)}
                    sx={{ flex: '1 1 300px' }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  error={!!formErrors.bairro}
                  helperText={formErrors.bairro}
                  sx={{ flex: '1 1 300px' }}
                />

                <TextField
                  fullWidth
                  label="Cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  error={!!formErrors.cidade}
                  helperText={formErrors.cidade}
                  sx={{ flex: '1 1 300px' }}
                />

                <TextField
                  fullWidth
                  select
                  label="Estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  error={!!formErrors.estado}
                  helperText={formErrors.estado}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ flex: '1 1 300px' }}
                >
                  <option value=""></option>
                  {estadosBrasil.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </TextField>
              </Box>

              {/* Termos e condições */}
              <Box sx={{ mt: 4 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={aceitaTermos}
                      onChange={(e) => {
                        setAceitaTermos(e.target.checked);
                        if (formErrors.termos) {
                          setFormErrors(prev => ({ ...prev, termos: '' }));
                        }
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Eu concordo com os{' '}
                      <Link href="/termos" target="_blank">
                        Termos de Uso
                      </Link>{' '}
                      e{' '}
                      <Link href="/privacidade" target="_blank">
                        Política de Privacidade
                      </Link>
                    </Typography>
                  }
                />
                {formErrors.termos && (
                  <Typography variant="caption" color="error">
                    {formErrors.termos}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Botões de navegação */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate('/') : handleBack}
              disabled={activeStep === 0}
            >
              {activeStep === 0 ? 'Cancelar' : 'Voltar'}
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                startIcon={<CheckCircle />}
                size="large"
                disabled={!aceitaTermos}
              >
                Finalizar Cadastro
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                size="large"
              >
                Próximo
              </Button>
            )}
          </Box>
        </Paper>

        {/* Link para login */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Já tem uma conta?{' '}
            <Link 
              href="/login" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
              fontWeight="bold"
            >
              Faça login
            </Link>
          </Typography>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default CadastroAlunoPage;