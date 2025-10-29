// Components/Hooks/useAuth.js - CORREÇÃO DA ESTRUTURA
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    console.log('useAuth: Atualizando dados do usuário...');
    
    const userData = localStorage.getItem('user');
    const empresaData = localStorage.getItem('empresaLogada');
    
    console.log('Dados encontrados:', {
      userData: userData ? JSON.parse(userData) : null,
      empresaData: empresaData ? JSON.parse(empresaData) : null
    });

    if (empresaData) {
      try {
        const empresa = JSON.parse(empresaData);
        console.log('✅ useAuth: CARREGANDO EMPRESA:', empresa.nome);
        
        const empresaComTipo = {
          ...empresa,
          tipo_usuario: 'empresa', 
          id_usuario: empresa.id_empresa || empresa.id_usuario,
          nome: empresa.nome,
          email: empresa.email,
          logo_url: empresa.logo_url
        };
        
        console.log(' Empresa final:', empresaComTipo);
        setUser(empresaComTipo);
        return empresaComTipo;
      } catch (error) {
        console.error('useAuth: Erro ao carregar empresa:', error);
      }
    } else if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('✅ useAuth: CARREGANDO PROFISSIONAL:', user.email);
        
        const userComTipo = {
          ...user,
          tipo_usuario: 'profissional', 
          id_usuario: user.id_usuario,
          nome_completo: user.nome_completo || user.nome,
          foto_url: user.foto_url
        };
        
        console.log(' Profissional final:', userComTipo);
        setUser(userComTipo);
        return userComTipo;
      } catch (error) {
        console.error('useAuth: Erro ao carregar profissional:', error);
      }
    } else {
      console.log('❌ useAuth: Nenhum usuário encontrado no localStorage');
      setUser(null);
    }
    
    return null;
  };

  useEffect(() => {
    console.log('=== useAuth: INICIANDO VERIFICAÇÃO ===');
    refreshUserData().finally(() => setLoading(false));
  }, []);

  const login = async (email, senha, accountType) => {
    try {
      setLoading(true);
      
      const endpoint = accountType === 'empresa' 
        ? 'http://localhost:5000/api/empresas/login'
        : 'http://localhost:5000/api/profissionais/login';

      console.log(` useAuth: Login ${accountType} em:`, endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      console.log(' useAuth: Status da resposta:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ useAuth: Erro no login:', errorData);
        return { success: false, error: errorData.error || 'Credenciais inválidas' };
      }

      const result = await response.json();
      console.log('✅ useAuth: Login bem-sucedido! Resposta:', result);

      let userData;
      
      if (accountType === 'empresa') {
        userData = {
          ...result.empresa,
          tipo_usuario: 'empresa',
          id_usuario: result.empresa.id_empresa, 
          id_empresa: result.empresa.id_empresa, 
          nome: result.empresa.nome,
          email: result.empresa.email,
          logo_url: result.empresa.logo_url,
          cnpj: result.empresa.cnpj,
          descricao: result.empresa.descricao,
          telefone: result.empresa.telefone
        };
        
        console.log(' useAuth: Dados da empresa estruturados:', userData);
        localStorage.setItem('empresaLogada', JSON.stringify(userData));
        localStorage.removeItem('user');
        
      } else {
        userData = {
          ...result.user || result,
          tipo_usuario: 'profissional',
          id_usuario: result.user?.id_usuario || result.id_usuario,
          nome_completo: result.user?.nome_completo || result.nome_completo,
          email: result.user?.email || result.email,
          foto_url: result.user?.foto_url || result.foto_url
        };
        
        console.log('👤 useAuth: Dados do profissional estruturados:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.removeItem('empresaLogada');
      }

      setUser(userData);
      return { success: true, data: userData };

    } catch (error) {
      console.error(' useAuth: Erro no login:', error);
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log(' useAuth: Fazendo logout');
    
    localStorage.removeItem('user');
    localStorage.removeItem('empresaLogada');
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    
    setUser(null);
    console.log('✅ useAuth: Logout concluído');
  };

  const isEmpresa = () => {
    return user?.tipo_usuario === 'empresa';
  };

  const isProfissional = () => {
    return user?.tipo_usuario === 'profissional';
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: loading,
    login,
    logout,
    refreshUserData,
    isEmpresa, 
    isProfissional 
  };
};