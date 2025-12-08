import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Tab,
  Tabs,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart,
  AccessTime,
  School,
  CheckCircle,
  KeyboardArrowRight,
  Share,
  Favorite,
  FavoriteBorder,
  PlayCircle,
  Description,
  CardMembership,
  SupportAgent,
  Schedule,
  People,
  Book,
  Build,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

interface ConteudoProgramatico {
  modulo: string;
  topicos: string[];
  horas: number;
}

const CursoDetalhePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [favorito, setFavorito] = useState(false);

  // Dados do curso (em um app real, viria de uma API)
  const curso = {
    id: 1,
    titulo: "Mecânica de Bicicletas Básico",
    subtitulo: "Curso completo para iniciantes na mecânica de bicicletas",
    descricao: "Aprenda os fundamentos da mecânica de bicicletas, desde manutenção preventiva até reparos essenciais. Curso ideal para quem deseja começar na área ou para ciclistas que querem realizar suas próprias manutenções.",
    descricaoLonga: "Este curso é a porta de entrada para o mundo da mecânica de bicicletas. Você aprenderá desde os conceitos mais básicos até técnicas essenciais para manter qualquer bicicleta em perfeito estado. Com foco na prática, o curso garante que você saia pronto para trabalhar em bicicletas urbanas, mountain bikes e road bikes.",
    valor: 297.00,
    valorOriginal: 397.00,
    duracao: "6 semanas",
    horas: 40,
    nivel: "Iniciante",
    maxAlunos: 20,
    vagasDisponiveis: 12,
    categoria: "Mecânica Básica",
    avaliacao: 4.8,
    totalAvaliacoes: 124,
    imagem: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80",
    destaques: [
      "Kit de ferramentas profissional incluso",
      "Certificado digital reconhecido",
      "Acesso vitalício ao conteúdo",
      "Suporte técnico por 1 ano",
      "Material didático completo",
      "Aulas práticas com bicicletas reais"
    ],
    cor: "#1976d2",
    requisitos: [
      "Idade mínima: 16 anos",
      "Ensino fundamental completo",
      "Interesse por mecânica",
      "Disponibilidade para aulas práticas"
    ],
    paraQuem: [
      "Iniciantes em mecânica",
      "Ciclistas que querem fazer suas próprias manutenções",
      "Profissionais que desejam se especializar",
      "Empreendedores do setor"
    ]
  };

  const conteudoProgramatico: ConteudoProgramatico[] = [
    {
      modulo: "Módulo 1: Introdução à Mecânica de Bicicletas",
      topicos: [
        "História e evolução das bicicletas",
        "Tipos de bicicletas e suas características",
        "Identificação de componentes principais",
        "Ferramentas básicas e seu uso correto",
        "Normas de segurança no trabalho"
      ],
      horas: 8
    },
    {
      modulo: "Módulo 2: Sistema de Transmissão",
      topicos: [
        "Câmbios dianteiros e traseiros",
        "Corrente: manutenção e substituição",
        "Cassetes e coroas",
        "Ajuste de indexação",
        "Troca de cabos e housing"
      ],
      horas: 10
    },
    {
      modulo: "Módulo 3: Freios",
      topicos: [
        "Sistemas de freio: v-brake, cantilever e hidráulico",
        "Ajuste e manutenção de freios",
        "Troca de pastilhas e lonas",
        "Sangria de freios hidráulicos",
        "Alinhamento de calipers"
      ],
      horas: 8
    },
    {
      modulo: "Módulo 4: Rodas e Pneus",
      topicos: [
        "Montagem e desmontagem de rodas",
        "Centragem de rodas (raioamento)",
        "Troca de pneus e câmaras",
        "Reparo de furos",
        "Pressão correta para cada tipo de uso"
      ],
      horas: 6
    },
    {
      modulo: "Módulo 5: Suspensão Básica",
      topicos: [
        "Tipos de suspensão",
        "Manutenção básica de garfos",
        "Ajuste de pressão e retorno",
        "Lubrificação",
        "Troca de selos"
      ],
      horas: 8
    }
  ];

  const handleAddToCart = () => {
    navigate('/carrinho', { state: { curso } });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Navbar userType="aluno" />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        {/* Cabeçalho do curso */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Button 
              variant="text" 
              onClick={() => navigate('/cursos')}
              startIcon={<KeyboardArrowRight sx={{ transform: 'rotate(180deg)' }} />}
            >
              Voltar para cursos
            </Button>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 4,
            alignItems: 'flex-start'
          }}>
            {/* Imagem e informações principais */}
            <Box sx={{ flex: '1 1 300px' }}>
              <Paper sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                mb: 3
              }}>
                <Box
                  component="img"
                  src={curso.imagem}
                  alt={curso.titulo}
                  sx={{ 
                    width: '100%', 
                    height: { xs: 300, md: 400 },
                    objectFit: 'cover'
                  }}
                />
              </Paper>
              
              {/* Ações rápidas */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <IconButton 
                  color={favorito ? "error" : "default"}
                  onClick={() => setFavorito(!favorito)}
                >
                  {favorito ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton color="primary">
                  <Share />
                </IconButton>
                <Button
                  variant="outlined"
                  startIcon={<PlayCircle />}
                  fullWidth
                >
                  Ver vídeo de apresentação
                </Button>
              </Box>
            </Box>
            
            {/* Informações do curso */}
            <Box sx={{ flex: '1 1 300px' }}>
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label={curso.categoria}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {curso.titulo}
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  {curso.subtitulo}
                </Typography>
                
                {/* Avaliação */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={curso.avaliacao} precision={0.1} readOnly />
                    <Typography variant="h6" fontWeight="bold">
                      {curso.avaliacao}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    ({curso.totalAvaliacoes} avaliações)
                  </Typography>
                </Box>
              </Box>
              
              {/* Descrição */}
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {curso.descricao}
              </Typography>
              
              {/* Destaques */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light' }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  O QUE VOCÊ VAI APRENDER:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {curso.destaques.slice(0, 3).map((destaque, idx) => (
                    <Chip
                      key={idx}
                      label={destaque}
                      size="small"
                      icon={<CheckCircle fontSize="small" />}
                      sx={{ bgcolor: 'white' }}
                    />
                  ))}
                </Box>
              </Paper>
              
              {/* Detalhes técnicos */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3,
                mb: 4
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flex: '1 1 120px'
                }}>
                  <AccessTime color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Duração
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {curso.duracao}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flex: '1 1 120px'
                }}>
                  <Schedule color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Carga horária
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {curso.horas} horas
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flex: '1 1 120px'
                }}>
                  <School color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Nível
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {curso.nivel}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flex: '1 1 120px'
                }}>
                  <People color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Vagas
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {curso.vagasDisponiveis}/{curso.maxAlunos}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {/* Card de compra */}
              <Card sx={{ position: 'sticky', top: 20 }}>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    {curso.valorOriginal && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          De R$ {curso.valorOriginal.toFixed(2)}
                        </Typography>
                        <Chip 
                          label={`${Math.round((1 - curso.valor/curso.valorOriginal) * 100)}% OFF`}
                          color="error"
                          size="small"
                        />
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                      <Typography variant="h3" color="primary" fontWeight="bold">
                        R$ {curso.valor.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        à vista
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      ou 12x de R$ {(curso.valor / 12).toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    sx={{ mb: 2, py: 1.5 }}
                  >
                    Adicionar ao Carrinho
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Matricular Agora
                  </Button>
                  
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      30 dias de garantia ou seu dinheiro de volta
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
        
        {/* Tabs de conteúdo */}
        <Paper sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<Description />} label="Descrição" />
          </Tabs>
          
          {/* Conteúdo das tabs */}
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Sobre este curso
                </Typography>
                <Typography variant="body1" paragraph>
                  {curso.descricaoLonga}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Typography variant="h6" gutterBottom>
                      Para quem é este curso:
                    </Typography>
                    <List dense>
                      {curso.paraQuem.map((item, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Typography variant="h6" gutterBottom>
                      Requisitos:
                    </Typography>
                    <List dense>
                      {curso.requisitos.map((item, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <CheckCircle color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </Box>
            )}
            
            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Conteúdo Programático
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                  Este curso está dividido em {conteudoProgramatico.length} módulos completos, 
                  totalizando {curso.horas} horas de conteúdo prático e teórico.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {conteudoProgramatico.map((modulo, idx) => (
                    <Paper key={idx} sx={{ p: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2
                      }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {modulo.modulo}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {modulo.horas} horas
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <List>
                        {modulo.topicos.map((topico, topicIdx) => (
                          <ListItem key={topicIdx}>
                            <ListItemIcon>
                              <KeyboardArrowRight />
                            </ListItemIcon>
                            <ListItemText primary={topico} />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
            
            {tabValue === 2 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Certificação
                </Typography>
                <Paper sx={{ p: 3, bgcolor: 'primary.light' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    flexWrap: 'wrap'
                  }}>
                    <CardMembership sx={{ fontSize: 60, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Certificado Digital Reconhecido
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Ao concluir o curso com aproveitamento mínimo de 70%, você receberá um certificado digital 
                        reconhecido pela ABRACICLO (Associação Brasileira do Setor de Bicicletas).
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 3,
                        mt: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle color="success" />
                          <Typography variant="body2">Código de autenticação único</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle color="success" />
                          <Typography variant="body2">Válido em todo território nacional</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle color="success" />
                          <Typography variant="body2">Pode ser compartilhado no LinkedIn</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
            
            {tabValue === 3 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Nossos Instrutores
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                  Aprenda com os melhores profissionais do mercado, com anos de experiência prática.
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {instrutores.map((instrutor, idx) => (
                    <Paper key={idx} sx={{ 
                      p: 3, 
                      flex: '1 1 300px',
                      display: 'flex',
                      gap: 3
                    }}>
                      <Avatar 
                        src={instrutor.foto}
                        sx={{ width: 80, height: 80 }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {instrutor.nome}
                        </Typography>
                        <Chip 
                          label={instrutor.especialidade}
                          color="primary"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {instrutor.experiencia}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
            
            {tabValue === 4 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Metodologia de Ensino
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                  <Paper sx={{ 
                    p: 3, 
                    flex: '1 1 300px',
                    textAlign: 'center'
                  }}>
                    <Build sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      70% Prática
                    </Typography>
                    <Typography variant="body2">
                      Aulas hands-on com bicicletas reais e ferramentas profissionais
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ 
                    p: 3, 
                    flex: '1 1 300px',
                    textAlign: 'center'
                  }}>
                    <Book sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      30% Teoria
                    </Typography>
                    <Typography variant="body2">
                      Fundamentos técnicos e conceitos essenciais para entendimento completo
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ 
                    p: 3, 
                    flex: '1 1 300px',
                    textAlign: 'center'
                  }}>
                    <SupportAgent sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Suporte Contínuo
                    </Typography>
                    <Typography variant="body2">
                      Grupo exclusivo e suporte dos instrutores por 1 ano após o curso
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CursoDetalhePage;