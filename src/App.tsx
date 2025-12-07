import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AlunoDashboard from "./pages/students/AlunoDashboard";
import AdminDashboard from "./pages/administrador/AdminDashboard";
import { useEffect, useState } from "react";

// Componente para rotas protegidas
const PrivateRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: 'aluno' | 'admin' }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userType');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (userRole !== requiredRole) {
    return <Navigate to="/" />;
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
        {/* Rota pública - Home */}
        <Route path="/" element={<Home />} />
        
        {/* Rota pública - Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas para alunos */}
        <Route 
          path="/aluno/dashboard" 
          element={
            <PrivateRoute requiredRole="aluno">
              <AlunoDashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Rotas protegidas para administradores */}
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