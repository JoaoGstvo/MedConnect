// components/UserSelectorCompact.js
import { useState, useEffect } from 'react';
import { useCurrentUser } from '../Hooks/useCurrentUser';
import './index.scss';

const UserSelectorCompact = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const { currentUser, updateUser } = useCurrentUser();

  // Buscar usuários do banco de dados
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profissionais');
        if (response.ok) {
          const users = await response.json();
          setAvailableUsers(users);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        // Fallback para usuários demo se a API falhar
        setAvailableUsers([
          { id_usuario: 1, nome: "João Silva", email: "joao@demo.com", tipo_usuario: "candidato" },
          { id_usuario: 2, nome: "Maria Santos", email: "maria@demo.com", tipo_usuario: "candidato" },
          { id_usuario: 3, nome: "Pedro Oliveira", email: "pedro@demo.com", tipo_usuario: "candidato" }
        ]);
      }
    };

    fetchUsers();
  }, []);

  const switchUser = (user) => {
    const userData = {
      id_usuario: user.id_usuario,
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario || 'candidato'
    };
    
    updateUser(userData);
    setShowDropdown(false);
    window.location.reload();
  };

  const logout = () => {
    updateUser(null);
    setShowDropdown(false);
    window.location.reload();
  };

  return (
    <div className="user-selector-compact">
      {currentUser ? (
        <div className="user-info">
          <button 
            className="current-user-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-avatar">
              {currentUser.nome?.charAt(0) || 'U'}
            </div>
            <span className="user-name">{currentUser.nome}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <span>Trocar de Usuário</span>
              </div>
              
              <div className="users-list">
                {availableUsers.map(user => (
                  <button
                    key={user.id_usuario}
                    className={`user-option ${currentUser.id_usuario === user.id_usuario ? 'active' : ''}`}
                    onClick={() => switchUser(user)}
                  >
                    <div className="user-avatar small">
                      {user.nome?.charAt(0) || 'U'}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{user.nome}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="dropdown-actions">
                <button className="logout-btn" onClick={logout}>
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="login-prompt">
          <button 
            className="login-btn" 
            onClick={() => availableUsers.length > 0 && switchUser(availableUsers[0])}
          >
            Fazer Login
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSelectorCompact;