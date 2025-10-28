// Components/UserSelectorCompact/index.js - COM DEBUG
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { useUserData } from '../Hooks/useUserData';
import { useNavigate } from 'react-router-dom';
import './index.scss';

function UserSelectorCompact() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { userData } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('=== USER SELECTOR DEBUG ===');
    console.log(' user (from useAuth):', user);
    console.log(' userData (from useUserData):', userData);
    console.log('  Tipo usuário (user):', user?.tipo_usuario);
    console.log('  Tipo usuário (userData):', userData?.tipo_usuario);
    console.log(' Nome (user):', user?.nome);
    console.log(' Nome (userData):', userData?.nome);
    console.log(' IDs:', {
      user_id: user?.id_usuario,
      userData_id: userData?.id_usuario,
      empresa_id: user?.id_empresa
    });
    console.log('=== FIM DEBUG ===');
  }, [user, userData]);

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

  // CORREÇÃO: Lógica mais robusta para determinar o tipo
  const getUserDisplayName = () => {
    const source = userData || user;
    
    console.log('getUserDisplayName - source:', source);
    
    if (source?.tipo_usuario === 'empresa') {
      return source?.nome || 'Empresa';
    }
    return source?.nome_completo || source?.nome || 'Usuário';
  };

  const getUserImageUrl = () => {
    const source = userData || user;
    
    if (source?.tipo_usuario === 'empresa') {
      return source?.logo_url;
    }
    return source?.foto_url;
  };

  // CORREÇÃO CRÍTICA: Determinar o tipo corretamente
  const getUserType = () => {
    const source = userData || user;
    
    console.log('getUserType - source tipo:', source?.tipo_usuario);
    console.log('getUserType - source completo:', source);
    
    // Verifica múltiplas formas de identificar o tipo
    if (source?.tipo_usuario === 'empresa' || source?.id_empresa) {
      return 'Empresa';
    }
    if (source?.tipo_usuario === 'profissional' || source?.id_usuario) {
      return 'Profissional';
    }
    
    return 'Usuário';
  };

  const getEmail = () => {
    const source = userData || user;
    return source?.email || '';
  };

  const getMenuItems = () => {
    const source = userData || user;
    const userType = getUserType();
    
    console.log('getMenuItems - userType:', userType);
    
    if (userType === 'Empresa') {
      return [
        { path: '/dashboardempresa', label: 'Dashboard Empresa' }
      ];
    } else {
      return [
        { path: '/meucurriculo', label: 'Meu Currículo' },
        { path: '/minhasvagas', label: 'Minhas Candidaturas' },
        { path: '/artigos', label: 'Meu Artigos' }
      ];
    }
  };

  if (!user) {
    return null;
  }

  const displayName = getUserDisplayName();
  const userType = getUserType();
  const email = getEmail();

  console.log(' Renderizando com:', { displayName, userType, email });

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