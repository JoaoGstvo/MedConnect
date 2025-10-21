// hooks/useUserData.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useUserData = (autoRefresh = true) => {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user?.id_usuario) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const userType = user.tipo_usuario === 'empresa' ? 'empresas' : 'profissionais';
        const response = await fetch(`http://localhost:5000/api/${userType}/${user.id_usuario}`);
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          throw new Error('Erro ao carregar dados do usuário');
        }
      } catch (err) {
        setError(err.message);
        console.error('Erro ao buscar dados do usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Atualizar automaticamente se configurado
    if (autoRefresh) {
      const interval = setInterval(fetchUserData, 2 * 60 * 1000); // A cada 2 minutos
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, autoRefresh]);

  const updateUserData = async (updates) => {
    if (!isAuthenticated || !user?.id_usuario) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setLoading(true);
      setError(null);
      
      const userType = user.tipo_usuario === 'empresa' ? 'empresas' : 'profissionais';
      const response = await fetch(`http://localhost:5000/api/${userType}/${user.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        
        // Atualizar também no contexto de autenticação
        await refreshUserData();
        
        return updatedData;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar dados');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    loading,
    error,
    updateUserData,
    refreshUserData: () => {
      setLoading(true);
      return refreshUserData().finally(() => setLoading(false));
    }
  };
};  