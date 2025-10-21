// Components/Hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 useAuth: Iniciando verificação do localStorage');
    
    const userData = localStorage.getItem('user');
    const empresaData = localStorage.getItem('empresaLogada');
    
    console.log('📦 Dados no localStorage:', {
      userData: userData ? 'PRESENTE' : 'AUSENTE',
      empresaData: empresaData ? 'PRESENTE' : 'AUSENTE'
    });

    if (empresaData) {
      try {
        const empresa = JSON.parse(empresaData);
        console.log('🏢 useAuth: Empresa detectada:', empresa.nome);
        console.log('🏢 Tipo do usuário empresa:', empresa.tipo_usuario);
        
        const empresaComTipo = {
          ...empresa,
          tipo_usuario: 'empresa'
        };
        
        setUser(empresaComTipo);
      } catch (error) {
        console.error('❌ useAuth: Erro ao parsear dados da empresa:', error);
        localStorage.removeItem('empresaLogada');
      }
    } else if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('👤 useAuth: Usuário profissional detectado:', user.email);
        console.log('👤 Tipo do usuário profissional:', user.tipo_usuario);
        
        const userComTipo = {
          ...user,
          tipo_usuario: user.tipo_usuario || 'profissional'
        };
        
        setUser(userComTipo);
      } catch (error) {
        console.error('❌ useAuth: Erro ao parsear dados do usuário:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('🔍 useAuth: Nenhum usuário autenticado encontrado');
    }
    
    setLoading(false);
  }, []);

  const login = async (email, senha, accountType) => {
    try {
      setLoading(true);
      
      const endpoint = accountType === 'empresa' 
        ? 'http://localhost:5000/api/empresas/login'
        : 'http://localhost:5000/api/profissionais/login';

      console.log('🔐 useAuth: Tentando login em:', endpoint);
      console.log('🔐 Tipo de conta:', accountType);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      console.log('📊 useAuth: Status da resposta:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ useAuth: Erro na resposta:', errorData);
        return { success: false, error: errorData.error || 'Credenciais inválidas' };
      }

      const userData = await response.json();
      console.log('✅ useAuth: Login bem-sucedido! Dados:', userData);

      const userComTipo = {
        ...userData,
        tipo_usuario: accountType === 'empresa' ? 'empresa' : 'profissional',
        id_usuario: userData.id_usuario || userData.id_empresa
      };

      console.log('👤 useAuth: Dados estruturados:', userComTipo);

      if (accountType === 'empresa') {
        localStorage.setItem('empresaLogada', JSON.stringify(userComTipo));
        localStorage.removeItem('user');
        console.log('💾 useAuth: Empresa salva no localStorage');
      } else {
        localStorage.setItem('user', JSON.stringify(userComTipo));
        localStorage.removeItem('empresaLogada');
        console.log('💾 useAuth: Profissional salvo no localStorage');
      }
      
      setUser(userComTipo);
      return { success: true, data: userComTipo };

    } catch (error) {
      console.error('💥 useAuth: Erro no login:', error);
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 useAuth: Fazendo logout - LIMPANDO LOCALSTORAGE');
    
    localStorage.removeItem('user');
    localStorage.removeItem('empresaLogada');
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    
    setUser(null);
    console.log('✅ useAuth: Logout concluído');
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: loading,
    login,
    logout
  };
};