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
import CadastroAlunoPage from './pages/CadastroAlunoPage';
import MercadoPagoCheckout from './pages/MercadoPagoCheckout';
import PagamentoSucesso from './pages/pagamento/PagamentoSucesso';
import PagamentoFalha from './pages/pagamento/PagamentoFalha';
import PagamentoPendente from './pages/pagamento/PagamentoPendente';

// Componente para rotas protegidas
const PrivateRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'aluno' | 'admin' }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole) {
    const userRole = localStorage.getItem('userType');
    if (userRole !== requiredRole) {
      return <Navigate to="/" />;
    }
  }
  
  return <>{children}</>;
};

// Componente para rotas públicas que requerem autenticação (como carrinho)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Verificar estado de login quando o componente montar
  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };
    
    checkLogin();
    
    // Listener para mudanças no localStorage
    window.addEventListener('storage', checkLogin);
    
    return () => {
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<CadastroAlunoPage />} />
        <Route path="/cursos" element={<CursosPage />} />
        <Route path="/curso/:id" element={<CursoDetalhePage />} />
        
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
        
        {/* Rotas protegidas por role */}
        <Route 
          path="/aluno/dashboard" 
          element={
            <PrivateRoute requiredRole="aluno">
              <AlunoDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
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