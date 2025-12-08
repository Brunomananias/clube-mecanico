import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person,
  School,
  MenuBook,
  CardMembership,
  Download,
  Visibility,
  Edit,
  Email,
  Phone,
  LocationOn,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AlunoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'aluno@clube.com';
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Dados do aluno
  const studentData = {
    nome: "Carlos Silva",
    email: userEmail,
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    dataCadastro: "15/03/2024",
    nivel: "Intermediário",
    status: "Ativo"
  };

  // Cursos comprados
  const purchasedCourses = [
    { 
      id: 1, 
      nome: "Mecânica de Bicicletas Básico", 
      dataCompra: "10/03/2024",
      valor: "R$ 297,00",
      status: "Em andamento",
      progresso: 75,
      ultimoAcesso: "Hoje, 14:30",
      icone: "🚲"
    },
    { 
      id: 2, 
      nome: "Manutenção de Freios Hidráulicos", 
      dataCompra: "05/03/2024",
      valor: "R$ 197,00",
      status: "Em andamento",
      progresso: 30,
      ultimoAcesso: "Ontem, 10:15",
      icone: "🔧"
    },
    { 
      id: 3, 
      nome: "Suspensão e Geometria Avançada", 
      dataCompra: "01/03/2024",
      valor: "R$ 397,00",
      status: "Não iniciado",
      progresso: 0,
      ultimoAcesso: "Não acessado",
      icone: "⚙️"
    },
  ];

  // Conteúdos complementares
  const complementaryContent = [
    { id: 1, titulo: "E-book: Guia de Ferramentas", tipo: "PDF", download: true, cor: "#4CAF50" },
    { id: 2, titulo: "Vídeo: Dicas de Manutenção", tipo: "Vídeo", download: false, cor: "#FF5722" },
    { id: 3, titulo: "Planilha de Controle", tipo: "Excel", download: true, cor: "#2196F3" },
    { id: 4, titulo: "Webinar Exclusivo", tipo: "Gravação", download: true, cor: "#9C27B0" },
  ];

  // Certificados
  const certificates = [
    { 
      id: 1, 
      curso: "Introdução à Mecânica", 
      dataEmissao: "20/02/2024",
      codigo: "CERT-2024-00123",
      horas: 20,
      status: "Válido"
    },
    { 
      id: 2, 
      curso: "Segurança no Trabalho", 
      dataEmissao: "15/01/2024",
      codigo: "CERT-2024-00087",
      horas: 15,
      status: "Válido"
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <>
      <Navbar userType="aluno" userEmail={userEmail} />
      
      <Container maxWidth="xl" sx={{ mt: 10, mb: 6 }}>
        {/* Cabeçalho */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              <Person sx={{ verticalAlign: 'middle', mr: 2, fontSize: 40 }} />
              Painel do Aluno
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gerencie seus cursos, certificados e dados pessoais
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => navigate('/editar-perfil')}
            >
              Editar Perfil
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Person />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Box>
        </Box>

        {/* Abas principais */}
        <Paper sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<Person />} label="Dados Cadastrais" />
            <Tab icon={<School />} label="Cursos Comprados" />
            <Tab icon={<MenuBook />} label="Conteúdos" />
            <Tab icon={<CardMembership />} label="Certificados" />
          </Tabs>
        </Paper>

        {/* Conteúdo das abas */}
        <Box>
          {/* Tab 1: Dados Cadastrais */}
          {tabValue === 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Dados Pessoais */}
              <Paper sx={{ p: 3, flex: '1 1 300px' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Dados Pessoais
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Nome Completo
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {studentData.nome}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        E-mail
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {studentData.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Telefone
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {studentData.telefone}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Endereço
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {studentData.endereco}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

           
            </Box>
          )}

          {/* Tab 2: Cursos Comprados */}
          {tabValue === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {purchasedCourses.map((course) => (
                <Paper key={course.id} sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: '1 1 300px' }}>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56, fontSize: 24 }}>
                        {course.icone}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {course.nome}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            Comprado em: {course.dataCompra}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Valor: {course.valor}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Último acesso: {course.ultimoAcesso}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {/* Tab 3: Conteúdos Complementares */}
          {tabValue === 2 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {complementaryContent.map((content) => (
                <Card key={content.id} sx={{ 
                  width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 12px)' },
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ 
                      height: 120, 
                      bgcolor: content.cor + '20', 
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      border: `2px solid ${content.cor}40`
                    }}>
                      <MenuBook sx={{ fontSize: 48, color: content.cor }} />
                    </Box>
                    
                    <Typography variant="h6" gutterBottom sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {content.titulo}
                    </Typography>
                    
                    <Chip 
                      label={content.tipo}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        mb: 2,
                        borderColor: content.cor,
                        color: content.cor
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        fullWidth
                        sx={{ flex: 1 }}
                      >
                        Visualizar
                      </Button>
                      {content.download && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Download />}
                          fullWidth
                          sx={{ flex: 1 }}
                        >
                          Baixar
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Tab 4: Certificados */}
          {tabValue === 3 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {certificates.map((cert) => (
                <Paper key={cert.id} sx={{ 
                  p: 3, 
                  flex: '1 1 300px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2
                  }}>
                    <Box>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {cert.curso}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Código: {cert.codigo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Emitido em: {cert.dataEmissao}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Carga horária: {cert.horas} horas
                      </Typography>
                    </Box>
                    
                    <Chip 
                      label={cert.status}
                      color="success"
                      size="small"
                      icon={<CheckCircle />}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    justifyContent: 'flex-end',
                    mt: 'auto'
                  }}>
                    <Tooltip title="Visualizar Certificado">
                      <IconButton color="primary">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Baixar PDF">
                      <IconButton color="primary">
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Compartilhar">
                      <IconButton color="primary">
                        <CardMembership />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
              
              <Paper sx={{ 
                p: 3, 
                bgcolor: 'info.light', 
                textAlign: 'center',
                width: '100%'
              }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Total de certificados:</strong> {certificates.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Você pode compartilhar seus certificados nas redes sociais ou incluí-los em seu currículo
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default AlunoDashboard;