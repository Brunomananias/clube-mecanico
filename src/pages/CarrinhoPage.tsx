/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
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
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../config/api";

interface ItemCarrinho {
  id: number;
  carrinhoId: number;
  titulo: string;
  valor: number;
  duracaoHoras: string;
  imagem: string;
  cursoId: number;
  turmaId?: number;
  quantidade: number;
  dataAdicao: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: "card" | "pix" | "boleto";
  icon: React.ReactNode;
}

interface PagamentoResponse {
  success: boolean;
  url?: string;
  pedidoId?: number;
  metodo?: string;
  message?: string;
}

const CarrinhoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cupom, setCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCarrinho, setLoadingCarrinho] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [pedidoCriado, setPedidoCriado] = useState<boolean>(false);

  // Métodos de pagamento
  const paymentMethods: PaymentMethod[] = [
    {
      id: "credit_card",
      name: "Cartão de Crédito",
      type: "card",
      icon: <CreditCard />,
    },
    {
      id: "pix",
      name: "PIX",
      type: "pix",
      icon: <Pix />,
    },
    {
      id: "boleto",
      name: "Boleto Bancário",
      type: "boleto",
      icon: <AccountBalance />,
    },
  ];

  // Buscar itens do carrinho da API
  const buscarCarrinho = async () => {
    try {
      setLoadingCarrinho(true);
      const response = await api.get("/carrinho/itens");

      if (response.data.success) {
        const itens = response.data.dados.itens.map((item: any) => ({
          id: item.cursoId,
          carrinhoId: item.id,
          titulo: item.titulo || item.nome,
          valor: item.valor,
          duracaoHoras: item.duracaoHoras || "Não informado",
          imagem: item.imagem || item.fotoUrl || "/default-course.jpg",
          cursoId: item.cursoId,
          turmaId: item.turmaId,
          quantidade: 1,
          dataAdicao: item.dataAdicao,
        }));

        setCarrinho(itens);
      } else {
        setCarrinho([]);
      }
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      setSnackbarMessage("Erro ao carregar carrinho");
      setSnackbarOpen(true);
      setCarrinho([]);
    } finally {
      setLoadingCarrinho(false);
    }
  };

  // Se veio da página de detalhes, adiciona o curso ao carrinho via API
  useEffect(() => {
    if (location.state?.curso) {
      const curso = location.state.curso;
      adicionarAoCarrinho(curso.id);
    }
  }, [location.state]);

  // Buscar carrinho ao carregar a página
  useEffect(() => {
    buscarCarrinho();
  }, []);

  // Verificar se há um pedido pendente na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoParam = urlParams.get('pedidoId');
    if (pedidoParam) {
      const id = parseInt(pedidoParam);
      setPedidoId(id);
      verificarStatusPedido(id);
    }
  }, []);

  // Verificar se há pedido salvo no localStorage
  useEffect(() => {
    const savedPedidoId = localStorage.getItem('ultimoPedidoId');
    if (savedPedidoId && !pedidoId) {
      setPedidoId(parseInt(savedPedidoId));
    }
  }, []);

  const adicionarAoCarrinho = async (cursoId: number) => {
    try {
      const response = await api.post("/carrinho/adicionar", {
        cursoId,
        turmaId: null,
      });

      if (response.data.success) {
        await buscarCarrinho();
        setSnackbarMessage("Curso adicionado ao carrinho!");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(response.data.message || "Erro ao adicionar ao carrinho");
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      setSnackbarMessage(error.response?.data?.message || "Erro ao adicionar ao carrinho");
      setSnackbarOpen(true);
    }
  };

  const handleRemoveItem = async (carrinhoId: number) => {
    try {
      const response = await api.delete(`/carrinho/remover/${carrinhoId}`);

      if (response.data.success) {
        setCarrinho(carrinho.filter((item) => item.carrinhoId !== carrinhoId));
        setSnackbarMessage("Item removido do carrinho");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(response.data.message || "Erro ao remover item");
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      console.error("Erro ao remover item:", error);
      setSnackbarMessage(error.response?.data?.message || "Erro ao remover item do carrinho");
      setSnackbarOpen(true);
    }
  };

  const handleUpdateQuantity = async (carrinhoId: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) {
      handleRemoveItem(carrinhoId);
      return;
    }

    try {
      // Atualizar no backend
      const response = await api.put(`/carrinho/atualizar/${carrinhoId}`, {
        quantidade: novaQuantidade
      });

      if (response.data.success) {
        // Atualiza localmente
        setCarrinho(
          carrinho.map((item) =>
            item.carrinhoId === carrinhoId
              ? { ...item, quantidade: novaQuantidade }
              : item
          )
        );
      } else {
        setSnackbarMessage("Erro ao atualizar quantidade");
        setSnackbarOpen(true);
        // Reverter visualmente
        buscarCarrinho();
      }
    } catch (error) {
      setSnackbarMessage("Erro ao atualizar quantidade");
      setSnackbarOpen(true);
      buscarCarrinho();
    }
  };

  const handleAplicarCupom = () => {
    if (cupom === "BEMVINDO10") {
      setCupomAplicado(true);
      setSnackbarMessage("Cupom aplicado com sucesso! 10% de desconto.");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Cupom inválido");
      setSnackbarOpen(true);
    }
  };

  const handleFinalizarCompra = () => {
    if (carrinho.length === 0) {
      setSnackbarMessage("Carrinho vazio");
      setSnackbarOpen(true);
      return;
    }

    if (activeStep === 0) {
      setActiveStep(1);
      setPaymentDialogOpen(true);
    } else {
      handlePayment();
    }
  };

  const handleContinuarComprando = () => {
    navigate("/cursos");
  };

  // Função para criar o pedido antes do pagamento
  const criarPedido = async (): Promise<number | null> => {
    try {
      const subtotal = carrinho.reduce(
        (total, item) => total + item.valor * item.quantidade,
        0
      );
      const descontoCupom = cupomAplicado ? subtotal * 0.1 : 0;
      const total = subtotal - descontoCupom;

      // Chamar API para criar pedido
      const response = await api.post("/pix/gerar-cobranca", {
        valor: total,
        metodoPagamento: selectedPaymentMethod,
        cupom: cupomAplicado ? cupom : null,
        itens: carrinho.map(item => ({
          cursoId: item.cursoId,
          titulo: item.titulo,
          quantidade: item.quantidade,
          valor: item.valor
        }))
      });

      if (response.data.success) {
        const pedidoId = response.data.pedidoId;
        setPedidoId(pedidoId);
        setPedidoCriado(true);
        localStorage.setItem('ultimoPedidoId', pedidoId.toString());
        return pedidoId;
      } else {
        throw new Error(response.data.message || "Erro ao criar pedido");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao criar pedido");
    }
  };

 const handlePayment = async () => {
  if (carrinho.length === 0) {
    setSnackbarMessage("Carrinho vazio");
    setSnackbarOpen(true);
    return;
  }

  if (!selectedPaymentMethod) {
    setSnackbarMessage("Selecione um método de pagamento");
    setSnackbarOpen(true);
    return;
  }

  setLoading(true);
  setPaymentDialogOpen(false);

  try {
    // **Para PIX - Fluxo Correto:**
    if (selectedPaymentMethod === "pix") {
      // PASSO 1: Criar o pedido primeiro
      const pedidoResponse = await api.post("/pix/criar-pedido", {
        valor: total,
        metodoPagamento: "pix",
        cupom: cupomAplicado ? cupom : null,
        itens: carrinho.map(item => ({
          cursoId: item.cursoId,
          titulo: item.titulo,
          quantidade: item.quantidade,
          valor: item.valor
        }))
      });

      console.log("Resposta criar pedido:", pedidoResponse.data);

      if (!pedidoResponse.data.success) {
        throw new Error(pedidoResponse.data.message || "Erro ao criar pedido");
      }

      const pedidoId = pedidoResponse.data.pedidoId;
      
      // PASSO 2: Obter dados do usuário logado
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log("Dados do usuário:", userData);
      
      // PASSO 3: Gerar cobrança PIX com os dados CORRETOS
      const pixResponse = await api.post("/pix/gerar-cobranca", {
        pedidoId: pedidoId,                    // ← OBRIGATÓRIO
        alunoId: userData.id || userData.userId || 1, // ← OBRIGATÓRIO
        cpf: userData.cpf || "00000000000",    // ← OPCIONAL (pode ser null)
        nome: userData.nome || userData.name || "Cliente" // ← OPCIONAL
      });

      console.log("Resposta gerar cobrança PIX:", pixResponse.data);

      if (pixResponse.data.success) {
        // PASSO 4: Redirecionar para página do PIX
        navigate(`/pagamento/pix/${pedidoId}`, {
          state: {
            pixData: pixResponse.data,
            pedidoId: pedidoId,
            total: total
          }
        });
      } else {
        throw new Error(pixResponse.data.message || "Erro ao gerar PIX");
      }
    } 
    // **Para outros métodos (cartão/boleto) - manter igual:**
    else {
      const response = await api.post("/pagamento/criar-pagamento", {
        valorCurso: total,
        metodoPagamento: selectedPaymentMethod,
        cupom: cupomAplicado ? cupom : null,
        itens: carrinho.map(item => ({
          cursoId: item.cursoId,
          titulo: item.titulo,
          quantidade: item.quantidade
        }))
      });

      if (response.data.success && response.data.url) {
        if (response.data.pedidoId) {
          localStorage.setItem('ultimoPedidoId', response.data.pedidoId);
        }
        window.location.href = response.data.url;
      } else {
        throw new Error(response.data.message || "Erro ao criar pagamento");
      }
    }
  } catch (error: any) {
    console.error("Erro detalhado:", error);
    setSnackbarMessage(
      error.response?.data?.message || 
      error.message || 
      "Erro ao processar pagamento. Tente novamente."
    );
    setSnackbarOpen(true);
    setActiveStep(0);
  } finally {
    setLoading(false);
  }
};

  const limparCarrinho = () => {
    // Limpar carrinho no backend
    carrinho.forEach(item => {
      api.delete(`/carrinho/remover/${item.carrinhoId}`).catch(console.error);
    });
    
    // Limpar carrinho local
    setCarrinho([]);
  };

  const verificarStatusPedido = async (pedidoId: number) => {
    try {
      const response = await api.get(`/pagamento/verificar-status/${pedidoId}`);
      
      if (response.data.pedido === "Aprovado" || response.data.status === "aprovado") {
        setSnackbarMessage("Pagamento confirmado! Você já pode acessar seus cursos.");
        setSnackbarOpen(true);
        setActiveStep(2);
        
        // Limpar carrinho
        limparCarrinho();
        localStorage.removeItem('ultimoPedidoId');
        
        // Redirecionar para meus cursos após 3 segundos
        setTimeout(() => {
          navigate("/meus-cursos");
        }, 3000);
      } else if (response.data.pedido === "Pendente" || response.data.status === "pendente") {
        // Pedido ainda pendente, continuar verificando
        setTimeout(() => verificarStatusPedido(pedidoId), 5000);
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      // Tentar novamente após 10 segundos
      setTimeout(() => verificarStatusPedido(pedidoId), 10000);
    }
  };

  const handleVoltarParaCarrinho = () => {
    setActiveStep(0);
    setSelectedPaymentMethod(null);
  };

  const steps = ["Carrinho", "Pagamento", "Confirmação"];

  // Cálculos
  const subtotal = carrinho.reduce(
    (total, item) => total + item.valor * item.quantidade,
    0
  );
  const descontoCupom = cupomAplicado ? subtotal * 0.1 : 0;
  const total = subtotal - descontoCupom;

  if (loadingCarrinho) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando carrinho...</Typography>
      </Box>
    );
  }

  // Página de confirmação
  if (activeStep === 2) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, mb: 6 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 3 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Compra Finalizada com Sucesso!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Obrigado pela sua compra. O pagamento foi processado com sucesso.
          </Typography>
          
          {pedidoId && (
            <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="body2">
                Número do pedido: <strong>#{pedidoId}</strong>
              </Typography>
              <Typography variant="body2">
                Valor total: <strong>R$ {total.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2">
                Método de pagamento: <strong>{selectedPaymentMethod === 'pix' ? 'PIX' : selectedPaymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'Boleto Bancário'}</strong>
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/meus-cursos")}
            >
              Ver Meus Cursos
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/cursos")}
            >
              Continuar Comprando
            </Button>
          </Box>
          
          <Alert severity="info" sx={{ mt: 4 }}>
            Você receberá um e-mail com os detalhes da compra e acesso aos cursos.
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <>
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

        {/* Botão de voltar quando no passo 1 */}
        {activeStep === 1 && (
          <Button
            startIcon={<ArrowBack />}
            onClick={handleVoltarParaCarrinho}
            sx={{ mb: 3 }}
          >
            Voltar para Carrinho
          </Button>
        )}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* Lista de itens - só mostra no passo 0 */}
          {activeStep === 0 && (
            <Box sx={{ flex: "1 1 600px" }}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    <ShoppingCart sx={{ verticalAlign: "middle", mr: 2 }} />
                    Meu Carrinho
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {carrinho.length} {carrinho.length === 1 ? "item" : "itens"}
                  </Typography>
                </Box>

                {carrinho.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <ShoppingCart
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Seu carrinho está vazio
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ArrowBack />}
                      onClick={() => navigate("/cursos")}
                      sx={{ mt: 2 }}
                    >
                      Continuar Comprando
                    </Button>
                  </Box>
                ) : (
                  <List>
                    {carrinho.map((item) => (
                      <React.Fragment key={item.carrinhoId}>
                        <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              mr: 3,
                              borderRadius: 1,
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            <Box
                              component="img"
                              src={item.imagem}
                              alt={item.titulo}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/default-course.jpg";
                              }}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
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
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  Duração: {item.duracaoHoras}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      border: "1px solid",
                                      borderColor: "divider",
                                      borderRadius: 1,
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.carrinhoId,
                                          item.quantidade - 1
                                        )
                                      }
                                      disabled={loading}
                                    >
                                      <Remove fontSize="small" />
                                    </IconButton>
                                    <Typography sx={{ px: 2 }}>
                                      {item.quantidade}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.carrinhoId,
                                          item.quantidade + 1
                                        )
                                      }
                                      disabled={loading}
                                    >
                                      <Add fontSize="small" />
                                    </IconButton>
                                  </Box>
                                  <Chip
                                    label={`R$ ${(
                                      item.valor * item.quantidade
                                    ).toFixed(2)}`}
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
                              onClick={() => handleRemoveItem(item.carrinhoId)}
                              color="error"
                              disabled={loading}
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
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    placeholder="Digite seu cupom"
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    disabled={cupomAplicado || loading}
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: cupomAplicado && (
                        <LocalOffer color="success" />
                      ),
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAplicarCupom}
                    disabled={cupomAplicado || !cupom || loading}
                  >
                    {cupomAplicado ? "Aplicado" : "Aplicar"}
                  </Button>
                </Box>

                {cupomAplicado && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Cupom aplicado com sucesso! 10% de desconto.
                  </Alert>
                )}
              </Paper>
            </Box>
          )}

          {/* Resumo do pedido */}
          <Box sx={{ flex: "1 1 300px", position: "sticky", top: 20 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {activeStep === 0 ? "Resumo do Pedido" : "Finalizar Pagamento"}
              </Typography>

              {activeStep === 0 && (
                <>
                  <Box sx={{ mb: 3 }}>
                    {/* Subtotal */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Subtotal
                      </Typography>
                      <Typography variant="body1">
                        R$ {subtotal.toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Desconto */}
                    {descontoCupom > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
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
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Total
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        R$ {total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Botões de ação */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                      ) : (
                        "Finalizar Compra"
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
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: "grey.50",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Security color="success" />
                    <Typography variant="caption" color="text.secondary">
                      Compra 100% segura. Dados protegidos.
                    </Typography>
                  </Box>
                </>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>Método selecionado:</strong> {
                      paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || "Nenhum"
                    }
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Total: R$ {total.toFixed(2)}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handlePayment}
                    disabled={!selectedPaymentMethod || loading}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Processando...
                      </>
                    ) : selectedPaymentMethod === 'pix' ? (
                      "Pagar com PIX"
                    ) : (
                      "Pagar com Mercado Pago"
                    )}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleVoltarParaCarrinho}
                    disabled={loading}
                  >
                    Alterar método de pagamento
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Métodos de pagamento - só mostra no passo 0 */}
            {activeStep === 0 && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Aceitamos
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {paymentMethods.map((method) => (
                    <Box key={method.id} sx={{ textAlign: "center" }}>
                      {method.icon}
                      <Typography variant="caption">{method.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}

            {/* Benefícios */}
            {activeStep === 0 && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Benefícios incluídos
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">Acesso vitalício</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">Certificado digital</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">Suporte por 1 ano</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">30 dias de garantia</Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>

      {/* Dialog de seleção de pagamento */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
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
                  cursor: "pointer",
                  border:
                    selectedPaymentMethod === method.id
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                  bgcolor:
                    selectedPaymentMethod === method.id
                      ? "primary.light"
                      : "white",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {method.icon}
                  <Typography variant="body1" fontWeight="medium">
                    {method.name}
                  </Typography>
                </Box>

                {method.type === "pix" && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Pagamento instantâneo com QR Code
                  </Typography>
                )}

                {method.type === "card" && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Parcele em até 12x
                  </Typography>
                )}

                {method.type === "boleto" && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Pagamento em até 3 dias úteis
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
          >
            {loading ? "Processando..." : "Continuar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default CarrinhoPage;