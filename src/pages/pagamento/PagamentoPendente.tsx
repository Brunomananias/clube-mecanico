import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Schedule,
  Home,
  Mail,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PagamentoPendente: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar userType="aluno" />
      
      <Container maxWidth="md" sx={{ mt: 12, mb: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Schedule sx={{ fontSize: 80, color: 'warning.main', mb: 3 }} />
          
          <Typography variant="h3" fontWeight="bold" gutterBottom color="warning.main">
            Pagamento em Análise
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Seu pagamento está sendo processado
          </Typography>
          
          <CircularProgress sx={{ mt: 3, mb: 3 }} />
          
          <Alert severity="info" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="body1">
              Para pagamentos via boleto bancário ou transferência, 
              a confirmação pode levar até 3 dias úteis.
            </Typography>
          </Alert>
          
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <Typography variant="body1" gutterBottom>
              <strong>O que acontece agora:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              1. Aguarde a confirmação do pagamento
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              2. Você receberá um e-mail quando for aprovado
            </Typography>
            <Typography variant="body2">
              3. O acesso aos cursos será liberado automaticamente
            </Typography>
          </Box>
          
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
              startIcon={<Mail />}
              onClick={() => window.location.href = 'mailto:'}
              sx={{ minWidth: 200 }}
            >
              Verificar E-mail
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
        </Paper>
      </Container>
    </>
  );
};

export default PagamentoPendente;