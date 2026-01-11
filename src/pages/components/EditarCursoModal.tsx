/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
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
  Snackbar,
} from '@mui/material';
import {
  Close,
  Save,
  AddPhotoAlternate,
  Description,
  CheckCircle,
  Schedule,
  People,
  AttachMoney,
  Edit,
} from '@mui/icons-material';
import api from '../../config/api';

interface ICurso {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  descricaoDetalhada: string;
  fotoUrl: string;
  valor: number;
  duracaoHoras: number;
  nivel: string;
  maxAlunos: number;
  conteudoProgramatico: string;
  certificadoDisponivel: boolean;
  ativo?: boolean;
}

interface EditarCursoModalProps {
  open: boolean;
  onClose: () => void;
  curso: ICurso | null;
  onCursoAtualizado?: () => void;
}

const EditarCursoModal: React.FC<EditarCursoModalProps> = ({ 
  open, 
  onClose, 
  curso, 
  onCursoAtualizado 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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
    ativo: true,
  });

  useEffect(() => {
    if (curso) {
      setFormData({
        codigo: curso.codigo || '',
        nome: curso.nome || '',
        descricao: curso.descricao || '',
        descricaoDetalhada: curso.descricaoDetalhada || '',
        fotoUrl: curso.fotoUrl || '',
        valor: curso.valor?.toString() || '',
        duracaoHoras: curso.duracaoHoras?.toString() || '',
        nivel: curso.nivel || 'Iniciante',
        maxAlunos: curso.maxAlunos?.toString() || '',
        conteudoProgramatico: curso.conteudoProgramatico || '',
        certificadoDisponivel: curso.certificadoDisponivel || true,
        ativo: curso.ativo !== undefined ? curso.ativo : true,
      });
    }
  }, [curso]);

  const steps = ['Informações Básicas', 'Detalhes do Curso', 'Valores e Status'];

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
    // Permite apenas números positivos
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, [name]: numericValue === '' ? '' : numericValue }));
    if (error) setError(null);
  };

  const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Permite números com até 2 casas decimais
    const decimalValue = value.replace(/[^0-9.]/g, '');
    // Garante apenas um ponto decimal
    const parts = decimalValue.split('.');
    const formattedValue = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : decimalValue;
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
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
      if (!formData.descricao.trim()) {
        setError('Descrição do curso é obrigatória');
        return;
      }
    }
    
    if (activeStep === 1) {
      if (!formData.duracaoHoras || Number(formData.duracaoHoras) <= 0) {
        setError('Duração deve ser maior que zero');
        return;
      }
      if (!formData.maxAlunos || Number(formData.maxAlunos) <= 0) {
        setError('Número máximo de alunos deve ser maior que zero');
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
    if (curso) {
      setFormData({
        codigo: curso.codigo || '',
        nome: curso.nome || '',
        descricao: curso.descricao || '',
        descricaoDetalhada: curso.descricaoDetalhada || '',
        fotoUrl: curso.fotoUrl || '',
        valor: curso.valor?.toString() || '',
        duracaoHoras: curso.duracaoHoras?.toString() || '',
        nivel: curso.nivel || 'Iniciante',
        maxAlunos: curso.maxAlunos?.toString() || '',
        conteudoProgramatico: curso.conteudoProgramatico || '',
        certificadoDisponivel: curso.certificadoDisponivel || true,
        ativo: curso.ativo !== undefined ? curso.ativo : true,
      });
    }
    setActiveStep(0);
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validateForm = () => {
    if (!formData.valor || Number(formData.valor) <= 0) {
      setError('Valor deve ser maior que zero');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cursoData = {
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
        ativo: formData.ativo,
      };

      const token = localStorage.getItem('token');
      await api.put(`/cursos/${curso?.id}`, cursoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSnackbarMessage("Curso atualizado com sucesso!");
      setSnackbarOpen(true);
      
      if (onCursoAtualizado) {
        setTimeout(() => {
          onCursoAtualizado();
        }, 500);
      }
      
      onClose();
    } catch (err: any) {
      console.error('Erro ao atualizar curso:', err);
      if (err.response?.status === 404) {
        setError('Curso não encontrado');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Dados inválidos');
      } else if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao atualizar curso. Tente novamente.');
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
              error={!formData.codigo.trim() && activeStep >= 0}
              helperText={!formData.codigo.trim() && activeStep >= 0 ? "Obrigatório" : ""}
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
            error={!formData.nome.trim() && activeStep >= 0}
            helperText={!formData.nome.trim() && activeStep >= 0 ? "Obrigatório" : ""}
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
            error={!formData.descricao.trim() && activeStep >= 0}
            helperText={!formData.descricao.trim() && activeStep >= 0 ? "Obrigatório" : ""}
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
            helperText="Deixe em branco para usar imagem padrão"
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
              label="Duração (horas)"
              name="duracaoHoras"
              value={formData.duracaoHoras}
              onChange={handleNumberChange}
              inputProps={{ min: 1, max: 1000 }}
              size="small"
              error={(!formData.duracaoHoras || Number(formData.duracaoHoras) <= 0) && activeStep >= 1}
              helperText={(!formData.duracaoHoras || Number(formData.duracaoHoras) <= 0) && activeStep >= 1 ? "Mínimo: 1 hora" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Schedule fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">horas</InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              required
              label="Máximo de Alunos"
              name="maxAlunos"
              value={formData.maxAlunos}
              onChange={handleNumberChange}
              inputProps={{ min: 1, max: 1000 }}
              size="small"
              error={(!formData.maxAlunos || Number(formData.maxAlunos) <= 0) && activeStep >= 1}
              helperText={(!formData.maxAlunos || Number(formData.maxAlunos) <= 0) && activeStep >= 1 ? "Mínimo: 1 aluno" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <People fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">alunos</InputAdornment>
                )
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
            helperText="Separe os módulos com ponto e vírgula (;)"
          />
        </Box>
      </Box>
    </Box>
  );

  // Conteúdo do Step 2 - Valores e Status
  const renderStep2 = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <TextField
            fullWidth
            required
            label="Valor do Curso (R$)"
            name="valor"
            value={formData.valor}
            onChange={handleDecimalChange}
            size="small"
            error={(!formData.valor || Number(formData.valor) <= 0) && activeStep >= 2}
            helperText={(!formData.valor || Number(formData.valor) <= 0) && activeStep >= 2 ? "Valor deve ser maior que zero" : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney fontSize="small" color="action" />
                </InputAdornment>
              ),
              inputProps: {
                step: "0.01",
                min: "0"
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.ativo}
                onChange={handleSwitchChange}
                name="ativo"
                color={formData.ativo ? "success" : "error"}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {formData.ativo ? (
                  <CheckCircle fontSize="small" color="success" />
                ) : (
                  <Close fontSize="small" color="error" />
                )}
                <Typography variant="body2">
                  Curso {formData.ativo ? 'Ativo' : 'Inativo'}
                </Typography>
              </Box>
            }
          />
        </Box>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Resumo do Curso:
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Código:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formData.codigo || 'Não informado'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Nome:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formData.nome || 'Não informado'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Nível:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formData.nivel}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Duração:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formData.duracaoHoras || '0'} horas
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Valor:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                R$ {Number(formData.valor || 0).toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Certificado:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formData.certificadoDisponivel ? 'Sim' : 'Não'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Status:
              </Typography>
              <Typography variant="body2" fontWeight="medium" color={formData.ativo ? "success.main" : "error.main"}>
                {formData.ativo ? 'Ativo' : 'Inativo'}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );

  if (!curso) return null;

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            bgcolor: 'primary.light',
            color: 'primary.contrastText'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Edit />
              <Typography variant="h6" fontWeight="bold">
                Editar Curso
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small" sx={{ color: 'primary.contrastText' }}>
              <Close />
            </IconButton>
          </Box>

          {/* Stepper */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
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

          {/* Error Message */}
          {error && (
            <Box sx={{ px: 3, pt: 1 }}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Footer - Actions */}
          <Box sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: 'grey.50'
          }}>
            <Box>
              {activeStep > 0 && (
                <Button 
                  onClick={handleBack} 
                  disabled={loading}
                  variant="outlined"
                >
                  Voltar
                </Button>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                onClick={handleClose} 
                variant="outlined" 
                disabled={loading}
              >
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
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                >
                  {loading ? 'Atualizando...' : 'Salvar Alterações'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditarCursoModal;