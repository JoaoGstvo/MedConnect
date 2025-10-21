// Components/Hooks/ProtectedRoute.js - VERSÃO CORRIGIDA
import { useAuth } from './useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute - Verificando autenticação:', {
    isAuthenticated,
    isLoading,
    path: location.pathname
  });

  // Se ainda está carregando, mostra loading
  if (isLoading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div className="spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute - Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ ProtectedRoute - Usuário autenticado, permitindo acesso');
  return children;
};

export default ProtectedRoute;