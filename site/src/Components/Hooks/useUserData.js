import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useUserData = (autoRefresh = true) => {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('useUserData: Buscando dados do usuário...', {
        isAuthenticated,
        userId: user?.id_usuario,
        userType: user?.tipo_usuario
      });

      if (!isAuthenticated || !user?.id_usuario) {
        console.log('useUserData: Usuário não autenticado ou sem ID');
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const userType = user.tipo_usuario === 'empresa' ? 'empresas' : 'profissionais';
        const userId = user.id_usuario;
        
        console.log(`useUserData: Buscando ${userType} com ID ${userId}`);
        
        const response = await fetch(`http://localhost:5000/api/${userType}/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('useUserData: Dados recebidos:', data);
          setUserData(data);
        } else {
          throw new Error(`Erro ${response.status} ao carregar dados do usuário`);
        }
      } catch (err) {
        console.error('useUserData: Erro ao buscar dados:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    if (autoRefresh) {
      const interval = setInterval(fetchUserData, 2 * 60 * 1000);
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
      const userId = user.id_usuario;
      
      console.log(`useUserData: Atualizando ${userType} com ID ${userId}`, updates);
      
      const response = await fetch(`http://localhost:5000/api/${userType}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log('useUserData: Dados atualizados:', updatedData);
        setUserData(updatedData);
        
        await refreshUserData();
        
        return updatedData;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar dados');
      }
    } catch (err) {
      console.error('useUserData: Erro na atualização:', err);
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