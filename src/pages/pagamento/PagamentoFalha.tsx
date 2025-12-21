import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import {
  Error,
  ShoppingCart,
  Home,
  SupportAgent,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PagamentoFalha: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar userType="aluno" />
      
      <Container maxWidth="md" sx={{ mt: 12, mb: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Error sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
          
          <Typography variant="h3" fontWeight="bold" gutterBottom color="error.main">
            Pagamento Não Aprovado
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Houve um problema ao processar seu pagamento
          </Typography>
          
          <Alert severity="error" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="body1">
              O pagamento não foi aprovado. Verifique os dados informados e tente novamente.
            </Typography>
          </Alert>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3,
            mt: 4,
            flexWrap: 'wrap'
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => navigate('/carrinho')}
              sx={{ minWidth: 200 }}
            >
              Tentar Novamente
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{ minWidth: 200 }}
            >
              Voltar para Home
            </Button>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" gutterBottom>
              Precisa de ajuda?
            </Typography>
            <Button
              variant="text"
              startIcon={<SupportAgent />}
              onClick={() => window.open('mailto:suporte@clubemecanico.com')}
            >
              Entre em contato com o suporte
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default PagamentoFalha;