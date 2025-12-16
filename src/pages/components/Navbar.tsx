import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  DirectionsBike as BikeIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  userType: 'admin' | 'aluno';
  userName?: string;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userType, userName, userEmail }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
    handleMenuClose();
  };

  const navItems = userType === 'admin' 
    ? [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
        { label: 'Cursos', path: '/admin/cursos', icon: <BikeIcon /> },
        { label: 'Alunos', path: '/admin/alunos', icon: <PersonIcon /> },
      ]
    : [
        { label: 'Dashboard', path: '/aluno/dashboard', icon: <DashboardIcon /> },
        { label: 'Meus Cursos', path: '/aluno/cursos', icon: <BikeIcon /> },
        { label: 'Carrinho', path: '/carrinho', icon: <ShoppingCartIcon /> },
      ];

  // Cores do tema
  const primaryColor = '#333333'; // Preto/Cinza escuro
  const secondaryColor = '#FF6B35'; // Laranja
  const accentColor = '#666666'; // Cinza médio

  return (
    <AppBar 
      position="fixed" 
      elevation={2}
      sx={{ 
        backgroundColor: primaryColor,
        backgroundImage: 'linear-gradient(135deg, #333333 0%, #444444 100%)',
        borderBottom: `3px solid ${secondaryColor}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Toolbar>
        {/* Logo e Nome */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ 
              mr: 2,
              color: secondaryColor,
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
              }
            }}
          >
            <BikeIcon sx={{ fontSize: 32 }} />
          </IconButton>
          
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800, 
              display: { xs: 'none', sm: 'block' },
              letterSpacing: '0.5px',
              background: 'linear-gradient(90deg, #FFFFFF 0%, #FF9B73 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CLUBE DO MECÂNICO
          </Typography>
          
          <Box
            sx={{
              ml: 2,
              px: 1.5,
              py: 0.5,
              backgroundColor: secondaryColor,
              borderRadius: '20px',
              display: { xs: 'none', md: 'block' }
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white' }}>
              {userType === 'admin' ? 'ADMIN' : 'ALUNO'}
            </Typography>
          </Box>
        </Box>

        {/* Navegação para desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1, mx: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 0.5,
                  px: 2,
                  borderRadius: '20px',
                  backgroundColor: isActive(item.path) 
                    ? 'rgba(255, 107, 53, 0.2)' 
                    : 'transparent',
                  color: isActive(item.path) ? secondaryColor : 'white',
                  border: isActive(item.path) 
                    ? `2px solid ${secondaryColor}`
                    : '2px solid transparent',
                  fontWeight: isActive(item.path) ? 700 : 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.15)',
                    border: `2px solid ${secondaryColor}`,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Perfil e Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isMobile && (
            <>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '4px 12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: secondaryColor,
                    color: 'white',
                    mr: 1.5,
                    border: '2px solid white',
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                    {userName || (userType === 'admin' ? 'Administrador' : 'Aluno')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {userEmail || `${userType}@clube.com`}
                  </Typography>
                </Box>
              </Box>
              
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255, 107, 53, 0.2)',
                  '&:hover': {
                    backgroundColor: secondaryColor,
                  }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </>
          )}
          
          {/* Botão de menu para mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  backgroundColor: secondaryColor,
                }
              }}
            >
              <PersonIcon />
            </IconButton>
          )}
        </Box>

        {/* Menu dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 280,
              backgroundColor: primaryColor,
              color: 'white',
              border: `1px solid ${accentColor}`,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          {/* Informações do usuário */}
          <MenuItem 
            disabled
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              opacity: 1,
              '&.Mui-disabled': {
                opacity: 1,
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Avatar sx={{ 
                width: 48, 
                height: 48,
                bgcolor: secondaryColor,
                border: '2px solid white',
              }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {userName || (userType === 'admin' ? 'Administrador' : 'Aluno')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {userEmail || `${userType}@clube.com`}
                </Typography>
                <Box sx={{ 
                  mt: 0.5,
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.25,
                  backgroundColor: secondaryColor,
                  borderRadius: '12px',
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {userType === 'admin' ? 'Administrador' : 'Aluno'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </MenuItem>

          <Divider sx={{ borderColor: accentColor }} />

          {/* Navegação para mobile */}
          {isMobile && navItems.map((item) => (
            <MenuItem 
              key={item.label}
              onClick={() => {
                navigate(item.path);
                handleMenuClose();
              }}
              sx={{
                py: 1.5,
                backgroundColor: isActive(item.path) 
                  ? 'rgba(255, 107, 53, 0.15)' 
                  : 'transparent',
                color: isActive(item.path) ? secondaryColor : 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box sx={{ color: isActive(item.path) ? secondaryColor : accentColor }}>
                  {item.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: isActive(item.path) ? 700 : 500 }}>
                  {item.label}
                </Typography>
              </Box>
            </MenuItem>
          ))}

          {isMobile && <Divider sx={{ borderColor: accentColor }} />}

          {/* Links comuns */}
          <MenuItem onClick={() => {
            navigate(userType === 'admin' ? '/admin/perfil' : '/aluno/perfil');
            handleMenuClose();
          }}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon sx={{ color: accentColor }} />
              <Typography variant="body2">Meu Perfil</Typography>
            </Box>
          </MenuItem>

          <MenuItem onClick={() => {
            navigate('/');
            handleMenuClose();
          }}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <HomeIcon sx={{ color: accentColor }} />
              <Typography variant="body2">Site Principal</Typography>
            </Box>
          </MenuItem>

          <Divider sx={{ borderColor: accentColor }} />

          {/* Logout */}
          <MenuItem 
            onClick={handleLogout} 
            sx={{ 
              py: 1.5,
              color: secondaryColor,
              fontWeight: 700,
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 53, 0.15)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ExitToAppIcon />
              <Typography variant="body2">Sair</Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;