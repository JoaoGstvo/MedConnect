// Hooks/useAuth.js - VERSÃO CORRIGIDA SEM LOOP
import { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from './useCurrentUser';

export const useAuth = () => {
  const { currentUser, loading, updateUser } = useCurrentUser();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // ⚡ Use ref para controlar se já validamos
  const hasValidatedRef = useRef(false);

  // Verificar e validar o usuário ao inicializar - APENAS UMA VEZ
  useEffect(() => {
    // ⚡ Prevenir múltiplas execuções
    if (loading || hasValidatedRef.current) return;

    const initializeAuth = async () => {
      console.log('🎯 Inicializando autenticação (APENAS UMA VEZ)...');
      
      if (currentUser && currentUser.id_usuario) {
        try {
          console.log('🔍 Validando usuário com ID:', currentUser.id_usuario);
          
          const userType = currentUser.tipo_usuario === 'empresa' ? 'empresas' : 'profissionais';
          const response = await fetch(`http://localhost:5000/api/${userType}/${currentUser.id_usuario}`);
          
          if (response.ok) {
            const updatedUser = await response.json();
            console.log('✅ Usuário validado com sucesso:', updatedUser.email);
            
            // ⚡ Só atualiza se os dados forem diferentes
            if (updatedUser.email !== currentUser.email) {
              updateUser({
                ...currentUser,
                ...updatedUser,
                id_usuario: currentUser.id_usuario,
                tipo_usuario: currentUser.tipo_usuario
              });
            }
          } else {
            console.warn('❌ Usuário não encontrado no banco, fazendo logout...');
            updateUser(null);
          }
        } catch (error) {
          console.error('💥 Erro ao validar usuário:', error);
        }
      }
      
      // ⚡ Marcar como validado para prevenir loops
      hasValidatedRef.current = true;
      setIsInitialized(true);
    };

    initializeAuth();
  }, [currentUser, loading, updateUser]); // ⚡ Dependências específicas

  const login = async (email, senha, tipo = 'profissional') => {
    try {
      let endpoint = '';
      
      if (tipo === 'empresa') {
        endpoint = 'http://localhost:5000/api/empresas/login';
      } else {
        endpoint = 'http://localhost:5000/api/profissionais/login';
      }

      console.log('🔐 Tentando login em:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha })
      });

      console.log('📊 Status da resposta:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Login bem-sucedido! Dados recebidos:', userData);
        
        if (userData) {
          const userWithSession = {
            ...userData,
            loginTimestamp: Date.now(),
            id_usuario: userData.id_usuario || userData.id_empresa
          };
          
          console.log('💾 Salvando usuário no storage:', userWithSession.email);
          updateUser(userWithSession);
          return { success: true, data: userData };
        }
      } else {
        const error = await response.json();
        console.error('❌ Erro na resposta:', error);
        return { success: false, error: error.error || 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('💥 Erro no login:', error);
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout...');
    // ⚡ Resetar o ref ao fazer logout
    hasValidatedRef.current = false;
    updateUser(null);
  };

  const refreshUserData = async () => {
    if (!currentUser?.id_usuario) return null;

    try {
      const userType = currentUser.tipo_usuario === 'empresa' ? 'empresas' : 'profissionais';
      const response = await fetch(`http://localhost:5000/api/${userType}/${currentUser.id_usuario}`);
      
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('🔄 Dados do usuário atualizados:', updatedUser.email);
        
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

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    isLoading: loading || !isInitialized,
    login,
    logout,
    refreshUserData
  };
};