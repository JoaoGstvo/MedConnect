// components/AuthProvider.js
import { createContext, useContext, useEffect } from 'react';
import { useAuth } from './useAuth';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  // Efeito para verificar sessão periodicamente
  useEffect(() => {
    if (auth.isAuthenticated) {
      // Atualizar dados do usuário a cada 5 minutos
      const interval = setInterval(() => {
        auth.refreshUserData();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [auth.isAuthenticated, auth.refreshUserData]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};