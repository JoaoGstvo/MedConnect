// Components/UserSelectorCompact/index.js - VERSÃO SIMPLIFICADA
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './index.scss';

function UserSelectorCompact() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fechar dropdown ao clicar fora
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
    console.log('Fazendo logout...');
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
    return user?.nome || user?.nome_completo || 'Usuário';
  };

  const getUserType = () => {
    return user?.tipo_usuario === 'empresa' ? 'Empresa' : 'Profissional';
  };

  const getMenuItems = () => {
    if (user?.tipo_usuario === 'empresa') {
      // Para empresas: APENAS Dashboard Empresa
      return [
        { path: '/dashboardempresa', label: 'Dashboard Empresa' }
      ];
    } else {
      // Para profissionais
      return [
        { path: '/meucurriculo', label: 'Meu Currículo' },
        { path: '/minhasvagas', label: 'Minhas Candidaturas' },
      ];
    }
  };

  return (
    <div className="user-selector-compact" ref={dropdownRef}>
      <button 
        className="user-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu do usuário"
        aria-expanded={isOpen}
      >
        <div className="user-avatar">
          {user?.foto_url ? (
            <img src={user.foto_url} alt={getUserDisplayName()} />
          ) : (
            <span className="avatar-initials">
              {getInitials(getUserDisplayName())}
            </span>
          )}
        </div>
        <span className="user-name">
          {getUserDisplayName()}
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
                {user?.foto_url ? (
                  <img src={user.foto_url} alt={getUserDisplayName()} />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(getUserDisplayName())}
                  </span>
                )}
              </div>
              <div className="user-details">
                <strong>{getUserDisplayName()}</strong>
                <span>{user?.email}</span>
                <small>{getUserType()}</small>
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