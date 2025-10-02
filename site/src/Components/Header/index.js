import './index.scss';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

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

    return (
        <header className={`header-page ${isScrolled ? 'scrolled' : ''}`}>
            <div className='navigation-container'>
                {/* Logo */}
                <div className='logo-section'>
                    <a href="/">
                        <img src="/Images/Logo.png" alt="Logo Saúde Connect" />
                    </a>
                </div>

                {/* Barra de pesquisa - Desktop */}
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Pesquisar vagas, empresas..." 
                    />
                    <button type="button" className="search-btn">
                        🔍
                    </button>
                </div>

                {/* Navegação */}
                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <div className='nav-links-group'>
                        <a href="/" className={`nav-link ${isActiveLink('/')}`}>
                            <span>Início</span>
                        </a>
                        <a href="/empresas" className={`nav-link ${isActiveLink('/empresas')}`}>
                            <span>Empresas</span>
                        </a>
                        <a href="/vagas" className={`nav-link ${isActiveLink('/vagas')}`}>
                            <span>Vagas</span>
                        </a>
                        <a href="/artigos" className={`nav-link ${isActiveLink('/artigos')}`}>
                            <span>Artigos</span>
                        </a>
                    </div>

                    <div className='nav-links-group profile'>
                        <a href="/meucurriculo" className={`nav-link ${isActiveLink('/meucurriculo')}`}>
                            <span>Meu Perfil</span>
                        </a>
                    </div>
                </div>

                {/* Menu Mobile */}
                <div 
                    className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            {/* Overlay para mobile */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </header>
    );
}

export default Header;