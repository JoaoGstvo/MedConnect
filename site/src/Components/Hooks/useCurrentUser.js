// Hooks/useCurrentUser.js - VERSÃO SIMPLIFICADA
import { useState, useEffect } from 'react';

const USER_STORAGE_KEY = 'currentUser_v3';
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000;

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        
        if (!storedUser) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        const userData = JSON.parse(storedUser);

        // Verificação de sessão
        if (!userData.loginTimestamp || (Date.now() - userData.loginTimestamp) > SESSION_TIMEOUT) {
          localStorage.removeItem(USER_STORAGE_KEY);
          setCurrentUser(null);
        } else {
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
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
      if (userData) {
        const userWithTimestamp = {
          ...userData,
          loginTimestamp: Date.now()
        };
        
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithTimestamp));
        setCurrentUser(userWithTimestamp);
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return {
    currentUser,
    loading,
    updateUser
  };
};