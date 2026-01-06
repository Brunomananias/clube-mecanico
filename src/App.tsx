import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AlunoDashboard from "./pages/students/AlunoDashboard";
import AdminDashboard from "./pages/administrador/AdminDashboard";
import { useEffect, useState } from "react";
import CursosPage from './pages/CursosPage';
import CursoDetalhePage from './pages/CursoDetalhePage';
import CarrinhoPage from './pages/CarrinhoPage';
import CadastroAlunoPage from './pages/CadastroPage';
import MercadoPagoCheckout from './pages/MercadoPagoCheckout';
import PagamentoSucesso from './pages/pagamento/PagamentoSucesso';
import PagamentoFalha from './pages/pagamento/PagamentoFalha';
import PagamentoPendente from './pages/pagamento/PagamentoPendente';
import CursosAdminPage from './pages/administrador/CursoAdminPage';
import { authService } from './services/authService'; // Importe o authService
import PixPaymentPage from './pages/PixPaymentPage';
import AlunoPerfil from './pages/components/AlunoPerfil';
// Componente para rotas protegidas
// Componente para rotas protegidas - VERSÃO CORRIGIDA
const PrivateRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 0 | 1 }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('PrivateRoute - requiredRole:', requiredRole);
  
  if (!isAuthenticated) {
    console.log('PrivateRoute: Não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole !== undefined) {
    const user = authService.getCurrentUser();
    console.log('PrivateRoute - user:', user);
    console.log('PrivateRoute - user.tipo:', user?.tipo);
    
    if (!user) {
      console.log('PrivateRoute: Usuário não encontrado');
      return <Navigate to="/login" replace />;
    }
    
    if (user.tipo !== requiredRole) {
      console.log(`PrivateRoute: Tipo incorreto. Esperado: ${requiredRole}, Recebido: ${user.tipo}`);
      
      // Redireciona para dashboard apropriado
      if (user.tipo === 1) {
        console.log('Redirecionando para admin/dashboard');
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        console.log('Redirecionando para aluno/dashboard');
        return <Navigate to="/aluno/dashboard" replace />;
      }
    }
  }
  
  console.log('PrivateRoute: Acesso permitido');
  return <>{children}</>;
};

// Uso nas rotas:
<>
  // Uso nas rotas:
  <Route
    path="/aluno/dashboard"
    element={<PrivateRoute requiredRole={0}>
      <AlunoDashboard />
    </PrivateRoute>} /><Route
    path="/admin/dashboard"
    element={<PrivateRoute requiredRole={1}>
      <AdminDashboard />
    </PrivateRoute>} /></>

// Componente para rotas públicas que requerem autenticação (como carrinho)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    console.log('Rota protegida: usuário não autenticado');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Verificar estado de login quando o componente montar
  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = authService.isAuthenticated();
      setIsLoggedIn(loggedIn);
    };
    
    checkLogin();
    
    // Listener para mudanças no localStorage
    window.addEventListener('storage', checkLogin);
    
    return () => {
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  // Função para verificar o estado atual (útil para debug)
  useEffect(() => {
    console.log('Estado de login:', isLoggedIn);
    console.log('Token no localStorage:', localStorage.getItem('auth_token'));
    console.log('Usuário no localStorage:', localStorage.getItem('user'));
  }, [isLoggedIn]);

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<CadastroAlunoPage />} />
        <Route path="/cursos" element={<CursosPage />} />
        <Route path="/curso/:id" element={<CursoDetalhePage />} />
        <Route path="/pagamento/pix/:pedidoId" element={<PixPaymentPage />} />
        {/* Rotas que requerem autenticação (mas não role específico) */}
        <Route 
          path="/carrinho" 
          element={
            <AuthRoute>
              <CarrinhoPage />
            </AuthRoute>
          } 
        />
        
        <Route 
          path="/mercadopago-checkout" 
          element={
            <AuthRoute>
              <MercadoPagoCheckout />
            </AuthRoute>
          } 
        />
        
        {/* Páginas de status de pagamento */}
        <Route 
          path="/pagamento/sucesso" 
          element={
            <AuthRoute>
              <PagamentoSucesso />
            </AuthRoute>
          } 
        />
        
        <Route 
          path="/pagamento/falha" 
          element={
            <AuthRoute>
              <PagamentoFalha />
            </AuthRoute>
          } 
        />
        
        <Route 
          path="/pagamento/pendente" 
          element={
            <AuthRoute>
              <PagamentoPendente />
            </AuthRoute>
          } 
        />
        
        <Route path="/aluno/perfil" element={<AlunoPerfil />} />
        {/* Rotas protegidas por role */}
        <Route 
          path="/aluno/dashboard" 
          element={
            <PrivateRoute requiredRole={0}>
              <AlunoDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute requiredRole={1}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/cursos" 
          element={
            <PrivateRoute requiredRole={1}>
              <CursosAdminPage />
            </PrivateRoute>
          } 
        />
        
        {/* Rota para página não encontrada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;