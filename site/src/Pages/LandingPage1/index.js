import './index.scss';


function LandingPage1() {
    return (
        <main className='landingpage'>
            <header className='header'>
                <div className='logo'>
                    <img src="Images/Logo.png" alt="Logo" />
                </div>
                <div className='search-login'>
                    <input type="text" placeholder="Pesquisar vagas..." />
                    <a href='/login'>
                    <button className='login-btn'>Entrar</button>
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
                        Nossa plataforma é especializada em aproximar empresas, clínicas e hospitais de profissionais da área da saúde. Aqui você encontra as vagas, talentos e empresas que fazem a diferença.
                    </p>
                    <div className='buttons'>
                        <a href="/empresas">
                            <button className='secondary'>Ver Empresas</button>
                        </a>
                        <a href="/vagas">
                            <button className='primary'>Ver Vagas</button>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default LandingPage1;

