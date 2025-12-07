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
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  userType: 'admin' | 'aluno';
  userName?: string;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userType, userName, userEmail }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    navigate('/login');
    handleMenuClose();
  };

  const navItems = userType === 'admin' 
    ? [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
        { label: 'Alunos', path: '/admin/alunos', icon: <SchoolIcon /> },
        { label: 'Cursos', path: '/admin/cursos', icon: <BuildIcon /> },
        { label: 'Relatórios', path: '/admin/relatorios', icon: <DashboardIcon /> },
      ]
    : [
        { label: 'Dashboard', path: '/aluno/dashboard', icon: <DashboardIcon /> },
        { label: 'Meus Cursos', path: '/aluno/cursos', icon: <SchoolIcon /> },
        { label: 'Certificados', path: '/aluno/certificados', icon: <BuildIcon /> },
        { label: 'Mensagens', path: '/aluno/mensagens', icon: <NotificationsIcon /> },
      ];

  return (
    <AppBar 
      position="fixed" 
      elevation={1}
      sx={{ 
        backgroundColor: userType === 'admin' ? 'secondary.main' : 'primary.main',
        backgroundImage: userType === 'admin' 
          ? 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)'
          : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      }}
    >
      <Toolbar>
        {/* Logo e Nome */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/aluno/dashboard')}
            sx={{ mr: 2 }}
          >
            <BuildIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
            Clube do Mecânico
          </Typography>
          <Typography variant="subtitle2" sx={{ ml: 2, display: { xs: 'none', md: 'block' } }}>
            {userType === 'admin' ? 'Admin' : 'Aluno'}
          </Typography>
        </Box>

        {/* Navegação para desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Ícones de ação */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          {/* Notificações */}
          <IconButton color="inherit" onClick={handleNotificationsOpen}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Menu hamburguer para mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Perfil do usuário para desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'white',
                  color: userType === 'admin' ? 'secondary.main' : 'primary.main',
                  mr: 1,
                }}
              >
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {userName || (userType === 'admin' ? 'Administrador' : 'Aluno')}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {userEmail || `${userType}@clube.com`}
                </Typography>
              </Box>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Menu dropdown para mobile */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
            },
          }}
        >
          {/* Navegação para mobile */}
          {isMobile && navItems.map((item) => (
            <MenuItem 
              key={item.label}
              onClick={() => {
                navigate(item.path);
                handleMenuClose();
              }}
              selected={isActive(item.path)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.icon}
                {item.label}
              </Box>
            </MenuItem>
          ))}

          {isMobile && <Divider />}

          {/* Informações do usuário */}
          <MenuItem disabled>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="body2">
                  {userName || (userType === 'admin' ? 'Administrador' : 'Aluno')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userEmail || `${userType}@clube.com`}
                </Typography>
              </Box>
            </Box>
          </MenuItem>

          <Divider />

          {/* Links comuns */}
          <MenuItem onClick={() => {
            navigate(userType === 'admin' ? '/admin/perfil' : '/aluno/perfil');
            handleMenuClose();
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon fontSize="small" />
              Meu Perfil
            </Box>
          </MenuItem>

          <MenuItem onClick={() => {
            navigate('/');
            handleMenuClose();
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeIcon fontSize="small" />
              Site Principal
            </Box>
          </MenuItem>

          <Divider />

          {/* Logout */}
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ExitToAppIcon fontSize="small" />
              Sair
            </Box>
          </MenuItem>
        </Menu>

        {/* Menu de notificações */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 300,
            },
          }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2" fontWeight="bold">
              Notificações (3)
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationsClose}>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Nova aula disponível
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mecânica Avançada - Aula 5
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationsClose}>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Certificado disponível
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Curso Básico concluído
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationsClose}>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Mensagem do professor
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Verifique suas tarefas
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationsClose} sx={{ justifyContent: 'center' }}>
            <Typography variant="caption" color="primary">
              Ver todas as notificações
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;