// Components/Hooks/ProtectedRoute.js
import { useAuth } from './useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute - Verificando autenticação:', {
    isAuthenticated,
    isLoading,
    user: user?.email,
    tipo: user?.tipo_usuario,
    path: location.pathname
  });

  if (isLoading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Verificando autenticação...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute - Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === '/dashboardempresa' && user?.tipo_usuario !== 'empresa') {
    console.log('🚫 Acesso negado: Rota de empresa para usuário profissional');
    return <Navigate to="/vagas" replace />;
  }

  console.log('✅ ProtectedRoute - Usuário autenticado, permitindo acesso');
  return children;
};

export default ProtectedRoute;