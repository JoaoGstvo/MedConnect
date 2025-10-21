// Components/UserSelectorCompact/index.js - VERSÃO ATUALIZADA
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
    console.log('🚪 Fazendo logout...');
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
            {user?.tipo_usuario === 'empresa' ? (
              <>
                <button 
                  onClick={() => handleNavigation('/dashboardempresa')}
                  role="menuitem"
                >
                  🏢 Dashboard Empresa
                </button>
                <button 
                  onClick={() => handleNavigation('/minhasvagas')}
                  role="menuitem"
                >
                  📋 Minhas Vagas
                </button>
                <button 
                  onClick={() => handleNavigation('/empresas')}
                  role="menuitem"
                >
                  👥 Gerenciar Empresa
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNavigation('/meucurriculo')}
                  role="menuitem"
                >
                  📄 Meu Currículo
                </button>
                <button 
                  onClick={() => handleNavigation('/minhasvagas')}
                  role="menuitem"
                >
                  📋 Minhas Candidaturas
                </button>
                <button 
                  onClick={() => handleNavigation('/profissionalprofile')}
                  role="menuitem"
                >
                  👤 Meu Perfil
                </button>
              </>
            )}

            <button 
              onClick={() => handleNavigation('/configuracoes')}
              role="menuitem"
            >
              ⚙️ Configurações
            </button>
          </div>

          <div className="dropdown-divider" role="separator"></div>

          <div className="dropdown-footer">
            <button 
              onClick={handleLogout} 
              className="logout-btn"
              role="menuitem"
            >
              🚪 Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSelectorCompact;