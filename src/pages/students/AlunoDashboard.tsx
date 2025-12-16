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
  LinearProgress,
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
  CalendarToday,
  AccessTime,
  MonetizationOn,
  Book,
  VideoLibrary,
  PictureAsPdf,
  GridView,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AlunoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getUserName = (): string => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return 'Aluno';
    
    const user = JSON.parse(userData);
    return user.nome_Completo || user.name || user.nome || 'Aluno';
  } catch (error) {
    console.error('Erro ao obter nome do usuário:', error);
    return 'Aluno';
  }
};

const userName = getUserName();
  // Dados do aluno
  const studentData = {
    nome: userName,
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
      icone: "🚲",
      categoria: "Básico",
      horas: 20
    },
    { 
      id: 2, 
      nome: "Manutenção de Freios Hidráulicos", 
      dataCompra: "05/03/2024",
      valor: "R$ 197,00",
      status: "Em andamento",
      progresso: 30,
      ultimoAcesso: "Ontem, 10:15",
      icone: "🔧",
      categoria: "Intermediário",
      horas: 15
    },
    { 
      id: 3, 
      nome: "Suspensão e Geometria Avançada", 
      dataCompra: "01/03/2024",
      valor: "R$ 397,00",
      status: "Não iniciado",
      progresso: 0,
      ultimoAcesso: "Não acessado",
      icone: "⚙️",
      categoria: "Avançado",
      horas: 30
    },
  ];

  // Conteúdos complementares
  const complementaryContent = [
    { id: 1, titulo: "E-book: Guia de Ferramentas", tipo: "PDF", download: true, cor: "#4CAF50", tamanho: "5.2 MB", icon: <PictureAsPdf /> },
    { id: 2, titulo: "Vídeo: Dicas de Manutenção", tipo: "Vídeo", download: false, cor: "#FF5722", tamanho: "128 MB", icon: <VideoLibrary /> },
    { id: 3, titulo: "Planilha de Controle", tipo: "Excel", download: true, cor: "#2196F3", tamanho: "2.1 MB", icon: <GridView /> },
    { id: 4, titulo: "Webinar Exclusivo", tipo: "Gravação", download: true, cor: "#9C27B0", tamanho: "450 MB", icon: <VideoLibrary /> },
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
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Estatísticas do aluno
  const stats = {
    totalCursos: purchasedCourses.length,
    cursosAndamento: purchasedCourses.filter(c => c.status === "Em andamento").length,
    totalHoras: purchasedCourses.reduce((sum, curso) => sum + curso.horas, 0),
    totalCertificados: certificates.length,
  };

  return (
    <>
      <Navbar userType="aluno" userName={userName} userEmail={userEmail} />
      
      <Box sx={{ mt: 10, mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Container principal */}
        <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
          
          {/* Cabeçalho */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            mb: 4,
            gap: 3
          }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                <Person sx={{ verticalAlign: 'middle', mr: 2, fontSize: 40 }} />
                Painel do Aluno
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Gerencie seus cursos, certificados e dados pessoais
              </Typography>
              
              {/* Estatísticas */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                maxWidth: 500
              }}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  flex: '1 1 120px',
                  minWidth: 120,
                  bgcolor: 'primary.light', 
                  color: 'primary.contrastText'
                }}>
                  <Typography variant="h6">{stats.totalCursos}</Typography>
                  <Typography variant="caption">Cursos</Typography>
                </Paper>
                
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  flex: '1 1 120px',
                  minWidth: 120,
                  bgcolor: 'success.light', 
                  color: 'success.contrastText'
                }}>
                  <Typography variant="h6">{stats.cursosAndamento}</Typography>
                  <Typography variant="caption">Em andamento</Typography>
                </Paper>
                
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  flex: '1 1 120px',
                  minWidth: 120,
                  bgcolor: 'info.light', 
                  color: 'info.contrastText'
                }}>
                  <Typography variant="h6">{stats.totalHoras}h</Typography>
                  <Typography variant="caption">Horas totais</Typography>
                </Paper>
                
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  flex: '1 1 120px',
                  minWidth: 120,
                  bgcolor: 'warning.light', 
                  color: 'warning.contrastText'
                }}>
                  <Typography variant="h6">{stats.totalCertificados}</Typography>
                  <Typography variant="caption">Certificados</Typography>
                </Paper>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate('/aluno/perfil')}
                sx={{ minWidth: 150 }}
              >
                Editar Perfil
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Person />}
                onClick={handleLogout}
                sx={{ minWidth: 150 }}
              >
                Sair
              </Button>
            </Box>
          </Box>

          {/* Abas principais */}
          <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': { 
                  minHeight: 64,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }
              }}
            >
              <Tab icon={<Person sx={{ fontSize: { xs: 20, sm: 24 } }} />} label="Dados Cadastrais" />
              <Tab icon={<School sx={{ fontSize: { xs: 20, sm: 24 } }} />} label="Meus Cursos" />
              <Tab icon={<MenuBook sx={{ fontSize: { xs: 20, sm: 24 } }} />} label="Conteúdos" />
              <Tab icon={<CardMembership sx={{ fontSize: { xs: 20, sm: 24 } }} />} label="Certificados" />
            </Tabs>
          </Paper>

          {/* Conteúdo das abas */}
          <Box>
            {/* Tab 1: Dados Cadastrais */}
            {tabValue === 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Paper sx={{ 
                  p: 3, 
                  flex: '1 1 300px',
                  minWidth: 300,
                  maxWidth: 'calc(50% - 12px)'
                }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Dados Pessoais
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Nome Completo
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {studentData.nome}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        E-mail
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {studentData.email}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Telefone
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {studentData.telefone}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Endereço
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {studentData.endereco}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Paper sx={{ 
                  p: 3, 
                  flex: '1 1 300px',
                  minWidth: 300,
                  maxWidth: 'calc(50% - 12px)'
                }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Informações da Conta
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Data de Cadastro
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {studentData.dataCadastro}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Nível
                      </Typography>
                      <Chip 
                        label={studentData.nivel}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status da Conta
                      </Typography>
                      <Chip 
                        label={studentData.status}
                        color="success"
                        size="small"
                        icon={<CheckCircle />}
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Plano Atual
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" color="primary">
                        Plano Premium
                      </Typography>
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
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 3
                    }}>
                      <Box sx={{ flexShrink: 0 }}>
                        <Avatar sx={{ 
                          bgcolor: 'primary.main', 
                          width: 80, 
                          height: 80, 
                          fontSize: 32,
                          boxShadow: 2
                        }}>
                          {course.icone}
                        </Avatar>
                      </Box>
                      
                      <Box sx={{ flex: '1 1 300px' }}>
                        <Typography variant="h6" gutterBottom>
                          {course.nome}
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 2, 
                          mb: 2,
                          alignItems: 'center'
                        }}>
                          <Chip 
                            label={course.categoria}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {course.horas}h
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MonetizationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {course.valor}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary">
                            Último acesso: {course.ultimoAcesso}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            mb: 0.5
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              Progresso: {course.progresso}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {course.status}
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={course.progresso} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: 'action.hover'
                            }}
                            color={course.progresso > 50 ? "success" : course.progresso > 0 ? "warning" : "inherit"}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1,
                        minWidth: 200
                      }}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/curso/${course.id}`)}
                          sx={{ flex: 1 }}
                        >
                          Acessar Curso
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<School />}
                          sx={{ flex: 1 }}
                        >
                          Detalhes
                        </Button>
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
                    minWidth: 250,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
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
                        <Box sx={{ 
                          color: content.cor,
                          fontSize: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {content.icon}
                        </Box>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: 64
                      }}>
                        {content.titulo}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Chip 
                          label={content.tipo}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: content.cor,
                            color: content.cor
                          }}
                        />
                        
                        <Typography variant="caption" color="text.secondary">
                          {content.tamanho}
                        </Typography>
                      </Box>
                      
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
                            sx={{ 
                              flex: 1,
                              backgroundColor: content.cor,
                              '&:hover': {
                                backgroundColor: content.cor,
                                opacity: 0.9
                              }
                            }}
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
              <Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                  {certificates.map((cert) => (
                    <Paper key={cert.id} sx={{ 
                      p: 3, 
                      flex: '1 1 300px',
                      minWidth: 300,
                      display: 'flex',
                      flexDirection: 'column',
                      borderLeft: '4px solid',
                      borderLeftColor: 'success.main'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2
                      }}>
                        <Box>
                          <Typography variant="h6" color="primary" gutterBottom>
                            <CardMembership sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {cert.curso}
                          </Typography>
                          
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Código:</strong> {cert.codigo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Emitido em:</strong> {cert.dataEmissao}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Carga horária:</strong> {cert.horas} horas
                            </Typography>
                          </Stack>
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
                </Box>
                
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'info.light', 
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'info.main'
                }}>
                  <Typography variant="body1" gutterBottom sx={{ color: 'info.contrastText' }}>
                    <strong>Total de certificados:</strong> {certificates.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'info.contrastText', opacity: 0.9 }}>
                    Você pode compartilhar seus certificados nas redes sociais ou incluí-los em seu currículo
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AlunoDashboard;