import './index.scss';
import { useEffect } from 'react';

function LandingPage1() {
    useEffect(() => {
        // Adiciona classe de loaded para animações
        document.body.classList.add('loaded');
        
        return () => {
            document.body.classList.remove('loaded');
        };
    }, []);

    return (
        <main className='landingpage'>
            <header className='header'>
                <div className='logo'>
                    <img src="Images/Logo.png" alt="Logo Saúde Connect" className='floating' />
                </div>
                <div className='search-login'>
                    <input 
                        type="text" 
                        placeholder="🔍 Pesquisar vagas..." 
                        aria-label="Pesquisar vagas"
                    />
                    <a href='/login' className='login-link'>
                        <button className='login-btn' aria-label="Fazer login">
                            Entrar
                        </button>
                    </a>
                </div>
            </header>

            <section className='hero'>
                <div className='hero-content'>
                    <h1>
                        Conectando Profissionais da Saúde às <br />
                        Melhores Oportunidades
                    </h1>
                    <p>
                        Nossa plataforma é especializada em aproximar empresas, clínicas e hospitais 
                        de profissionais da área da saúde. Aqui você encontra as vagas, talentos e 
                        empresas que fazem a diferença.
                    </p>
                    <div className='buttons'>
                        <a href="/empresas" aria-label="Ver empresas cadastradas">
                            <button className='secondary'>
                                Ver Empresas
                            </button>
                        </a>
                        <a href="/vagas" aria-label="Explorar vagas disponíveis">
                            <button className='primary'>
                                Ver Vagas
                            </button>
                        </a>
                    </div>
                </div>
            </section>

            <footer>
                <p>&copy; 2024 Saúde Connect. Todos os direitos reservados.</p>
            </footer>
        </main>
    );
}

export default LandingPage1;