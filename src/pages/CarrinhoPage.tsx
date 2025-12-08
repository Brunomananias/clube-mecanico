import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowBack,
  Payment,
  LocalOffer,
  Security,
  CheckCircle,
  CreditCard,
  Pix,
  AccountBalance,
  QrCode,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';

interface ItemCarrinho {
  id: number;
  titulo: string;
  valor: number;
  duracao: string;
  horas: number;
  imagem: string;
  quantidade: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'pix' | 'boleto';
  icon: React.ReactNode;
}

const CarrinhoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // Dados do carrinho
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([
    {
      id: 1,
      titulo: "Mecânica de Bicicletas Básico",
      valor: 297.00,
      duracao: "6 semanas",
      horas: 40,
      imagem: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=150&q=80",
      quantidade: 1
    },
    {
      id: 2,
      titulo: "Manutenção de Freios Hidráulicos",
      valor: 197.00,
      duracao: "4 semanas",
      horas: 30,
      imagem: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=150&q=80",
      quantidade: 1
    }
  ]);

  // Métodos de pagamento
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      name: 'Cartão de Crédito',
      type: 'card',
      icon: <CreditCard />
    },
    {
      id: 'pix',
      name: 'PIX',
      type: 'pix',
      icon: <Pix />
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      type: 'boleto',
      icon: <AccountBalance />
    }
  ];

  // Se veio da página de detalhes, adiciona o curso ao carrinho
  React.useEffect(() => {
    if (location.state?.curso) {
      const curso = location.state.curso;
      const cursoExistente = carrinho.find(item => item.id === curso.id);
      
      if (!cursoExistente) {
        setCarrinho([...carrinho, {
          id: curso.id,
          titulo: curso.titulo,
          valor: curso.valor,
          duracao: curso.duracao,
          horas: curso.horas,
          imagem: curso.imagem,
          quantidade: 1
        }]);
      }
    }
  }, [location.state]);

  const handleRemoveItem = (id: number) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    
    setCarrinho(carrinho.map(item => 
      item.id === id ? { ...item, quantidade: novaQuantidade } : item
    ));
  };

  const handleAplicarCupom = () => {
    if (cupom === 'BEMVINDO10') {
      setCupomAplicado(true);
      setOpenSnackbar(true);
    }
  };

  const handleFinalizarCompra = () => {
    if (activeStep === 0) {
      setActiveStep(1);
      setPaymentDialogOpen(true);
    } else {
      handlePayment();
    }
  };

  const handleContinuarComprando = () => {
    navigate('/cursos');
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Selecione um método de pagamento');
      return;
    }

    setLoading(true);

    try {
      // Aqui você faria a chamada para sua API para criar a preferência do Mercado Pago
      const orderData = {
        items: carrinho.map(item => ({
          id: item.id,
          title: item.titulo,
          quantity: item.quantidade,
          unit_price: item.valor,
          description: `Curso: ${item.titulo} - ${item.duracao}`
        })),
        payer: {
          email: "comprador@email.com", // Em app real, pegaria do usuário logado
          name: "Nome do Comprador"
        },
        payment_method_id: selectedPaymentMethod,
        external_reference: `order_${Date.now()}`,
        back_urls: {
          success: `${window.location.origin}/pagamento/sucesso`,
          failure: `${window.location.origin}/pagamento/falha`,
          pending: `${window.location.origin}/pagamento/pendente`
        },
        auto_return: "approved",
      };

      // Simulação da chamada à API
      console.log('Enviando dados para Mercado Pago:', orderData);
      
      // Em produção, você faria:
      // const response = await fetch('/api/mercadopago/create-preference', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });
      // 
      // const data = await response.json();
      // if (data.init_point) {
      //   window.location.href = data.init_point;
      // }

      // Simulando resposta do Mercado Pago
      setTimeout(() => {
        setLoading(false);
        
        // URL de exemplo do Mercado Pago
        const mercadoPagoUrl = 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=';
        
        // Aqui você redirecionaria para a URL real do Mercado Pago
        // window.location.href = mercadoPagoUrl + '123456789';
        
        // Para demonstração, vamos para uma página de simulação
        navigate('/mercadopago-checkout', { 
          state: { 
            paymentMethod: selectedPaymentMethod,
            total: total,
            items: carrinho
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setLoading(false);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  // Cálculos
  const subtotal = carrinho.reduce((total, item) => total + (item.valor * item.quantidade), 0);
  const descontoCupom = cupomAplicado ? subtotal * 0.1 : 0; // 10% de desconto
  const total = subtotal - descontoCupom;

  const steps = ['Carrinho', 'Pagamento', 'Confirmação'];

  return (
    <>
      <Navbar userType="aluno" />
      
      <Container maxWidth="lg" sx={{ mt: 12, mb: 6 }}>
        {/* Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 4,
          alignItems: 'flex-start'
        }}>
          {/* Lista de itens */}
          <Box sx={{ flex: '1 1 600px' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h5" fontWeight="bold">
                  <ShoppingCart sx={{ verticalAlign: 'middle', mr: 2 }} />
                  Meu Carrinho
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'}
                </Typography>
              </Box>

              {carrinho.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ShoppingCart sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Seu carrinho está vazio
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/cursos')}
                  >
                    Continuar Comprando
                  </Button>
                </Box>
              ) : (
                <List>
                  {carrinho.map((item) => (
                    <React.Fragment key={item.id}>
                      <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                        <Box sx={{ 
                          width: 80, 
                          height: 80, 
                          mr: 3,
                          borderRadius: 1,
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <Box
                            component="img"
                            src={item.imagem}
                            alt={item.titulo}
                            sx={{ 
                              width: '100%', 
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                        
                        <ListItemText
                          primary={
                            <Typography variant="h6" fontWeight="medium">
                              {item.titulo}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Duração: {item.duracao} | {item.horas} horas
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1
                                }}>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)}
                                  >
                                    <Remove fontSize="small" />
                                  </IconButton>
                                  <Typography sx={{ px: 2 }}>
                                    {item.quantidade}
                                  </Typography>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)}
                                  >
                                    <Add fontSize="small" />
                                  </IconButton>
                                </Box>
                                <Chip 
                                  label={`R$ ${(item.valor * item.quantidade).toFixed(2)}`}
                                  color="primary"
                                  size="small"
                                />
                              </Box>
                            </Box>
                          }
                        />
                        
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleRemoveItem(item.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>

            {/* Cupom de desconto */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Cupom de desconto
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  placeholder="Digite seu cupom"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  disabled={cupomAplicado}
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: cupomAplicado && (
                      <LocalOffer color="success" />
                    )
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAplicarCupom}
                  disabled={cupomAplicado || !cupom}
                >
                  {cupomAplicado ? 'Aplicado' : 'Aplicar'}
                </Button>
              </Box>
              
              {cupomAplicado && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Cupom aplicado com sucesso! 10% de desconto.
                </Alert>
              )}
            </Paper>
          </Box>

          {/* Resumo do pedido */}
          <Box sx={{ flex: '1 1 300px', position: 'sticky', top: 20 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Resumo do Pedido
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                {/* Subtotal */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body1">
                    R$ {subtotal.toFixed(2)}
                  </Typography>
                </Box>
                
                {/* Desconto */}
                {descontoCupom > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mb: 1
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Desconto cupom
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      - R$ {descontoCupom.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                {/* Total */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 3
                }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    R$ {total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Botões de ação */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Payment />}
                  onClick={handleFinalizarCompra}
                  disabled={carrinho.length === 0 || loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : activeStep === 0 ? (
                    'Finalizar Compra'
                  ) : (
                    'Ir para Pagamento'
                  )}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={handleContinuarComprando}
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  Continuar Comprando
                </Button>
              </Box>

              {/* Segurança */}
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                bgcolor: 'grey.50',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Security color="success" />
                <Typography variant="caption" color="text.secondary">
                  Compra 100% segura. Dados protegidos.
                </Typography>
              </Box>
            </Paper>

            {/* Métodos de pagamento */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Aceitamos
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                {paymentMethods.map((method) => (
                  <Box key={method.id} sx={{ textAlign: 'center' }}>
                    {method.icon}
                    <Typography variant="caption">{method.name}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Benefícios */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Benefícios incluídos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">Acesso vitalício</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">Certificado digital</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">Suporte por 1 ano</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">30 dias de garantia</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Dialog de seleção de pagamento */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Selecionar Método de Pagamento
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total a pagar: <strong>R$ {total.toFixed(2)}</strong>
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {paymentMethods.map((method) => (
              <Paper
                key={method.id}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: 'pointer',
                  border: selectedPaymentMethod === method.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  bgcolor: selectedPaymentMethod === method.id ? 'primary.light' : 'white',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {method.icon}
                  <Typography variant="body1" fontWeight="medium">
                    {method.name}
                  </Typography>
                </Box>
                
                {method.type === 'pix' && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Pagamento instantâneo com QR Code
                  </Typography>
                )}
                
                {method.type === 'card' && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Parcele em até 12x
                  </Typography>
                )}
                
                {method.type === 'boleto' && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Pagamento em até 3 dias úteis
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
          >
            {loading ? 'Processando...' : 'Pagar com Mercado Pago'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Cupom aplicado com sucesso!"
      />
    </>
  );
};

export default CarrinhoPage;