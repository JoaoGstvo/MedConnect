import "./index.scss";

function Footer() {
    return (
        <footer className="footer-page">
            <section className="footer-section">
                <div className="info-column">
                    <img src="/Images/Logo.png" alt="Logo da Plataforma Saúde" className="logo" />
                    <p className="description">
                        A plataforma que conecta profissionais da saúde com as melhores oportunidades do mercado
                    </p>
                </div>

                <div className="link-column">
                    <h2 className="title">Para Profissionais</h2>
                    <ul className="link-list">
                        <li><a href="/">Inicio</a></li>
                        <li><a href="/vagas">Buscar Vagas</a></li>
                        <li><a href="/empresas">Buscar Empresas</a></li>
                        <li><a href="/artigos">Ver Artigos</a></li>
                        
                    </ul>
                </div>

                <div className="link-column">
                    <h2 className="title">Suporte</h2>
                    <ul className="link-list">
                        <li><a href="/">suporte@plataformasaude.com</a></li>
                        <li><a href="/faqsite">Fale Conosco</a></li>
                    </ul>
                </div>
            </section>

            <section className="credits">
                <p>© 2025 Plataforma Saúde. Todos os direitos reservados.</p>
            </section>
        </footer>
    );
}

export default Footer;
