// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useCurrentUser } from './useCurrentUser';

export const useAuth = () => {
  const { currentUser, loading, updateUser } = useCurrentUser();
  const [isInitialized, setIsInitialized] = useState(false);

  // Verificar e validar o usuário ao inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      if (currentUser && currentUser.id_usuario) {
        try {
          // Verificar se o usuário ainda existe no banco e atualizar dados
          const userType = currentUser.tipo_usuario === 'empresa' ? 'empresas' : 'profissionais';
          const response = await fetch(`http://localhost:5000/api/${userType}/${currentUser.id_usuario}`);
          
          if (response.ok) {
            const updatedUser = await response.json();
            // Mesclar dados atualizados mantendo a sessão
            updateUser({
              ...currentUser,
              ...updatedUser,
              // Garantir que campos essenciais não sejam perdidos
              id_usuario: currentUser.id_usuario,
              tipo_usuario: currentUser.tipo_usuario
            });
          } else {
            // Usuário não existe mais no banco - fazer logout
            console.warn('Usuário não encontrado no banco, fazendo logout...');
            updateUser(null);
          }
        } catch (error) {
          console.error('Erro ao validar usuário:', error);
          // Em caso de erro de rede, mantém o usuário logado
        }
      }
      setIsInitialized(true);
    };

    if (!loading) {
      initializeAuth();
    }
  }, [currentUser, loading, updateUser]);

  const login = async (email, senha, tipo = 'profissional') => {
    try {
      let endpoint = '';
      let userKey = '';
      
      if (tipo === 'empresa') {
        endpoint = 'http://localhost:5000/api/empresas/login';
        userKey = 'empresa';
      } else {
        endpoint = 'http://localhost:5000/api/profissionais/login';
        userKey = 'user';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data[userKey];
        
        if (userData) {
          // Adicionar timestamp de login
          const userWithSession = {
            ...userData,
            loginTimestamp: Date.now(),
            // Garantir que id_usuario esteja presente
            id_usuario: userData.id_usuario || userData.id_empresa
          };
          
          updateUser(userWithSession);
          return { success: true, data };
        }
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const logout = () => {
    updateUser(null);
    // Limpar qualquer dado de sessão adicional se necessário
    localStorage.removeItem('userSession');
  };

  const refreshUserData = async () => {
    if (!currentUser?.id_usuario) return null;

    try {
      const userType = currentUser.tipo_usuario === 'empresa' ? 'empresas' : 'profissionais';
      const response = await fetch(`http://localhost:5000/api/${userType}/${currentUser.id_usuario}`);
      
      if (response.ok) {
        const updatedUser = await response.json();
        // Mesclar dados atualizados mantendo a sessão
        const mergedUser = {
          ...currentUser,
          ...updatedUser,
          id_usuario: currentUser.id_usuario,
          tipo_usuario: currentUser.tipo_usuario,
          loginTimestamp: currentUser.loginTimestamp
        };
        
        updateUser(mergedUser);
        return mergedUser;
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
    
    return null;
  };

  const updateUserProfile = async (updates) => {
    if (!currentUser?.id_usuario) return { success: false, error: 'Usuário não logado' };

    try {
      const userType = currentUser.tipo_usuario === 'empresa' ? 'empresas' : 'profissionais';
      const response = await fetch(`http://localhost:5000/api/${userType}/${currentUser.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Atualizar dados locais
        const mergedUser = {
          ...currentUser,
          ...updatedUser,
          id_usuario: currentUser.id_usuario,
          tipo_usuario: currentUser.tipo_usuario,
          loginTimestamp: currentUser.loginTimestamp
        };
        
        updateUser(mergedUser);
        return { success: true, user: mergedUser };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  };

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    isLoading: loading || !isInitialized,
    login,
    logout,
    refreshUserData,
    updateUserProfile,
    updateUser
  };
};