/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/PagamentosPage.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Pagination,
  Stack,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Search,
  Visibility,
  Download,
  CreditCard,
  AccountBalance,
  QrCode2,
  Receipt,
  CheckCircle,
  PendingActions,
  Cancel,
  Refresh,
  FilterList,
  AttachMoney,
  ExpandMore,
  School,
  Schedule,
  DateRange,
  CalendarToday,
  Group,
  Payments,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../../config/api";
import Swal from "sweetalert2";

interface Pagamento {
  id: number;
  pedidoId: number;
  numeroPedido: string;
  aluno?: {
    id: number;
    nome_Completo: string;
    email: string;
  };
  itens: ItemPedido[];
  metodoPagamento: string;
  valor: number;
  status: string;
  statusDetail: string;
  codigoTransacao: string;
  dataPagamento: string;
  dataCriacao: string;
  mpPaymentId: string;
  tipoPagamento: string;
  parcelas: number;
  bandeira: string;
  ultimosDigitos: string;
}

interface ItemPedido {
  id: number;
  cursoId: number;
  nomeCurso: string;
  preco: number;
  turmaId?: number;
  dataInicio?: string;  
  dataFim?: string;     
  horario?: string;     
  statusTurma?: string;
}

interface Estatisticas {
  totalAprovados: number;
  totalPendentes: number;
  totalCancelados: number;
  valorTotalAprovado: number;
}

interface PagamentoResponse {
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
  itensPorPagina: number;
  pagamentos: Pagamento[];
  estatisticas: Estatisticas;
}

const PagamentosAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filteredPagamentos, setFilteredPagamentos] = useState<Pagamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "todos" | "approved" | "pending" | "cancelled"
  >("todos");
  const [filterMetodo, setFilterMetodo] = useState<
    "todos" | "credit_card" | "debit_card" | "pix" | "ticket"
  >("todos");
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pagamentosPorPagina] = useState(15);
  
  // Estados para filtros de data
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");
  
  // Estados para o modal de detalhes
  const [modalOpen, setModalOpen] = useState(false);
  const [pagamentoDetalhes, setPagamentoDetalhes] = useState<Pagamento | null>(null);

  const buscarPagamentos = async () => {
    try {
      setLoading(true);
      const params: any = {
        pagina: paginaAtual,
        itensPorPagina: pagamentosPorPagina,
      };

      if (dataInicio) {
        params.dataInicio = dataInicio;
      }
      if (dataFim) {
        params.dataFim = dataFim;
      }
      if (filterStatus !== 'todos') {
        params.status = filterStatus;
      }
      if (filterMetodo !== 'todos') {
        params.metodoPagamento = filterMetodo;
      }

      const response = await api.get<PagamentoResponse>("/pagamento/listar-todos", { params });
      setPagamentos(response.data.pagamentos || []);
      setFilteredPagamentos(response.data.pagamentos || []);
      setEstatisticas(response.data.estatisticas);
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao carregar pagamentos",
        icon: "error",
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPagamentos();
  }, [paginaAtual, filterStatus, filterMetodo, dataInicio, dataFim]);

  // Filtrar pagamentos localmente (para busca por texto)
  useEffect(() => {
    let resultado = pagamentos || [];

    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      resultado = resultado.filter(
        (pagamento) =>
          (pagamento.numeroPedido || '').toLowerCase().includes(termo) ||
          (pagamento.aluno?.nome_Completo || '').toLowerCase().includes(termo) ||
          (pagamento.aluno?.email || '').toLowerCase().includes(termo) ||
          (pagamento.codigoTransacao || '').toLowerCase().includes(termo) ||
          (pagamento.mpPaymentId || '').toLowerCase().includes(termo) ||
          (pagamento.itens || []).some(item => 
            (item.nomeCurso || '').toLowerCase().includes(termo)
          )
      );
    }

    setFilteredPagamentos(resultado);
    setPaginaAtual(1); // Reseta para primeira página ao filtrar
  }, [searchTerm, pagamentos]);

  // Cálculos para paginação
  const indiceUltimoPagamento = paginaAtual * pagamentosPorPagina;
  const indicePrimeiroPagamento = indiceUltimoPagamento - pagamentosPorPagina;
  const pagamentosPaginaAtual = filteredPagamentos.slice(
    indicePrimeiroPagamento,
    indiceUltimoPagamento
  );
  const totalPaginas = Math.ceil((filteredPagamentos?.length || 0) / pagamentosPorPagina);

  const handleMudarPagina = (_event: React.ChangeEvent<unknown>, valor: number) => {
    setPaginaAtual(valor);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const formatarData = (data: string | undefined | null): string => {
    if (!data) return "N/A";
    
    try {
      // Tenta converter a data
      const dataObj = new Date(data);
      
      // Verifica se a data é válida
      if (isNaN(dataObj.getTime())) {
        return "Data inválida";
      }
      
      // Formata a data manualmente
      const dia = dataObj.getDate().toString().padStart(2, '0');
      const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataObj.getFullYear();
      const horas = dataObj.getHours().toString().padStart(2, '0');
      const minutos = dataObj.getMinutes().toString().padStart(2, '0');
      
      return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    } catch (error) {
      console.error("Erro ao formatar data:", error, data);
      return "Erro na data";
    }
  };

  const formatarDataCurta = (data: string | undefined | null): string => {
    if (!data) return "N/A";
    
    try {
      const dataObj = new Date(data);
      
      if (isNaN(dataObj.getTime())) {
        return "Data inválida";
      }
      
      const dia = dataObj.getDate().toString().padStart(2, '0');
      const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataObj.getFullYear();
      
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      return "Data inválida";
    }
  };

  const formatarValor = (valor: number | undefined): string => {
    if (valor === undefined || valor === null) {
      return "R$ 0,00";
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusColor = (status: string | undefined): "success" | "warning" | "info" | "error" | "default" => {
    const statusStr = (status || '').toLowerCase();
    
    switch (statusStr) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in_process':
        return 'info';
      case 'cancelled':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string | undefined): string => {
    const statusMap: Record<string, string> = {
      'approved': 'Aprovado',
      'pending': 'Pendente',
      'in_process': 'Processando',
      'cancelled': 'Cancelado',
      'rejected': 'Rejeitado',
      'refunded': 'Reembolsado',
      'charged_back': 'Chargeback',
    };
    
    const statusKey = (status || '').toLowerCase();
    return statusMap[statusKey] || status || "Desconhecido";
  };

  const getStatusTurmaColor = (status: string | undefined): "success" | "warning" | "info" | "error" | "default" => {
    const statusStr = (status || '').toLowerCase();
    
    switch (statusStr) {
      case 'ativa':
      case 'andamento':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'programada':
        return 'info';
      case 'cancelada':
      case 'encerrada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusTurmaText = (status: string | undefined): string => {
    const statusMap: Record<string, string> = {
      'ativa': 'Ativa',
      'pendente': 'Pendente',
      'andamento': 'Em Andamento',
      'programada': 'Programada',
      'cancelada': 'Cancelada',
      'encerrada': 'Encerrada',
    };
    
    const statusKey = (status || '').toLowerCase();
    return statusMap[statusKey] || status || "Não definido";
  };

  const getMetodoPagamentoIcon = (metodo: string | undefined) => {
    const metodoStr = metodo || '';
    
    switch (metodoStr) {
      case 'credit_card':
        return <CreditCard fontSize="small" />;
      case 'debit_card':
        return <AccountBalance fontSize="small" />;
      case 'pix':
        return <QrCode2 fontSize="small" />;
      case 'ticket':
        return <Receipt fontSize="small" />;
      default:
        return <CreditCard fontSize="small" />;
    }
  };

  const getMetodoPagamentoText = (metodo: string | undefined): string => {
    const metodos: Record<string, string> = {
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'pix': 'PIX',
      'ticket': 'Boleto',
      'account_money': 'Saldo MP',
    };
    
    return metodos[metodo || ''] || metodo || "Não informado";
  };

  const abrirModalDetalhes = (pagamento: Pagamento) => {
    setPagamentoDetalhes(pagamento);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setPagamentoDetalhes(null);
  };

  const handleExportarCSV = () => {
    try {
      const headers = [
        'ID',
        'Número Pedido',
        'Aluno',
        'Email',
        'Método Pagamento',
        'Valor',
        'Status',
        'Data Pagamento',
        'Transação',
        'Tipo',
        'Parcelas',
        'Bandeira',
        'Cursos',
        'Valor Curso',
        'Turma ID',
        'Data Início Turma',
        'Data Fim Turma'
      ];

      const rows = (pagamentos || []).map(p => {
        const cursos = (p.itens || []).map(i => i.nomeCurso).join('; ');
        const primeiroItem = (p.itens || [])[0];
        
        return [
          p.id || '',
          p.numeroPedido || 'N/A',
          p.aluno?.nome_Completo || 'N/A',
          p.aluno?.email || 'N/A',
          getMetodoPagamentoText(p.metodoPagamento),
          (p.valor || 0).toFixed(2),
          getStatusText(p.status),
          formatarData(p.dataPagamento),
          p.codigoTransacao || 'N/A',
          p.tipoPagamento || 'N/A',
          p.parcelas || '1',
          p.bandeira || 'N/A',
          cursos || 'N/A',
          primeiroItem?.preco?.toFixed(2) || '0.00',
          primeiroItem?.turmaId || 'N/A',
          formatarDataCurta(primeiroItem?.dataInicio),
          formatarDataCurta(primeiroItem?.dataFim)
        ];
      });

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      // Usando Date diretamente em vez de format
      const hoje = new Date();
      const dataFormatada = `${hoje.getFullYear()}-${(hoje.getMonth() + 1).toString().padStart(2, '0')}-${hoje.getDate().toString().padStart(2, '0')}`;
      link.setAttribute('download', `pagamentos_${dataFormatada}.csv`);
      
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao exportar dados",
        icon: "error",
      });
    }
  };

  const handleReenviarWebhook = async (pagamento: Pagamento) => {
    try {
      const result = await Swal.fire({
        title: "Reenviar Webhook?",
        text: "Isso irá solicitar a atualização do status diretamente ao Mercado Pago.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#1976d2",
        cancelButtonColor: "#757575",
        confirmButtonText: "Sim, reenviar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await api.post(`/pagamento/webhook/simular`, {
          paymentId: pagamento.mpPaymentId
        });

        Swal.fire({
          title: "Sucesso!",
          text: "Webhook reenviado com sucesso",
          icon: "success",
          timer: 2000,
        });

        // Recarrega os dados após um pequeno delay
        setTimeout(() => {
          buscarPagamentos();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao reenviar webhook:", error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao reenviar webhook",
        icon: "error",
      });
    }
  };

  const limparFiltros = () => {
    setSearchTerm("");
    setFilterStatus("todos");
    setFilterMetodo("todos");
    setDataInicio("");
    setDataFim("");
    setPaginaAtual(1);
  };

  // Se não tiver pagamentos, mostra estado vazio
  if (!loading && (!pagamentos || pagamentos.length === 0) && !searchTerm && !dataInicio && !dataFim) {
    return (
      <>
        <Navbar userType="admin" />
        <Container maxWidth="xl" sx={{ mt: 11, mb: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                <Payments sx={{ verticalAlign: "middle", mr: 2 }} />
                Gerenciamento de Pagamentos
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Visualize e gerencie todos os pagamentos do sistema
              </Typography>
            </Box>
          </Box>
          
          <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
            <Payments sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum pagamento encontrado no sistema
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Quando houver pagamentos, eles aparecerão aqui.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/dashboard")}
            >
              Voltar para Dashboard
            </Button>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar userType="admin" />
      <Container maxWidth="xl" sx={{ mt: 11, mb: 6 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
              <Payments sx={{ verticalAlign: "middle", mr: 2 }} />
              Gerenciamento de Pagamentos
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Visualize e gerencie todos os pagamentos do sistema
            </Typography>
          </Box>
        </Box>

        {/* Cards de Estatísticas */}
        {estatisticas && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                      <AttachMoney />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {formatarValor(estatisticas.valorTotalAprovado)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Aprovado
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <CheckCircle />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {estatisticas.totalAprovados}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pagamentos Aprovados
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                      <PendingActions />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {estatisticas.totalPendentes}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pagamentos Pendentes
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                      <Cancel />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {estatisticas.totalCancelados}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pagamentos Cancelados
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
            {/* Campo de busca */}
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                placeholder="Buscar por pedido, aluno, transação, curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {/* Filtro de Data */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                label="Data Início"
                type="date"
                size="small"
                sx={{ width: 150 }}
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                slotProps={{
                  input: {
                    sx: { fontSize: '0.875rem' }
                  }
                }}
              />
              <Typography>-</Typography>
              <TextField
                label="Data Fim"
                type="date"
                size="small"
                sx={{ width: 150 }}
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                slotProps={{
                  input: {
                    sx: { fontSize: '0.875rem' }
                  }
                }}
              />
            </Box>

            {/* Filtro de Status */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="Todos"
                onClick={() => setFilterStatus("todos")}
                color={filterStatus === "todos" ? "primary" : "default"}
                variant={filterStatus === "todos" ? "filled" : "outlined"}
                size="small"
              />
              <Chip
                label="Aprovados"
                onClick={() => setFilterStatus("approved")}
                color={filterStatus === "approved" ? "primary" : "default"}
                variant={filterStatus === "approved" ? "filled" : "outlined"}
                size="small"
                icon={<CheckCircle />}
              />
              <Chip
                label="Pendentes"
                onClick={() => setFilterStatus("pending")}
                color={filterStatus === "pending" ? "primary" : "default"}
                variant={filterStatus === "pending" ? "filled" : "outlined"}
                size="small"
                icon={<PendingActions />}
              />
              <Chip
                label="Cancelados"
                onClick={() => setFilterStatus("cancelled")}
                color={filterStatus === "cancelled" ? "primary" : "default"}
                variant={filterStatus === "cancelled" ? "filled" : "outlined"}
                size="small"
                icon={<Cancel />}
              />
            </Box>

            {/* Filtro de Método */}
            <Select
              size="small"
              value={filterMetodo}
              onChange={(e) => setFilterMetodo(e.target.value as any)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="todos">Todos métodos</MenuItem>
              <MenuItem value="credit_card">Cartão de Crédito</MenuItem>
              <MenuItem value="debit_card">Cartão de Débito</MenuItem>
              <MenuItem value="pix">PIX</MenuItem>
              <MenuItem value="ticket">Boleto</MenuItem>
            </Select>

            {/* Botões de Ação */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={limparFiltros}
                size="small"
              >
                Limpar
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={buscarPagamentos}
                size="small"
              >
                Atualizar
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExportarCSV}
                size="small"
              >
                Exportar
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Contador e Info de Paginação */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h6">
            {filteredPagamentos?.length || 0} pagamentos encontrados
            {totalPaginas > 1 && ` (Página ${paginaAtual} de ${totalPaginas})`}
          </Typography>
          
          {totalPaginas > 1 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Mostrando {pagamentosPorPagina} por página
              </Typography>
              <Pagination
                count={totalPaginas}
                page={paginaAtual}
                onChange={handleMudarPagina}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Stack>
          )}
        </Box>

        {/* Lista de Pagamentos */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (!filteredPagamentos || filteredPagamentos.length === 0) ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Payments sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum pagamento encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tente alterar os filtros de busca
            </Typography>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.light" }}>
                    <TableCell>Pedido</TableCell>
                    <TableCell>Aluno</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Cursos</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(pagamentosPaginaAtual || []).map((pagamento) => (
                    <TableRow key={pagamento.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {pagamento.numeroPedido || "N/A"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {pagamento.pedidoId || "N/A"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {pagamento.aluno?.nome_Completo || "N/A"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pagamento.aluno?.email || ""}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          {formatarValor(pagamento.valor)}
                        </Typography>
                        {pagamento.parcelas > 1 && (
                          <Typography variant="caption" color="text.secondary">
                            {pagamento.parcelas}x
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {getMetodoPagamentoIcon(pagamento.metodoPagamento)}
                          <Typography variant="body2">
                            {getMetodoPagamentoText(pagamento.metodoPagamento)}
                          </Typography>
                        </Box>
                        {pagamento.bandeira && (
                          <Typography variant="caption" color="text.secondary">
                            {pagamento.bandeira}
                            {pagamento.ultimosDigitos && ` •••• ${pagamento.ultimosDigitos}`}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(pagamento.status)}
                          color={getStatusColor(pagamento.status)}
                          size="small"
                          icon={pagamento.status === 'approved' ? <CheckCircle /> : undefined}
                        />
                        {pagamento.statusDetail && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {pagamento.statusDetail}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatarData(pagamento.dataPagamento)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          {(pagamento.itens || []).slice(0, 2).map((item, index) => (
                            <Typography 
                              key={item.id} 
                              variant="caption" 
                              display="block" 
                              color="text.secondary"
                              sx={{ 
                                whiteSpace: 'nowrap', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                maxWidth: '150px'
                              }}
                            >
                              • {item.nomeCurso || `Curso ${index + 1}`}
                            </Typography>
                          ))}
                          {(pagamento.itens || []).length > 2 && (
                            <Typography variant="caption" color="primary">
                              +{(pagamento.itens || []).length - 2} mais
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          <Tooltip title="Ver detalhes">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => abrirModalDetalhes(pagamento)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reenviar webhook">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleReenviarWebhook(pagamento)}
                            >
                              <Refresh fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginação Inferior */}
            {totalPaginas > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 3,
                mb: 4
              }}>
                <Stack spacing={2} alignItems="center">
                  <Pagination
                    count={totalPaginas}
                    page={paginaAtual}
                    onChange={handleMudarPagina}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Mostrando {indicePrimeiroPagamento + 1} a {Math.min(indiceUltimoPagamento, filteredPagamentos.length)} de {filteredPagamentos.length} pagamentos
                  </Typography>
                </Stack>
              </Box>
            )}
          </>
        )}

        {/* Botão voltar */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/dashboard")}
          >
            Voltar para Dashboard
          </Button>
        </Box>

        {/* Modal de Detalhes */}
        <Dialog 
          open={modalOpen} 
          onClose={fecharModal}
          maxWidth="md"
          fullWidth
        >
          {pagamentoDetalhes && (
            <>
              <DialogTitle>
                Detalhes do Pagamento
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {/* Coluna Esquerda */}
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        INFORMAÇÕES DO PEDIDO
                      </Typography>
                      <Box sx={{ pl: 1 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Número do Pedido:</strong> {pagamentoDetalhes.numeroPedido || "N/A"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>ID do Pedido:</strong> {pagamentoDetalhes.pedidoId || "N/A"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Data do Pagamento:</strong> {formatarData(pagamentoDetalhes.dataPagamento)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Data de Criação:</strong> {formatarData(pagamentoDetalhes.dataCriacao)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        INFORMAÇÕES DO ALUNO
                      </Typography>
                      <Box sx={{ pl: 1 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Nome:</strong> {pagamentoDetalhes.aluno?.nome_Completo || "N/A"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Email:</strong> {pagamentoDetalhes.aluno?.email || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>ID do Aluno:</strong> {pagamentoDetalhes.aluno?.id || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Coluna Direita */}
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        INFORMAÇÕES DE PAGAMENTO
                      </Typography>
                      <Box sx={{ pl: 1 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Valor Total:</strong> {formatarValor(pagamentoDetalhes.valor)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Status:</strong>{" "}
                          <Chip
                            label={getStatusText(pagamentoDetalhes.status)}
                            color={getStatusColor(pagamentoDetalhes.status)}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Status Detail:</strong> {pagamentoDetalhes.statusDetail || "N/A"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Método:</strong> {getMetodoPagamentoText(pagamentoDetalhes.metodoPagamento)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Tipo:</strong> {pagamentoDetalhes.tipoPagamento || "N/A"}
                        </Typography>
                        {pagamentoDetalhes.parcelas > 0 && (
                          <Typography variant="body2">
                            <strong>Parcelas:</strong> {pagamentoDetalhes.parcelas}x
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        INFORMAÇÕES DA TRANSAÇÃO
                      </Typography>
                      <Box sx={{ pl: 1 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Código Transação:</strong> {pagamentoDetalhes.codigoTransacao || "N/A"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>ID Mercado Pago:</strong> {pagamentoDetalhes.mpPaymentId || "N/A"}
                        </Typography>
                        {pagamentoDetalhes.bandeira && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Bandeira:</strong> {pagamentoDetalhes.bandeira}
                          </Typography>
                        )}
                        {pagamentoDetalhes.ultimosDigitos && (
                          <Typography variant="body2">
                            <strong>Últimos Dígitos:</strong> •••• {pagamentoDetalhes.ultimosDigitos}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* NOVA SEÇÃO: INFORMAÇÕES DOS CURSOS/TURMAS */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    CURSOS E TURMAS
                  </Typography>
                  {(!pagamentoDetalhes.itens || pagamentoDetalhes.itens.length === 0) ? (
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                      Nenhum curso encontrado neste pedido.
                    </Typography>
                  ) : (
                    <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">
                          <strong>{pagamentoDetalhes.itens.length} curso(s) comprado(s)</strong>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <List dense disablePadding>
                          {pagamentoDetalhes.itens.map((item, index) => (
                            <React.Fragment key={item.id}>
                              <ListItem sx={{ px: 0, py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light' }}>
                                    <School fontSize="small" />
                                  </Avatar>
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography variant="subtitle2">
                                      {item.nomeCurso || `Curso ${index + 1}`}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box sx={{ mt: 1 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                          <AttachMoney fontSize="small" sx={{ fontSize: 14 }} />
                                          <Typography variant="caption">
                                            <strong>Valor:</strong> {formatarValor(item.preco)}
                                          </Typography>
                                        </Box>
                                        
                                        {item.turmaId && (
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Group fontSize="small" sx={{ fontSize: 14 }} />
                                            <Typography variant="caption">
                                              <strong>Turma ID:</strong> {item.turmaId}
                                            </Typography>
                                          </Box>
                                        )}
                                        
                                        {item.statusTurma && (
                                          <Chip
                                            label={getStatusTurmaText(item.statusTurma)}
                                            color={getStatusTurmaColor(item.statusTurma)}
                                            size="small"
                                            sx={{ height: 20 }}
                                          />
                                        )}
                                      </Box>
                                      
                                      {(item.dataInicio || item.dataFim || item.horario) && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                                          {item.dataInicio && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                              <CalendarToday fontSize="small" sx={{ fontSize: 12 }} />
                                              <Typography variant="caption">
                                                <strong>Início:</strong> {formatarDataCurta(item.dataInicio)}
                                              </Typography>
                                            </Box>
                                          )}
                                          
                                          {item.dataFim && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                              <DateRange fontSize="small" sx={{ fontSize: 12 }} />
                                              <Typography variant="caption">
                                                <strong>Término:</strong> {formatarDataCurta(item.dataFim)}
                                              </Typography>
                                            </Box>
                                          )}
                                          
                                          {item.horario && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                              <Schedule fontSize="small" sx={{ fontSize: 14 }} />
                                              <Typography variant="caption">
                                                <strong>Horário:</strong> {item.horario}
                                              </Typography>
                                            </Box>
                                          )}
                                        </Box>
                                      )}
                                    </Box>
                                  }
                                />
                              </ListItem>
                              {index < pagamentoDetalhes.itens.length - 1 && (
                                <Divider component="li" />
                              )}
                            </React.Fragment>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={fecharModal}>Fechar</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </>
  );
};

export default PagamentosAdminPage;