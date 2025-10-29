import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './index.scss';

function UserSelectorCompact() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (!user) return 'Usuário';
    return user.tipo_usuario === 'empresa' ? user.nome : user.nome_completo || user.nome;
  };

  const getUserImageUrl = () => {
    if (!user) return null;
    return user.tipo_usuario === 'empresa' ? user.logo_url : user.foto_url;
  };

  const getUserType = () => {
    if (!user) return 'Usuário';
    return user.tipo_usuario === 'empresa' ? 'Empresa' : 'Profissional';
  };

  const getEmail = () => {
    return user?.email || '';
  };

  const getMenuItems = () => {
    if (!user) return [];
    
    if (user.tipo_usuario === 'empresa') {
      return [
        { path: '/dashboardempresa', label: 'Dashboard Empresa' }
      ];
    } else {
      return [
        { path: '/meucurriculo', label: 'Meu Currículo' },
        { path: '/minhasvagas', label: 'Minhas Candidaturas' },
        { path: '/artigos', label: 'Meus Artigos' }
      ];
    }
  };

  if (!user) {
    return null;
  }

  const displayName = getUserDisplayName();
  const userType = getUserType();
  const email = getEmail();

  return (
    <div className="user-selector-compact" ref={dropdownRef}>
      <button 
        className="user-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu do usuário"
        aria-expanded={isOpen}
      >
        <div className="user-avatar">
          {getUserImageUrl() ? (
            <img src={getUserImageUrl()} alt={displayName} />
          ) : (
            <span className="avatar-initials">
              {getInitials(displayName)}
            </span>
          )}
        </div>
        <span className="user-name">
          {displayName}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="user-dropdown" role="menu">
          <div className="dropdown-header">
            <div className="user-info">
              <div className="user-avatar large">
                {getUserImageUrl() ? (
                  <img src={getUserImageUrl()} alt={displayName} />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(displayName)}
                  </span>
                )}
              </div>
              <div className="user-details">
                <strong>{displayName}</strong>
                <span>{email}</span>
                <small>{userType}</small>
              </div>
            </div>
          </div>

          <div className="dropdown-divider" role="separator"></div>

          <div className="dropdown-menu">
            {getMenuItems().map((item, index) => (
              <button 
                key={index}
                onClick={() => handleNavigation(item.path)}
                role="menuitem"
                className="menu-item"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="dropdown-divider" role="separator"></div>

          <div className="dropdown-footer">
            <button 
              onClick={handleLogout} 
              className="logout-btn"
              role="menuitem"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSelectorCompact;