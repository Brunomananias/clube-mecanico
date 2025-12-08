import React, { useState } from 'react';
import BuildIcon from "@mui/icons-material/Build";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Rating,
  Box,
  AppBar,
  Container,
  Toolbar,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import {
  Search,
  ShoppingCart,
  AccessTime,
  Group,
  Sort,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  descricaoLonga: string;
  valor: number;
  valorOriginal?: number;
  duracao: string;
  horas: number;
  nivel: string;
  maxAlunos: number;
  vagasDisponiveis: number;
  categoria: string;
  avaliacao: number;
  totalAvaliacoes: number;
  imagem: string;
  destaques: string[];
  cor: string;
}

const CursosPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [nivel, setNivel] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('relevancia');
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const cursos: Curso[] = [
    {
      id: 1,
      titulo: "Mecânica de Bicicletas Básico",
      descricao: "Aprenda os fundamentos da mecânica de bicicletas, desde manutenção preventiva até reparos essenciais.",
      descricaoLonga: "Curso completo para iniciantes que desejam aprender a montar, ajustar e fazer manutenção em bicicletas. Inclui identificação de peças, ferramentas básicas e segurança no trabalho.",
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
      imagem: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80",
      destaques: ["Kit de ferramentas", "Certificado digital", "Acesso vitalício"],
      cor: "#1976d2"
    },
    {
      id: 2,
      titulo: "Manutenção de Freios Hidráulicos",
      descricao: "Especialização em sistemas de freio hidráulico para mountain bikes e bicicletas urbanas.",
      descricaoLonga: "Aprenda a diagnosticar, reparar e ajustar freios hidráulicos das principais marcas. Inclui sangria, troca de pastilhas e manutenção de calipers.",
      valor: 197.00,
      duracao: "4 semanas",
      horas: 30,
      nivel: "Intermediário",
      maxAlunos: 15,
      vagasDisponiveis: 8,
      categoria: "Freios",
      avaliacao: 4.9,
      totalAvaliacoes: 89,
      imagem: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=600&q=80",
      destaques: ["Certificado especializado", "Material didático", "Suporte técnico"],
      cor: "#2e7d32"
    },
    {
      id: 3,
      titulo: "Suspensão e Geometria Avançada",
      descricao: "Domine os sistemas de suspensão dianteira e traseira, ajustes e manutenção especializada.",
      descricaoLonga: "Curso avançado para mecânicos que desejam especializar-se em suspensão. Inclui configuração de amortecimento, service de garfos e amortecedores.",
      valor: 397.00,
      duracao: "8 semanas",
      horas: 60,
      nivel: "Avançado",
      maxAlunos: 12,
      vagasDisponiveis: 5,
      categoria: "Suspensão",
      avaliacao: 4.7,
      totalAvaliacoes: 67,
      imagem: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80",
      destaques: ["Certificado avançado", "Ferramentas especializadas", "Workshop prático"],
      cor: "#ed6c02"
    },
    {
      id: 4,
      titulo: "Transmissão e Câmbios",
      descricao: "Especialização em sistemas de transmissão, câmbios dianteiros e traseiros de todas as marcas.",
      descricaoLonga: "Aprenda a ajustar, regular e reparar sistemas de transmissão completos. Inclui Shimano, SRAM e Campagnolo.",
      valor: 247.00,
      valorOriginal: 297.00,
      duracao: "5 semanas",
      horas: 35,
      nivel: "Intermediário",
      maxAlunos: 18,
      vagasDisponiveis: 10,
      categoria: "Transmissão",
      avaliacao: 4.6,
      totalAvaliacoes: 92,
      imagem: "https://images.unsplash.com/photo-1570870625148-2d2d9c9b49d3?auto=format&fit=crop&w=600&q=80",
      destaques: ["Guia de especificações", "Ferramentas de ajuste", "Acesso ao fórum"],
      cor: "#9c27b0"
    },
    {
      id: 5,
      titulo: "Mecânica de Bicicletas Elétricas",
      descricao: "Curso especializado em bicicletas elétricas, motores, baterias e sistemas eletrônicos.",
      descricaoLonga: "Aprenda a diagnosticar e reparar bicicletas elétricas. Inclui segurança com alta tensão, manutenção de baterias e sistemas de assistência.",
      valor: 497.00,
      duracao: "10 semanas",
      horas: 80,
      nivel: "Avançado",
      maxAlunos: 10,
      vagasDisponiveis: 4,
      categoria: "Elétrica",
      avaliacao: 4.9,
      totalAvaliacoes: 45,
      imagem: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=600&q=80",
      destaques: ["Certificação especial", "Kit de segurança", "Suporte vitalício"],
      cor: "#d32f2f"
    },
    {
      id: 6,
      titulo: "Gestão de Oficina de Bicicletas",
      descricao: "Aprenda a administrar uma oficina de sucesso, desde atendimento até gestão financeira.",
      descricaoLonga: "Curso completo para quem deseja empreender no setor de bicicletas. Inclui gestão de estoque, precificação, marketing e atendimento.",
      valor: 347.00,
      duracao: "6 semanas",
      horas: 45,
      nivel: "Todos os níveis",
      maxAlunos: 25,
      vagasDisponiveis: 15,
      categoria: "Gestão",
      avaliacao: 4.8,
      totalAvaliacoes: 78,
      imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
      destaques: ["Plano de negócios", "Modelos de contrato", "Consultoria"],
      cor: "#0288d1"
    },
  ];

  const handleVerCurso = (cursoId: number) => {
    navigate(`/curso/${cursoId}`);
  };

  const handleAddToCart = (curso: Curso) => {
    // Aqui você implementaria a lógica do carrinho
    navigate('/carrinho', { state: { curso } });
  };

  const cursosFiltrados = cursos.filter(curso => {
    const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curso.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = categoria === 'todos' || curso.categoria === categoria;
    const matchesNivel = nivel === 'todos' || curso.nivel === nivel;
    return matchesSearch && matchesCategoria && matchesNivel;
  });

  return (
    <>
       <AppBar position="fixed" color="primary" elevation={3}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <div className="nav-logo">
              <BuildIcon sx={{ mr: 2, fontSize: 32 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                className="logo-text"
              >
                CLUBE DO MECÂNICO
              </Typography>
            </div>

            {!isMobile ? (
              <div className="nav-links">
                <Button color="inherit" href="#inicio" className="nav-link">
                  Início
                </Button>
                <Button color="inherit" href="#sobre" className="nav-link">
                  Sobre
                </Button>
                <Button color="inherit" href="#cursos" className="nav-link">
                  Cursos
                </Button>
                <Button color="inherit" href="#contato" className="nav-link">
                  Contato
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  href="#inscricao"
                  className="nav-button"
                >
                  Matricule-se
                </Button>
                <Button
                color="inherit"
                href="/login"
                className="nav-link"
                >
                Login
                </Button>
              </div>
            ) : (
              <IconButton color="inherit">
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
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
            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
              Nossos Cursos
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Escolha o curso perfeito para sua carreira
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ShoppingCart />}
              onClick={() => navigate('/carrinho')}
            >
              Ver Carrinho
            </Button>
          </Box>
        </Box>

        {/* Filtros e Busca */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            alignItems: 'center'
          }}>
            <TextField
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: '1 1 300px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl sx={{ flex: '1 1 200px' }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={categoria}
                label="Categoria"
                onChange={(e) => setCategoria(e.target.value)}
              >
                <MenuItem value="todos">Todas categorias</MenuItem>
                <MenuItem value="Mecânica Básica">Mecânica Básica</MenuItem>
                <MenuItem value="Freios">Freios</MenuItem>
                <MenuItem value="Suspensão">Suspensão</MenuItem>
                <MenuItem value="Transmissão">Transmissão</MenuItem>
                <MenuItem value="Elétrica">Elétrica</MenuItem>
                <MenuItem value="Gestão">Gestão</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ flex: '1 1 200px' }}>
              <InputLabel>Nível</InputLabel>
              <Select
                value={nivel}
                label="Nível"
                onChange={(e) => setNivel(e.target.value)}
              >
                <MenuItem value="todos">Todos os níveis</MenuItem>
                <MenuItem value="Iniciante">Iniciante</MenuItem>
                <MenuItem value="Intermediário">Intermediário</MenuItem>
                <MenuItem value="Avançado">Avançado</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ flex: '1 1 200px' }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={ordenacao}
                label="Ordenar por"
                onChange={(e) => setOrdenacao(e.target.value)}
                startAdornment={<Sort sx={{ mr: 1 }} />}
              >
                <MenuItem value="relevancia">Mais relevantes</MenuItem>
                <MenuItem value="preco-crescente">Menor preço</MenuItem>
                <MenuItem value="preco-decrescente">Maior preço</MenuItem>
                <MenuItem value="avaliacao">Melhor avaliação</MenuItem>
                <MenuItem value="duracao">Menor duração</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Resultados */}
        <Typography variant="h6" sx={{ mb: 3 }}>
          {cursosFiltrados.length} cursos encontrados
        </Typography>

        {/* Lista de Cursos */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {cursosFiltrados.map((curso) => (
            <Box 
              key={curso.id} 
              sx={{ 
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: 'calc(33.333% - 16px)' },
                minWidth: { xs: '100%', sm: '300px' }
              }}
            >
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}>
                {/* Badge de promoção */}
                {curso.valorOriginal && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    zIndex: 1 
                  }}>
                    <Chip 
                      label={`${Math.round((1 - curso.valor/curso.valorOriginal) * 100)}% OFF`}
                      color="error"
                      size="small"
                    />
                  </Box>
                )}
                
                {/* Imagem do curso */}
                <CardMedia
                  component="img"
                  height="200"
                  image={curso.imagem}
                  alt={curso.titulo}
                  sx={{ 
                    objectFit: 'cover',
                    borderBottom: `4px solid ${curso.cor}`
                  }}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Categoria e nível */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip 
                      label={curso.categoria}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={curso.nivel}
                      size="small"
                      sx={{ 
                        bgcolor: curso.nivel === 'Iniciante' ? '#e3f2fd' : 
                                curso.nivel === 'Intermediário' ? '#f3e5f5' : '#ffebee',
                        color: curso.nivel === 'Iniciante' ? '#1976d2' : 
                               curso.nivel === 'Intermediário' ? '#7b1fa2' : '#d32f2f'
                      }}
                    />
                  </Box>
                  
                  {/* Título e descrição */}
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {curso.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {curso.descricao}
                  </Typography>
                  
                  {/* Avaliação */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={curso.avaliacao} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {curso.avaliacao} ({curso.totalAvaliacoes} avaliações)
                    </Typography>
                  </Box>
                  
                  {/* Destaques */}
                  <Box sx={{ mb: 3 }}>
                    {curso.destaques.slice(0, 2).map((destaque, idx) => (
                      <Box 
                        key={idx} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          mb: 0.5
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {destaque}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Detalhes */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2">{curso.horas}h</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Group fontSize="small" color="action" />
                        <Typography variant="body2">{curso.maxAlunos} alunos</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      {curso.valorOriginal && (
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          R$ {curso.valorOriginal.toFixed(2)}
                        </Typography>
                      )}
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        R$ {curso.valor.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        à vista
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                {/* Ações */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  p: 2, 
                  pt: 0,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleAddToCart(curso)}
                    startIcon={<ShoppingCart />}
                    sx={{ 
                      bgcolor: curso.cor,
                      '&:hover': { bgcolor: curso.cor, opacity: 0.9 }
                    }}
                  >
                    Adicionar
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleVerCurso(curso.id)}
                    endIcon={<KeyboardArrowRight />}
                  >
                    Detalhes
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Mensagem se não houver cursos */}
        {cursosFiltrados.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum curso encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tente alterar os filtros ou buscar por outro termo
            </Typography>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default CursosPage;