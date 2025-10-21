// components/ProtectedRoute.js
import { useAuth } from './useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireProfile = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionar para login mantendo a URL de destino
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se precisa de perfil completo (para algumas páginas)
  if (requireProfile && user && !user.nome_completo) {
    return <Navigate to="/meucurriculo" replace />;
  }

  return children;
};

export default ProtectedRoute;