import { useState, useEffect } from 'react';

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const updateUser = (userData) => {
    setCurrentUser(userData);
    if (userData) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  const loginUser = async (email, senha) => {
    try {
      setLoading(true);
      
      // Tentar login como profissional
      let response = await fetch('http://localhost:5000/api/profissionais/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        const userData = await response.json();
        updateUser(userData);
        return { success: true, data: userData };
      } else {
        // Se não for profissional, tentar como empresa
        response = await fetch('http://localhost:5000/api/empresas/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, senha })
        });

        if (response.ok) {
          const userData = await response.json();
          updateUser(userData);
          return { success: true, data: userData };
        } else {
          const errorData = await response.json();
          return { success: false, error: errorData.error || 'Credenciais inválidas' };
        }
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    updateUser(null);
  };

  return {
    currentUser,
    loading,
    updateUser,
    loginUser,
    logout
  };
};