import './index.scss';

function Header() {
    return (
        <header className="header-page">
            <div className='navigation-container'>
                {/* Logo */}
                <div className='logo-section'>
                    <a href="/">
                        <img src="/Images/Logo.png" alt="Logo" />
                    </a>
                </div>

                {/* Barra de pesquisa */}
                <div className="search-bar">
                    <input type="text" placeholder="Pesquisar" />
                    <button type="button" className="search-btn">
                        🔍︎
                    </button>
                </div>

                {/* Navegação */}
                <div className='nav-links'>
                    <div className='nav-links-group'>
                        <a href="/" className='nav-link'><span>Inicio</span></a>
                        <a href="/empresas" className='nav-link'><span>Empresas</span></a>
                        <a href="/vagas" className='nav-link'><span>Vagas</span></a>
                        <a href="/artigos" className='nav-link'><span>Artigos</span></a>
                    </div>

                    <div className='nav-links-group profile'>
                        <a href="/perfilprofissional" className='nav-link a-profile'>
                            <span>Perfil</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
