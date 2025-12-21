/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  CalendarToday,
  People,
  AccessTime,
  Person,
  CheckCircle,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import api from '../../config/api';

// Interfaces baseadas nos campos do banco
interface TurmaFormData {
  cursoId: string;
  dataInicio: Dayjs | null;
  dataFim: Dayjs | null;
  horario: string;
  professor: string;
  vagasTotal: number;
  vagasDisponiveis: number;
  status: 'ativa' | 'inativa' | 'encerrada';
}

interface TurmaParaEnvio {
  cursoId: string;
  dataInicio: string;
  dataFim: string;
  horario: string;
  professor: string;
  vagasTotal: number;
  vagasDisponiveis: number;
  status: 'ativa' | 'inativa' | 'encerrada';
}

interface Professor {
  id: number;
  nome: string;
}

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

interface CriarTurmaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (turmaData: TurmaParaEnvio) => Promise<void>;
}

const CriarTurmaModal: React.FC<CriarTurmaModalProps> = ({
  open,
  onClose,
  onSave
}) => {
  // Estados do formulário
  const [formData, setFormData] = useState<TurmaFormData>({
    cursoId: '',
    dataInicio: null,
    dataFim: null,
    horario: '',
    professor: '',
    vagasTotal: 20,
    vagasDisponiveis: 20,
    status: 'ativa'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TurmaFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [professores] = useState<Professor[]>([
    { id: 1, nome: 'Carlos Mendes' },
    { id: 2, nome: 'Ana Santos' },
    { id: 3, nome: 'Roberto Silva' },
    { id: 4, nome: 'Fernanda Lima' },
  ]);

    const listarCursos = async () => {
      try {
        const response = await api.get<ICurso[]>("/cursos");
        setCursos(response.data);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      }
    }
  // Resetar formulário quando modal abrir/fechar
  useEffect(() => {
    if (open) {
      setFormData({
        cursoId: '',
        dataInicio: null,
        dataFim: null,
        horario: '',
        professor: '',
        vagasTotal: 20,
        vagasDisponiveis: 20,
        status: 'ativa'
      });
      setErrors({});
      setSubmitError('');
      setSuccess(false);
      listarCursos();
    }
  }, [open]);

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TurmaFormData, string>> = {};

    if (!formData.cursoId) newErrors.cursoId = 'Selecione um curso';
    if (!formData.dataInicio) newErrors.dataInicio = 'Data de início é obrigatória';
    if (!formData.dataFim) newErrors.dataFim = 'Data de término é obrigatória';
    
    if (formData.dataInicio && formData.dataFim && formData.dataInicio.isAfter(formData.dataFim)) {
      newErrors.dataFim = 'Data de término deve ser posterior à data de início';
    }
    
    if (!formData.horario.trim()) newErrors.horario = 'Horário é obrigatório';
    if (!formData.professor) newErrors.professor = 'Selecione um professor';
    if (formData.vagasTotal <= 0) newErrors.vagasTotal = 'Total de vagas deve ser maior que 0';
    
    if (formData.vagasDisponiveis > formData.vagasTotal) {
      newErrors.vagasDisponiveis = 'Vagas disponíveis não podem ser maiores que o total';
    }
    
    if (formData.vagasDisponiveis < 0) {
      newErrors.vagasDisponiveis = 'Vagas disponíveis não podem ser negativas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipular mudanças nos campos
  const handleChange = (field: keyof TurmaFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar/selecionar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Atualizar vagas disponíveis quando mudar o total
  const handleVagasTotalChange = (value: number) => {
    const novoTotal = Math.max(1, value);
    setFormData(prev => ({
      ...prev,
      vagasTotal: novoTotal,
      vagasDisponiveis: Math.min(prev.vagasDisponiveis, novoTotal)
    }));
  };

  // Enviar formulário
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');
    
    try {
      // Validar datas
      if (!formData.dataInicio || !formData.dataFim) {
        throw new Error('Datas são obrigatórias');
      }

      // Preparar dados para envio - converter Dayjs para string
      const turmaParaEnvio: TurmaParaEnvio = {
        cursoId: formData.cursoId,
        dataInicio: formData.dataInicio.format('YYYY-MM-DD'),
        dataFim: formData.dataFim.format('YYYY-MM-DD'),
        horario: formData.horario,
        professor: formData.professor,
        vagasTotal: formData.vagasTotal,
        vagasDisponiveis: formData.vagasDisponiveis,
        status: formData.status
      };

      console.log('Dados da turma para envio:', turmaParaEnvio);
      
      // Chamar função de salvar passada via props
      await onSave(turmaParaEnvio);
      
      setSuccess(true);
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro ao criar turma:', error);
      setSubmitError(error.message || 'Erro ao criar turma. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              Criar Nova Turma
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Turma criada com sucesso!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A turma foi cadastrada no sistema e está pronta para receber alunos.
              </Typography>
            </Box>
          ) : (
            <>
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
                {/* Curso */}
                <FormControl fullWidth error={!!errors.cursoId}>
                  <InputLabel>Curso *</InputLabel>
                  <Select
                    value={formData.cursoId}
                    label="Curso *"
                    onChange={(e) => handleChange('cursoId', e.target.value)}
                    startAdornment={<CalendarToday sx={{ mr: 1, color: 'action.active' }} />}
                  >
                    <MenuItem value="">
                      <em>Selecione um curso</em>
                    </MenuItem>
                    {cursos.map((curso) => (
                      <MenuItem key={curso.id} value={curso.id.toString()}>
                        {curso.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.cursoId && (
                    <Typography variant="caption" color="error">
                      {errors.cursoId}
                    </Typography>
                  )}
                </FormControl>

                {/* Data de Início */}
                <Box sx={{ flex: '1 1 200px' }}>
                  <DatePicker
                    label="Data de Início *"
                    value={formData.dataInicio}
                    onChange={(date) => handleChange('dataInicio', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dataInicio,
                        helperText: errors.dataInicio,
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

                {/* Data de Término */}
                <Box sx={{ flex: '1 1 200px' }}>
                  <DatePicker
                    label="Data de Término *"
                    value={formData.dataFim}
                    onChange={(date) => handleChange('dataFim', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dataFim,
                        helperText: errors.dataFim,
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

                {/* Horário */}
                <TextField
                  fullWidth
                  label="Horário *"
                  value={formData.horario}
                  onChange={(e) => handleChange('horario', e.target.value)}
                  error={!!errors.horario}
                  helperText={errors.horario || "Ex: Segunda e Quarta, 19h-22h"}
                  placeholder="Ex: Segunda e Quarta, 19h-22h"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Professor */}
                <FormControl fullWidth error={!!errors.professor}>
                  <InputLabel>Professor *</InputLabel>
                  <Select
                    value={formData.professor}
                    label="Professor *"
                    onChange={(e) => handleChange('professor', e.target.value)}
                    startAdornment={<Person sx={{ mr: 1, color: 'action.active' }} />}
                  >
                    <MenuItem value="">
                      <em>Selecione um professor</em>
                    </MenuItem>
                    {professores.map((prof) => (
                      <MenuItem key={prof.id} value={prof.nome}>
                        {prof.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.professor && (
                    <Typography variant="caption" color="error">
                      {errors.professor}
                    </Typography>
                  )}
                </FormControl>

                {/* Vagas Total */}
                <TextField
                  fullWidth
                  label="Total de Vagas *"
                  type="number"
                  value={formData.vagasTotal}
                  onChange={(e) => handleVagasTotalChange(parseInt(e.target.value) || 1)}
                  error={!!errors.vagasTotal}
                  helperText={errors.vagasTotal}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <People />
                      </InputAdornment>
                    ),
                    inputProps: { min: 1 }
                  }}
                />

                {/* Vagas Disponíveis */}
                <TextField
                  fullWidth
                  label="Vagas Disponíveis *"
                  type="number"
                  value={formData.vagasDisponiveis}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleChange('vagasDisponiveis', Math.min(value, formData.vagasTotal));
                  }}
                  error={!!errors.vagasDisponiveis}
                  helperText={errors.vagasDisponiveis}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <People />
                      </InputAdornment>
                    ),
                    inputProps: { 
                      min: 0,
                      max: formData.vagasTotal
                    }
                  }}
                />

                {/* Status */}
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleChange('status', e.target.value as TurmaFormData['status'])}
                  >
                    <MenuItem value="ativa">
                      <Chip label="Ativa" size="small" color="success" />
                    </MenuItem>
                    <MenuItem value="inativa">
                      <Chip label="Inativa" size="small" color="default" />
                    </MenuItem>
                    <MenuItem value="encerrada">
                      <Chip label="Encerrada" size="small" color="error" />
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Informações da turma */}
                <Box sx={{ 
                  width: '100%', 
                  p: 2, 
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Resumo da Turma
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Ocupação
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formData.vagasTotal - formData.vagasDisponiveis} / {formData.vagasTotal} alunos
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Duração
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formData.dataInicio && formData.dataFim ? 
                          `${formData.dataInicio.format('DD/MM/YYYY')} - ${formData.dataFim.format('DD/MM/YYYY')}` : 
                          'Não definida'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>

        {!success && (
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              {loading ? 'Salvando...' : 'Criar Turma'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </LocalizationProvider>
  );
};

export default CriarTurmaModal;