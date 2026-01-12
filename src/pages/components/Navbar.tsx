import React, { useState } from "react";
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
} from "@mui/material";
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  DirectionsBike as BikeIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

interface NavbarProps {
  userType?: "admin" | "aluno" | null;
  userName?: string;
  userEmail?: string;
}

// Interface para itens de navegação
interface NavItem {
  label: string;
  icon: React.ReactNode;
}

interface PageNavItem extends NavItem {
  type: "page";
  path: string;
}

interface SectionNavItem extends NavItem {
  type: "section";
  id: string;
}

type NavbarItem = PageNavItem | SectionNavItem;

const Navbar: React.FC<NavbarProps> = ({ userType, userEmail }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
    handleMenuClose();
  };

  // Função para rolar para seções específicas
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      // Se não estiver na página inicial, navega para lá primeiro
      navigate("/");
      // Aguarda a navegação e então rola para a seção
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Já está na página inicial, apenas rola
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navItems: NavbarItem[] =
    userType === "admin"
      ? [
          {
            label: "Dashboard",
            type: "page",
            path: "/admin/dashboard",
            icon: <DashboardIcon />,
          },
          {
            label: "Cursos",
            type: "page",
            path: "/admin/cursos",
            icon: <BikeIcon />,
          },
          {
            label: "Alunos",
            type: "page",
            path: "/admin/alunos",
            icon: <PersonIcon />,
          },
        ]
      : userType === "aluno"
      ? [
          {
            label: "Dashboard",
            type: "page",
            path: "/aluno/dashboard",
            icon: <DashboardIcon />,
          },
          {
            label: "Meus Cursos",
            type: "page",
            path: "/aluno/cursos",
            icon: <BikeIcon />,
          },
          {
            label: "Carrinho",
            type: "page",
            path: "/carrinho",
            icon: <ShoppingCartIcon />,
          },
        ]
      : [
          // Para visitantes - links para seções da Home
          {
            label: "Início",
            type: "section",
            id: "inicio",
            icon: <HomeIcon />,
          },
          {
            label: "Cursos",
            type: "section",
            id: "cursos",
            icon: <BikeIcon />,
          },
          {
            label: "Sobre",
            type: "section",
            id: "sobre",
            icon: <SettingsIcon />,
          },
          {
            label: "Contato",
            type: "section",
            id: "contato",
            icon: <SettingsIcon />,
          },
        ];

  // Cores do tema
  const primaryColor = "#333333";
  const secondaryColor = "#FF6B35";
  const accentColor = "#666666";

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        backgroundColor: primaryColor,
        backgroundImage: "linear-gradient(135deg, #333333 0%, #444444 100%)",
        borderBottom: `3px solid ${secondaryColor}`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Toolbar>
        {/* Logo e Nome */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              color: secondaryColor,
              "&:hover": {
                backgroundColor: "rgba(255, 107, 53, 0.1)",
              },
            }}
          >
            <BikeIcon sx={{ fontSize: 32 }} />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              display: { xs: "none", sm: "block" },
              letterSpacing: "0.5px",
              background: "#FF9B73",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            CLUBE DO MECÂNICO
          </Typography>
        </Box>

        {/* Navegação para desktop */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1, mx: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                startIcon={item.icon}
                onClick={() => {
                  if (item.type === "section") {
                    scrollToSection(item.id);
                  } else {
                    navigate(item.path);
                  }
                }}
                sx={{
                  mx: 0.5,
                  px: 2,
                  borderRadius: "20px",
                  backgroundColor: (
                    item.type === "section"
                      ? location.hash === `#${item.id}`
                      : isActive(item.path)
                  )
                    ? "rgba(255, 107, 53, 0.2)"
                    : "transparent",
                  color: (
                    item.type === "section"
                      ? location.hash === `#${item.id}`
                      : isActive(item.path)
                  )
                    ? secondaryColor
                    : "white",
                  border: (
                    item.type === "section"
                      ? location.hash === `#${item.id}`
                      : isActive(item.path)
                  )
                    ? `2px solid ${secondaryColor}`
                    : "2px solid transparent",
                  fontWeight: (
                    item.type === "section"
                      ? location.hash === `#${item.id}`
                      : isActive(item.path)
                  )
                    ? 700
                    : 500,
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 53, 0.15)",
                    border: `2px solid ${secondaryColor}`,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Perfil e Menu para usuários logados */}
        {!isMobile && userType ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "4px 12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: secondaryColor,
                  color: "white",
                  mr: 1.5,
                  border: "2px solid white",
                }}
              >
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {userEmail || `${userType}@clube.com`}
                </Typography>
              </Box>
            </Box>

            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 107, 53, 0.2)",
                "&:hover": {
                  backgroundColor: secondaryColor,
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        ) : !isMobile && !userType ? (
          // Botões de Login/Cadastro para visitantes (desktop)
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: "20px",
                border: "2px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 53, 0.15)",
                  border: `2px solid ${secondaryColor}`,
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/cadastrar")}
              sx={{
                borderRadius: "20px",
                backgroundColor: secondaryColor,
                "&:hover": {
                  backgroundColor: "#FF5A23",
                },
              }}
            >
              Cadastrar
            </Button>
          </Box>
        ) : null}

        {/* Botão de menu para mobile */}
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 107, 53, 0.3)",
              "&:hover": {
                backgroundColor: secondaryColor,
              },
            }}
          >
            <PersonIcon />
          </IconButton>
        )}

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
              color: "white",
              border: `1px solid ${accentColor}`,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          {/* Item 1: Informações do usuário (se logado) */}
          {userType && (
            <MenuItem
              disabled
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                opacity: 1,
                "&.Mui-disabled": {
                  opacity: 1,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: secondaryColor,
                    border: "2px solid white",
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    {userEmail || `${userType}@clube.com`}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          )}

          {userType && <Divider sx={{ borderColor: accentColor }} />}

          {/* Item 2: Navegação mobile */}
          {isMobile &&
            navItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => {
                  if (item.type === "section") {
                    scrollToSection(item.id);
                  } else {
                    navigate(item.path);
                  }
                  handleMenuClose();
                }}
                sx={{
                  py: 1.5,
                  backgroundColor: (
                    item.type === "section"
                      ? location.hash === `#${item.id}`
                      : isActive(item.path)
                  )
                    ? "rgba(255, 107, 53, 0.15)"
                    : "transparent",
                  color: (
                    item.type === "section"
                      ? location.hash === `#${item.id}`
                      : isActive(item.path)
                  )
                    ? secondaryColor
                    : "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      color: (
                        item.type === "section"
                          ? location.hash === `#${item.id}`
                          : isActive(item.path)
                      )
                        ? secondaryColor
                        : accentColor,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: (
                        item.type === "section"
                          ? location.hash === `#${item.id}`
                          : isActive(item.path)
                      )
                        ? 700
                        : 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </MenuItem>
            ))}

          {isMobile && <Divider sx={{ borderColor: accentColor }} />}

          {/* Item 3: Meu Perfil (se logado) */}
          {userType && (
            <MenuItem
              onClick={() => {
                navigate(
                  userType === "admin" ? "/admin/dashboard" : "/aluno/dashboard"
                );
                handleMenuClose();
              }}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 53, 0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PersonIcon sx={{ color: accentColor }} />
                <Typography variant="body2">Meu Perfil</Typography>
              </Box>
            </MenuItem>
          )}

          {userType && <Divider sx={{ borderColor: accentColor }} />}

          {/* Item 4: Site Principal (para todos) */}
          <MenuItem
            onClick={() => {
              navigate("/");
              handleMenuClose();
            }}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "rgba(255, 107, 53, 0.1)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <HomeIcon sx={{ color: accentColor }} />
              <Typography variant="body2">Site Principal</Typography>
            </Box>
          </MenuItem>          

          {/* Item 5: Login/Cadastro (se não logado) */}
          {!userType && (
            <>
              <MenuItem
                onClick={() => {
                  navigate("/login");
                  handleMenuClose();
                }}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PersonIcon sx={{ color: accentColor }} />
                  <Typography variant="body2">Login</Typography>
                </Box>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate("/cadastrar");
                  handleMenuClose();
                }}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PersonIcon sx={{ color: accentColor }} />
                  <Typography variant="body2">Cadastrar</Typography>
                </Box>
              </MenuItem>
            </>
          )}

          {/* Item 6: Sair (se logado) */}
          {userType && (
            <>
              <Divider sx={{ borderColor: accentColor }} />
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  color: secondaryColor,
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 53, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <ExitToAppIcon />
                  <Typography variant="body2">Sair</Typography>
                </Box>
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
