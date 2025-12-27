/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  QrCode2,
  ContentCopy,
  CheckCircle,
  ArrowBack,
  Timer,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';

const PixPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { pedidoId } = useParams<{ pedidoId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [pagamento, setPagamento] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 1 hora em segundos
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [status, setStatus] = useState<'pendente' | 'pago' | 'expirado'>('pendente');

  // Buscar dados do pagamento
  useEffect(() => {
    if (pedidoId) {
      buscarPagamentoPix();
      startStatusChecker();
    }
  }, [pedidoId]);

  // Timer de expiração
  useEffect(() => {
    if (timeLeft > 0 && status === 'pendente') {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && status === 'pendente') {
      setStatus('expirado');
    }
  }, [timeLeft, status]);

  const buscarPagamentoPix = async () => {
    try {
      setLoading(true);
      
      // Dados do usuário (do localStorage ou contexto)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await api.post('/pix/gerar-cobranca', {
        pedidoId: parseInt(pedidoId || '0'),
        alunoId: userData.id,
        cpf: userData.cpf || '00000000000',
        nome: userData.nome || 'Cliente'
      });

      if (response.data.success) {
        setPagamento(response.data);
        
        // Calcular tempo restante
        if (response.data.expiracao) {
          const expiracao = new Date(response.data.expiracao);
          const now = new Date();
          const diff = Math.floor((expiracao.getTime() - now.getTime()) / 1000);
          setTimeLeft(Math.max(0, diff));
        }
      } else {
        setError(response.data.message || 'Erro ao gerar PIX');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const startStatusChecker = () => {
    // Verificar status a cada 10 segundos
    const interval = setInterval(async () => {
      if (status === 'pendente' && pedidoId) {
        try {
          const response = await api.get(`/pix/status/${pedidoId}`);
          if (response.data.success && response.data.pago) {
            setStatus('pago');
            clearInterval(interval);
            setStatusDialogOpen(true);
            
            // Redirecionar após 5 segundos
            setTimeout(() => {
              navigate('/meus-cursos');
            }, 5000);
          }
        } catch (err) {
          console.error('Erro ao verificar status:', err);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  };

  const handleCopyPixCode = () => {
    if (pagamento?.qrcode) {
      navigator.clipboard.writeText(pagamento.qrcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVoltar = () => {
    navigate('/carrinho');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Gerando QR Code PIX...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, mb: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleVoltar}>
          Voltar ao Carrinho
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 12, mb: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {/* Cabeçalho */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Pagamento via PIX
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Escaneie o QR Code abaixo ou copie o código PIX
            </Typography>
          </Box>

          {/* Timer de expiração */}
          <Alert 
            severity="warning" 
            icon={<Timer />}
            sx={{ mb: 4, textAlign: 'left' }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">
                Este PIX expira em:
              </Typography>
              <Typography variant="h6" color="error" fontWeight="bold">
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Alert>

          {/* QR Code */}
          <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <QrCode2 sx={{ fontSize: 120, color: 'primary.main', mb: 2 }} />
            
            {pagamento?.imagemQrcode && pagamento.imagemQrcode !== 'SIMULADO_EM_DEV' ? (
              <Box
                component="img"
                src={pagamento.imagemQrcode}
                alt="QR Code PIX"
                sx={{ width: 256, height: 256, mb: 3 }}
              />
            ) : (
              <Box sx={{ 
                width: 256, 
                height: 256, 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2
              }}>
                <Typography variant="body2" color="text.secondary">
                  QR Code simulado para desenvolvimento
                </Typography>
              </Box>
            )}

            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            R$ {pagamento?.valor ? parseFloat(pagamento.valor).toFixed(2) : '0,00'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Pedido: #{pagamento?.numeroPedido || pedidoId}
            </Typography>
          </Box>

          {/* Código PIX copia e cola */}
          <Paper variant="outlined" sx={{ p: 3, mb: 4, textAlign: 'left' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Código PIX (copia e cola):
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={copied ? <CheckCircle /> : <ContentCopy />}
                onClick={handleCopyPixCode}
                color={copied ? 'success' : 'primary'}
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </Box>
            
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}
            >
              {pagamento?.qrcode || 'Código PIX não disponível'}
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Cole este código no seu aplicativo do banco para pagar
            </Typography>
          </Paper>

          <Divider sx={{ my: 4 }} />

          {/* Instruções */}
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Como pagar:
            </Typography>
            <ol>
              <li><Typography variant="body2">Abra o app do seu banco</Typography></li>
              <li><Typography variant="body2">Selecione a opção "Pagar com PIX"</Typography></li>
              <li><Typography variant="body2">Escaneie o QR Code ou cole o código</Typography></li>
              <li><Typography variant="body2">Confirme o pagamento</Typography></li>
            </ol>
          </Box>

          {/* Botões de ação */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleVoltar}
            >
              Voltar
            </Button>
            
            <Button
              variant="contained"
              onClick={() => setStatusDialogOpen(true)}
            >
              Já paguei
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Dialog de status */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>
          {status === 'pago' ? '✅ Pagamento Confirmado!' : 'Verificando Pagamento'}
        </DialogTitle>
        <DialogContent>
          {status === 'pago' ? (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                Pagamento confirmado com sucesso!
              </Alert>
              <Typography>
                Você será redirecionado para seus cursos em instantes...
              </Typography>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>
                Verificando seu pagamento...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {status === 'pago' && (
            <Button onClick={() => navigate('/meus-cursos')} variant="contained">
              Ir para Meus Cursos
            </Button>
          )}
          <Button onClick={() => setStatusDialogOpen(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PixPaymentPage;