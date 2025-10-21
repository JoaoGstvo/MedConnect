// Hooks/useCurrentUser.js
import { useState, useEffect } from 'react';

// Chave para armazenamento local
const USER_STORAGE_KEY = 'currentUser';
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Verificar se a sessão expirou
          if (userData.loginTimestamp && (Date.now() - userData.loginTimestamp) > SESSION_TIMEOUT) {
            console.log('Sessão expirada');
            localStorage.removeItem(USER_STORAGE_KEY);
            setCurrentUser(null);
          } else {
            setCurrentUser(userData);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const updateUser = (userData) => {
    try {
      setCurrentUser(userData);
      
      if (userData) {
        // Adicionar timestamp se não existir
        const userWithTimestamp = {
          ...userData,
          loginTimestamp: userData.loginTimestamp || Date.now()
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithTimestamp));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário no localStorage:', error);
    }
  };

  // Função para verificar se a sessão está ativa
  const isSessionActive = () => {
    if (!currentUser?.loginTimestamp) return false;
    return (Date.now() - currentUser.loginTimestamp) < SESSION_TIMEOUT;
  };

  return {
    currentUser,
    loading,
    updateUser,
    isSessionActive
  };
};