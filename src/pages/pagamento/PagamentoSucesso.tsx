import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  CheckCircle,
  ShoppingBag,
  Home,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PagamentoSucesso: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar userType="aluno" />
      
      <Container maxWidth="md" sx={{ mt: 12, mb: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          
          <Typography variant="h3" fontWeight="bold" gutterBottom color="success.main">
            Pagamento Aprovado!
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Seu pagamento foi processado com sucesso
          </Typography>
          
          <Alert severity="success" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="body1">
              Em instantes você receberá acesso completo aos cursos. Um e-mail de confirmação foi enviado.
            </Typography>
          </Alert>
          
          <Card sx={{ mt: 3, bgcolor: 'primary.light' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Próximos passos:
              </Typography>
              <Box sx={{ textAlign: 'left', pl: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  1. Acesse sua área do aluno
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  2. Encontre seus cursos na seção "Meus Cursos"
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  3. Comece a estudar imediatamente
                </Typography>
                <Typography variant="body2">
                  4. Baixe seu certificado após conclusão
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
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
              startIcon={<ShoppingBag />}
              onClick={() => navigate('/aluno/dashboard')}
              sx={{ minWidth: 200 }}
            >
              Acessar Meus Cursos
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
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Dúvidas? Entre em contato: suporte@clubemecanico.com
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default PagamentoSucesso;