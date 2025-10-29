// Components/Hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    try {
      const userData = localStorage.getItem('user');
      const empresaData = localStorage.getItem('empresaLogada');

      if (empresaData) {
        const empresa = JSON.parse(empresaData);
        const empresaComTipo = {
          ...empresa,
          tipo_usuario: 'empresa',
          id_usuario: empresa.id_empresa,
          id_empresa: empresa.id_empresa,
          nome: empresa.nome,
          nome_completo: empresa.nome,
          email: empresa.email,
          logo_url: empresa.logo_url
        };
        setUser(empresaComTipo);
        return empresaComTipo;
      } else if (userData) {
        const user = JSON.parse(userData);
        const userComTipo = {
          ...user,
          tipo_usuario: 'profissional',
          id_usuario: user.id_usuario,
          nome_completo: user.nome_completo || user.nome,
          foto_url: user.foto_url
        };
        setUser(userComTipo);
        return userComTipo;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('empresaLogada');
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    refreshUserData().finally(() => setLoading(false));
  }, []);

  const login = async (email, senha, accountType) => {
    try {
      setLoading(true);
      
      const endpoint = accountType === 'empresa' 
        ? 'http://localhost:5000/api/empresas/login'
        : 'http://localhost:5000/api/profissionais/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Credenciais inválidas' };
      }

      const result = await response.json();
      
      let userData;
      
      if (accountType === 'empresa') {
        userData = {
          ...result,
          tipo_usuario: 'empresa',
          id_usuario: result.id_empresa,
          id_empresa: result.id_empresa,
          nome: result.nome,
          nome_completo: result.nome,
          email: result.email,
          logo_url: result.logo_url,
          cnpj: result.cnpj,
          descricao: result.descricao,
          telefone: result.telefone
        };
        
        localStorage.setItem('empresaLogada', JSON.stringify(userData));
        localStorage.removeItem('user');
        
      } else {
        userData = {
          ...result,
          tipo_usuario: 'profissional',
          id_usuario: result.id_usuario,
          nome_completo: result.nome_completo || result.nome,
          email: result.email,
          foto_url: result.foto_url
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.removeItem('empresaLogada');
      }

      setUser(userData);
      return { success: true, data: userData };

    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('empresaLogada');
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    setUser(null);
  };

  // Função para verificar se é empresa
  const isEmpresa = () => {
    return user?.tipo_usuario === 'empresa';
  };

  // Função para verificar se é profissional
  const isProfissional = () => {
    return user?.tipo_usuario === 'profissional';
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: loading,
    isEmpresa,
    isProfissional,
    login,
    logout,
    refreshUserData
  };
};