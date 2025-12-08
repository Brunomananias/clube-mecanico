/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
} from '@mui/material';
import {
  Close,
  Save,
  AddPhotoAlternate,
  Description,
  CheckCircle,
  School,
  Schedule,
  People,
  AttachMoney,
} from '@mui/icons-material';
import axios from 'axios';

interface CreateCourseModalProps {
  open: boolean;
  onClose: () => void;
  onCourseCreated?: () => void;
}

const CriarCursoModal: React.FC<CreateCourseModalProps> = ({ open, onClose, onCourseCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    descricaoDetalhada: '',
    fotoUrl: '',
    valor: '',
    duracaoHoras: '',
    nivel: 'Iniciante',
    maxAlunos: '',
    conteudoProgramatico: '',
    certificadoDisponivel: true,
  });

  const steps = ['Informações Básicas', 'Detalhes do Curso', 'Valores'];

  const niveis = [
    { value: 'Iniciante', label: 'Iniciante' },
    { value: 'Intermediário', label: 'Intermediário' },
    { value: 'Avançado', label: 'Avançado' },
    { value: 'Especialista', label: 'Especialista' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    if (error) setError(null);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.codigo.trim()) {
        setError('Código do curso é obrigatório');
        return;
      }
      if (!formData.nome.trim()) {
        setError('Nome do curso é obrigatório');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  const handleReset = () => {
    setFormData({
      codigo: '',
      nome: '',
      descricao: '',
      descricaoDetalhada: '',
      fotoUrl: '',
      valor: '',
      duracaoHoras: '',
      nivel: 'Iniciante',
      maxAlunos: '',
      conteudoProgramatico: '',
      certificadoDisponivel: true,
    });
    setActiveStep(0);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Função para criar curso com axios
  const createCourseWithAxios = async (courseData: any) => {
    const token = localStorage.getItem('token');
    
    const response = await axios.post('https://localhost:5001/api/cursos', courseData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  };

  const handleSubmit = async () => {
    // Validação
    if (!formData.valor || Number(formData.valor) <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }
    if (!formData.duracaoHoras || Number(formData.duracaoHoras) <= 0) {
      setError('Duração deve ser maior que zero');
      return;
    }
    if (!formData.maxAlunos || Number(formData.maxAlunos) <= 0) {
      setError('Número máximo de alunos deve ser maior que zero');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const courseData = {
        codigo: formData.codigo.trim(),
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim(),
        descricaoDetalhada: formData.descricaoDetalhada.trim(),
        fotoUrl: formData.fotoUrl.trim(),
        valor: Number(formData.valor),
        duracaoHoras: Number(formData.duracaoHoras),
        nivel: formData.nivel,
        maxAlunos: Number(formData.maxAlunos),
        conteudoProgramatico: formData.conteudoProgramatico.trim(),
        certificadoDisponivel: formData.certificadoDisponivel,
      };

      await createCourseWithAxios(courseData);
      
      setSuccess(true);
      setTimeout(() => {
        handleReset();
        onClose();
        if (onCourseCreated) {
          onCourseCreated();
        }
      }, 1500);

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao criar curso');
      } else {
        setError('Erro ao criar curso. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 600, md: 700 },
    maxHeight: '90vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 0,
  };

  // Conteúdo do Step 0 - Informações Básicas
  const renderStep0 = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              required
              label="Código do Curso"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              placeholder="Ex: MEC101"
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              required
              label="Nível"
              name="nivel"
              value={formData.nivel}
              onChange={handleChange}
              select
              size="small"
            >
              {niveis.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <Box>
          <TextField
            fullWidth
            required
            label="Nome do Curso"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: Mecânica Automotiva Básica"
            size="small"
          />
        </Box>

        <Box>
          <TextField
            fullWidth
            required
            label="Descrição Curta"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            multiline
            rows={2}
            placeholder="Breve descrição do curso"
            size="small"
          />
        </Box>

        <Box>
          <TextField
            fullWidth
            label="URL da Imagem"
            name="fotoUrl"
            value={formData.fotoUrl}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddPhotoAlternate fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  // Conteúdo do Step 1 - Detalhes do Curso
  const renderStep1 = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <TextField
            fullWidth
            label="Descrição Detalhada"
            name="descricaoDetalhada"
            value={formData.descricaoDetalhada}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Descreva detalhadamente o curso..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Duração (horas)"
              name="duracaoHoras"
              value={formData.duracaoHoras}
              onChange={handleNumberChange}
              inputProps={{ min: 1, max: 1000 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Schedule fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Máximo de Alunos"
              name="maxAlunos"
              value={formData.maxAlunos}
              onChange={handleNumberChange}
              inputProps={{ min: 1, max: 1000 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <People fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <Box>
          <TextField
            fullWidth
            label="Conteúdo Programático"
            name="conteudoProgramatico"
            value={formData.conteudoProgramatico}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Liste os módulos ou conteúdos do curso..."
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );

  // Conteúdo do Step 2 - Valores
  const renderStep2 = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <TextField
            fullWidth
            required
            type="number"
            label="Valor do Curso (R$)"
            name="valor"
            value={formData.valor}
            onChange={handleNumberChange}
            inputProps={{ min: 0, step: 0.01 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.certificadoDisponivel}
                onChange={handleSwitchChange}
                name="certificadoDisponivel"
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle fontSize="small" color={formData.certificadoDisponivel ? "success" : "disabled"} />
                <Typography variant="body2">
                  Emitir certificado para alunos
                </Typography>
              </Box>
            }
          />
        </Box>

        <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Resumo do Curso:
          </Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2">
              <strong>Código:</strong> {formData.codigo || 'Não informado'}
            </Typography>
            <Typography variant="body2">
              <strong>Nome:</strong> {formData.nome || 'Não informado'}
            </Typography>
            <Typography variant="body2">
              <strong>Duração:</strong> {formData.duracaoHoras || '0'} horas
            </Typography>
            <Typography variant="body2">
              <strong>Valor:</strong> R$ {Number(formData.valor || 0).toFixed(2)}
            </Typography>
            <Typography variant="body2">
              <strong>Certificado:</strong> {formData.certificadoDisponivel ? 'Sim' : 'Não'}
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <School color="primary" />
            <Typography variant="h6">
              Criar Novo Curso
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Stepper */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {activeStep === 0 && renderStep0()}
          {activeStep === 1 && renderStep1()}
          {activeStep === 2 && renderStep2()}
        </Box>

        {/* Error/Success Messages */}
        <Box sx={{ px: 3, pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 1 }}>
              Curso criado com sucesso!
            </Alert>
          )}
        </Box>

        {/* Footer - Actions */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {activeStep > 0 && (
              <Button onClick={handleBack} disabled={loading}>
                Voltar
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleClose} variant="outlined" disabled={loading}>
              Cancelar
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext} 
                variant="contained"
                disabled={loading}
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="success"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              >
                {loading ? 'Criando...' : 'Criar Curso'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CriarCursoModal;