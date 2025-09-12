import './index.scss';
import Header from "../../Components/Header/index.js";
import Footer from "../../Components/Footer/index.js";
import CardVaga from '../../Components/CardVaga/index.js';
import CardEmpresa from '../../Components/CardEmpresa/index.js';
import CardProfissional from '../../Components/CardProfissional/index.js';

function LandingPage() {
    return (
        <main className='landingpage'>
            <Header />

            {/* Hero Section */}
            <section className='principal-container'>
                <div className='title'>
                    <h1>Conectando Profissionais da Saúde às Melhores Oportunidades</h1>
                    <p>
                        Nossa plataforma é especializada em aproximar empresas, clínicas e hospitais
                        de profissionais da área da saúde. Aqui você encontra as vagas, talentos e
                        empresas que fazem a diferença.
                    </p>
                </div>
                <div className='buttons'>
                    <a href="/empresas">
                        <button>Ver Empresas</button>
                    </a>
                    <a href="/vagas">
                        <button>Ver Vagas</button>
                    </a>
                </div>
            </section>

            {/* Vagas em Destaque */}
            <section className='section'>
                <div className='title'>
                    <h1>Vagas em Destaque</h1>
                </div>
                <div className='container'>
                    <div className='wrapper'>
                        <CardVaga />
                        <CardVaga />
                        <CardVaga />
                    </div>
                </div>
            </section>

            {/* Empresas em Destaque */}
            <section className='section'>
                <div className='title'>
                    <h1>Empresas em Destaque</h1>
                </div>
                <div className='container'>
                    <div className='wrapper'>
                        <CardEmpresa />
                        
                        
                    </div>
                </div>
            </section>

            {/* Profissionais em Destaque */}
            <section className='section'>
                <div className='title'>
                    <h1>Profissionais em Destaque</h1>
                </div>
                <div className='container'>
                    <div className='wrapper'>
                        <CardProfissional />
                        <CardProfissional />
                        <CardProfissional />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default LandingPage;
