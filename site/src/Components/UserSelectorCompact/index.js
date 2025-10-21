import { useState } from 'react';
import { useCurrentUser } from '../Hooks/useCurrentUser';
import './index.scss';

const UserSelectorCompact = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser, logout } = useCurrentUser();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    window.location.href = '/';
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
              {currentUser.nome?.charAt(0) || currentUser.empresa_nome?.charAt(0) || 'U'}
            </div>
            <span className="user-name">
              {currentUser.nome || currentUser.empresa_nome}
            </span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showDropdown && (
            <div className="user-dropdown">
              <div className="user-info-panel">
                <div className="user-avatar large">
                  {currentUser.nome?.charAt(0) || currentUser.empresa_nome?.charAt(0) || 'U'}
                </div>
                <div className="user-details">
                  <span className="user-name">
                    {currentUser.nome || currentUser.empresa_nome}
                  </span>
                  <span className="user-email">{currentUser.email}</span>
                  <span className="user-type">
                    {currentUser.tipo_usuario === 'empresa' ? 'Empresa' : 'Profissional'}
                  </span>
                </div>
              </div>
              
              <div className="dropdown-actions">
                <button className="logout-btn" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="login-prompt">
          <a href="/login" className="login-btn">
            Fazer Login
          </a>
        </div>
      )}
    </div>
  );
};

export default UserSelectorCompact;