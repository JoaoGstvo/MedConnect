// Components/Header/index.js - VERSÃO ATUALIZADA
import './index.scss';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import UserSelectorCompact from '../UserSelectorCompact';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    const { user, isAuthenticated } = useAuth();

    // Efeito de scroll para header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fechar menu ao mudar de rota
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Prevenir scroll do body quando menu está aberto
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isActiveLink = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Implementar lógica de busca
        console.log('🔍 Buscando...');
    };

    return (
        <header className={`header-page ${isScrolled ? 'scrolled' : ''}`}>
            <div className='navigation-container'>
                {/* Logo */}
                <div className='logo-section'>
                    <a 
                        href="/" 
                        onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}
                        aria-label="Página inicial"
                    >
                        <img src="/Images/Logo.png" alt="Logo MedConnect" />
                    </a>
                </div>

                {/* Navegação */}
                <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`} aria-label="Navegação principal">
                    <div className='nav-links-group'>
                        <a 
                            href="/" 
                            className={`nav-link ${isActiveLink('/')}`}
                            onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}
                        >
                            <span>Início</span>
                        </a>
                        <a 
                            href="/empresas" 
                            className={`nav-link ${isActiveLink('/empresas')}`}
                            onClick={(e) => { e.preventDefault(); handleNavigation('/empresas'); }}
                        >
                            <span>Empresas</span>
                        </a>
                        <a 
                            href="/vagas" 
                            className={`nav-link ${isActiveLink('/vagas')}`}
                            onClick={(e) => { e.preventDefault(); handleNavigation('/vagas'); }}
                        >
                            <span>Vagas</span>
                        </a>
                        <a 
                            href="/artigos" 
                            className={`nav-link ${isActiveLink('/artigos')}`}
                            onClick={(e) => { e.preventDefault(); handleNavigation('/artigos'); }}
                        >
                            <span>Artigos</span>
                        </a>
                        
                        {/* Links adicionais para usuários logados */}
                        {isAuthenticated && (
                            <>
                                <a 
                                    href="/minhasvagas" 
                                    className={`nav-link ${isActiveLink('/minhasvagas')}`}
                                    onClick={(e) => { e.preventDefault(); handleNavigation('/minhasvagas'); }}
                                >
                                    <span>Minhas Vagas</span>
                                </a>
                                {user?.tipo_usuario !== 'empresa' && (
                                    <a 
                                        href="/meucurriculo" 
                                        className={`nav-link ${isActiveLink('/meucurriculo')}`}
                                        onClick={(e) => { e.preventDefault(); handleNavigation('/meucurriculo'); }}
                                    >
                                        <span>Meu Currículo</span>
                                    </a>
                                )}
                                {user?.tipo_usuario === 'empresa' && (
                                    <a 
                                        href="/dashboardempresa" 
                                        className={`nav-link ${isActiveLink('/dashboardempresa')}`}
                                        onClick={(e) => { e.preventDefault(); handleNavigation('/dashboardempresa'); }}
                                    >
                                        <span>Dashboard</span>
                                    </a>
                                )}
                            </>
                        )}
                    </div>

                    <div className='nav-links-group profile'>
                        {isAuthenticated ? (
                            <div className="user-section">
                                <div className="user-welcome-mobile">
                                    <span>Olá, <strong>{user?.nome || user?.nome_completo || 'Usuário'}</strong></span>
                                </div>
                                <UserSelectorCompact />
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <button 
                                    className="login-btn"
                                    onClick={() => handleNavigation('/login')}
                                >
                                    Entrar
                                </button>
                                <button 
                                    className="signup-btn"
                                    onClick={() => handleNavigation('/cadastro')}
                                >
                                    Cadastrar
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Menu Mobile */}
                <button 
                    className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Alternar menu"
                    aria-expanded={isMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Overlay para mobile */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                ></div>
            )}
        </header>
    );
}

export default Header;