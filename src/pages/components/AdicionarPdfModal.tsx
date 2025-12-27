/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { CloudUpload, PictureAsPdf } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import api from '../../config/api';

// Tipos TypeScript
interface Curso {
  id: number;
  nome: string;
}

interface PdfData {
  cursoId: number;
  titulo: string;
  descricao: string;
  tipo: string;
  url: string;
  publicId?: string;
  tamanhoArquivo?: number;
}

interface AdicionarPdfModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (pdfData: PdfData) => void;
  cursoId?: number;
}

const AdicionarPdfModal: React.FC<AdicionarPdfModalProps> = ({ 
  open, 
  onClose, 
  onSave, 
  cursoId 
}) => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    cursoId: cursoId || '',
    titulo: '',
    descricao: '',
    tipo: 'pdf',
    url: '',
  });

  // Buscar cursos quando abrir modal
  useEffect(() => {
    if (open) {
      fetchCursos();
    }
  }, [open]);

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cursos');
      setCursos(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar cursos:', err);
      setError('Erro ao carregar cursos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Configurar área de arrastar e soltar
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        setError('Arquivo muito grande. Máximo 10MB.');
        setSelectedFile(null);
        return;
      }
      
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setFormData(prev => ({
          ...prev,
          titulo: file.name.replace('.pdf', '').replace('.PDF', '')
        }));
        setError(null);
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      
      // Validações
      if (!formData.cursoId) {
        setError('Selecione um curso');
        return;
      }

      if (!formData.titulo.trim()) {
        setError('Digite um título para o PDF');
        return;
      }

      if (!selectedFile) {
        setError('Selecione um arquivo PDF');
        return;
      }

      let uploadResult = null;
      
      // 1. Upload para Cloudinary
      if (selectedFile) {
        setUploading(true);
        
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedFile);
        formDataUpload.append('cursoId', formData.cursoId.toString());

        uploadResult = await api.post('/conteudoscomplementares/upload', formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: any) => {
            const total = progressEvent.total || selectedFile.size;
            const percent = Math.round((progressEvent.loaded * 100) / total);
            setUploadProgress(percent);
          },
        });
        
        setUploading(false);
      }

      // 2. Salvar no banco
      const pdfData: PdfData = {
        cursoId: parseInt(formData.cursoId.toString()),
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: 'pdf',
        url: uploadResult?.data?.Url || uploadResult?.data?.url || '',
        publicId: uploadResult?.data?.PublicId || uploadResult?.data?.publicId || '',
        tamanhoArquivo: uploadResult?.data?.TamanhoArquivo || uploadResult?.data?.tamanhoArquivo || selectedFile?.size || 0
      };

      await api.post('/conteudoscomplementares', pdfData);
      
      onSave(pdfData);
      onClose();
      
      // Limpar formulário
      setFormData({
        cursoId: cursoId || '',
        titulo: '',
        descricao: '',
        tipo: 'pdf',
        url: '',
      });
      setSelectedFile(null);
      setUploadProgress(0);
      
    } catch (err: any) {
      console.error('Erro ao salvar PDF:', err);
      setError(err.response?.data?.message || 'Erro ao salvar PDF. Tente novamente.');
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Limpar tudo ao fechar
    setFormData({
      cursoId: cursoId || '',
      titulo: '',
      descricao: '',
      tipo: 'pdf',
      url: '',
    });
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PictureAsPdf sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Adicionar PDF Complementar
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Selecionar curso */}
          <FormControl fullWidth>
            <InputLabel id="curso-select-label">Curso *</InputLabel>
            <Select
              labelId="curso-select-label"
              name="cursoId"
              value={formData.cursoId}
              onChange={handleSelectChange}
              label="Curso *"
              disabled={!!cursoId}
            >
              <MenuItem value="">
                <em>Selecione um curso</em>
              </MenuItem>
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Carregando cursos...
                </MenuItem>
              ) : (
                cursos.map((curso) => (
                  <MenuItem key={curso.id} value={curso.id}>
                    {curso.nome}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Título */}
          <TextField
            name="titulo"
            label="Título do PDF *"
            value={formData.titulo}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            helperText="Dê um nome descritivo para este PDF"
          />

          {/* Descrição (opcional) */}
          <TextField
            name="descricao"
            label="Descrição"
            value={formData.descricao}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            helperText="Breve descrição do conteúdo do PDF"
          />

          {/* Área de upload */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Arquivo PDF *
            </Typography>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.400',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <input {...getInputProps()} />
              <CloudUpload 
                sx={{ 
                  fontSize: 48, 
                  color: isDragActive ? 'primary.main' : 'grey.500',
                  mb: 2 
                }} 
              />
              <Typography variant="body1" gutterBottom>
                {isDragActive
                  ? 'Solte o arquivo PDF aqui...'
                  : 'Arraste e solte um PDF aqui'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ou clique para selecionar
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Apenas arquivos PDF • Máximo 10MB
              </Typography>
            </Box>
          </Box>

          {/* Preview do arquivo selecionado */}
          {selectedFile && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'success.light', 
              borderRadius: 1,
              border: 1,
              borderColor: 'success.main'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PictureAsPdf sx={{ mr: 1, color: 'success.dark' }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  {selectedFile.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tamanho: {formatFileSize(selectedFile.size)}
              </Typography>
            </Box>
          )}

          {/* Progresso do upload */}
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" fontWeight="medium">
                  Enviando para Cloudinary...
                </Typography>
                <Typography variant="caption" fontWeight="bold">
                  {uploadProgress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4 
                }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          disabled={uploading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={uploading || !selectedFile || !formData.titulo || !formData.cursoId}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {uploading ? 'Enviando...' : 'Salvar PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdicionarPdfModal;