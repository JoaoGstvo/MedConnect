import './index.scss';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <main className="header-page">
            <div className='navigation-container'>
                <div className='logo-section'>
                    <img src="/Images/Logo.png" alt="" />
                </div>

                <div className='nav-links'>
                    <div className='nav-links-group'>
                        <a href="/" className='nav-link'>
                            <span>Inicio</span>
                        </a>
                        <a href="/" className='nav-link'>
                            <span>Empresas</span>
                        </a>
                        <a href="/" className='nav-link'>
                            <span>Vagas</span>
                        </a>
                        <a href="/" className='nav-link'>
                            <span>Artigos</span>
                        </a>
                    </div>

                    <div className='nav-links-group profile'>
                        <link to="/perfilprofissional" className='nav-link a-profile'>
                            <span>Perfil</span>
                        </link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Header;