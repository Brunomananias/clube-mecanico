/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  ArrowBack,
  QrCode,
  CreditCard,
  Pix as PixIcon,
  AccountBalance,
  ShoppingBag,
  Security,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

const MercadoPagoCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [pixCopyCode, setPixCopyCode] = useState<string>('');

  const { paymentMethod, total, items } = location.state || {
    paymentMethod: 'credit_card',
    total: 0,
    items: []
  };

  useEffect(() => {
    // Simulação do processo de pagamento com Mercado Pago
    const simulatePayment = async () => {
      setLoading(true);
      
      // Aqui você integraria com a API real do Mercado Pago
      // Exemplo: Criar preferência, gerar QR Code PIX, etc.
      
      if (paymentMethod === 'pix') {
        // Simula geração de QR Code PIX
        setTimeout(() => {
          setPixCopyCode('00020101021226870014br.gov.bcb.pix2561qrcodes-pix.mercadopago.com/inst/3c5c5c5c5c5c5c5c520400005303986540510.005802BR5925CLUBE DO MECANICO LTDA6009SAO PAULO62140510qrcodePix6304ABCD');
          setLoading(false);
        }, 2000);
      } else {
        // Para cartão/boleto, simula processamento
        setTimeout(() => {
          setPaymentStatus('success');
          setLoading(false);
        }, 3000);
      }
    };

    simulatePayment();
  }, [paymentMethod]);

  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return <CreditCard sx={{ fontSize: 48, color: 'primary.main' }} />;
      case 'pix':
        return <PixIcon sx={{ fontSize: 48, color: 'primary.main' }} />;
      case 'boleto':
        return <AccountBalance sx={{ fontSize: 48, color: 'primary.main' }} />;
      default:
        return <CreditCard sx={{ fontSize: 48, color: 'primary.main' }} />;
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'pix':
        return 'PIX';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return 'Cartão de Crédito';
    }
  };

  const handleBackToCart = () => {
    navigate('/carrinho');
  };

  const handleViewCourses = () => {
    navigate('/dashboard');
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCopyCode);
    alert('Código PIX copiado para a área de transferência!');
  };

  return (
    <>
      <Navbar userType="aluno" />
      
      <Container maxWidth="md" sx={{ mt: 12, mb: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {getPaymentMethodIcon()}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Pagamento com Mercado Pago
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Método: {getPaymentMethodName()}
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Processando seu pagamento...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aguarde enquanto conectamos com o Mercado Pago
              </Typography>
            </Box>
          ) : (
            <>
              {paymentMethod === 'pix' ? (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
                    Pague com PIX
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      O pagamento via PIX é processado instantaneamente. Use o QR Code abaixo ou o código copia e cola.
                    </Typography>
                  </Alert>
                  
                  {/* QR Code */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Paper sx={{ 
                      p: 3, 
                      display: 'inline-block',
                      border: '2px dashed',
                      borderColor: 'primary.main'
                    }}>
                      <QrCode sx={{ fontSize: 200, color: 'primary.main' }} />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        QR Code para pagamento
                      </Typography>
                    </Paper>
                  </Box>
                  
                  {/* Código PIX */}
                  <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Código PIX (copia e cola):
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'white', 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem'
                    }}>
                      {pixCopyCode}
                    </Box>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={copyPixCode}
                    >
                      Copiar Código PIX
                    </Button>
                  </Paper>
                  
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Atenção:</strong> O QR Code tem validade de 30 minutos. Após o pagamento, aguarde a confirmação automática.
                    </Typography>
                  </Alert>
                </Box>
              ) : paymentMethod === 'credit_card' ? (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
                    Pagamento com Cartão
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Você será redirecionado para a página segura do Mercado Pago para inserir os dados do cartão.
                    </Typography>
                  </Alert>
                  
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => {
                        // Aqui você redirecionaria para a URL real do Mercado Pago
                        // window.location.href = 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789';
                        setPaymentStatus('success');
                      }}
                      sx={{ py: 2, px: 4 }}
                    >
                      Ir para Página de Pagamento do Mercado Pago
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
                    Boleto Bancário
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      O boleto será gerado pelo Mercado Pago. O pagamento pode levar até 3 dias úteis para ser confirmado.
                    </Typography>
                  </Alert>
                  
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => {
                        // Aqui você geraria o boleto via Mercado Pago
                        setPaymentStatus('success');
                      }}
                      sx={{ py: 2, px: 4 }}
                    >
                      Gerar Boleto do Mercado Pago
                    </Button>
                  </Box>
                </Box>
              )}
              
              {/* Resumo do pedido */}
              <Paper sx={{ p: 3, mt: 4, bgcolor: 'primary.light' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Resumo do Pedido
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Valor total:
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    R$ {total.toFixed(2)}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Itens do pedido:
                </Typography>
                <List dense>
                  {items.map((item: any, index: number) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.titulo}
                        secondary={`${item.quantidade} x R$ ${item.valor.toFixed(2)}`}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        R$ {(item.valor * item.quantidade).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>
              
              {/* Status do pagamento */}
              {paymentStatus === 'success' && (
                <Alert 
                  severity="success" 
                  sx={{ mt: 3 }}
                  icon={<CheckCircle fontSize="large" />}
                >
                  <Typography variant="h6" gutterBottom>
                    Pagamento processado com sucesso!
                  </Typography>
                  <Typography variant="body2">
                    Seu pedido foi confirmado. Em instantes você terá acesso aos cursos na sua área do aluno.
                  </Typography>
                </Alert>
              )}
              
              {/* Botões de ação */}
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
                  startIcon={<ArrowBack />}
                  onClick={handleBackToCart}
                >
                  Voltar ao Carrinho
                </Button>
                
                {paymentStatus === 'success' && (
                  <Button
                    variant="contained"
                    startIcon={<ShoppingBag />}
                    onClick={handleViewCourses}
                  >
                    Acessar Meus Cursos
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
        
        {/* Informações sobre segurança */}
        <Card sx={{ mt: 4, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              <Security sx={{ verticalAlign: 'middle', mr: 1 }} />
              Pagamento 100% seguro pelo Mercado Pago
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Dados protegidos com criptografia de ponta<br/>
              • Processamento garantido pelo Mercado Pago<br/>
              • Suporte 24h para dúvidas sobre pagamento<br/>
              • Reembolso em até 30 dias conforme política
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default MercadoPagoCheckout;