import './index.scss';
import Header from "../../Components/Header/index.js";
import Footer from "../../Components/Footer/index.js";
import CardVaga from '../../Components/CardVaga/index.js';
import CardEmpresa from '../../Components/CardEmpresa/index.js';

function LandingPage() {
    return (
        <main className='landingpage'>
            <Header />

            <section className='principal-container'>
                <div className='title'>
                    <h1>Conectando Profissionais da Saúde com as Melhores Oportunidades</h1>
                    <p>A plataforma especializada em conexões entre empresas e Profissionais da área da Saúde.</p>
                </div>
                <div className='buttons'>
                    <a href="/">
                        <button>Ver Empresas</button>
                    </a>
                    <a href="/">
                        <button>Ver Profissionais</button>
                    </a>
                </div>
            </section>

            <section className='jobs-section'>
                <div className='title'>
                    <h1>Vagas em Destaque</h1>
                </div>
                <div className='cards-container'>
                    <div className='cards-wrapper'>
                        <CardVaga />
                        <CardVaga />
                        <CardVaga />
                        <CardVaga />
                        <CardVaga />
                        <CardVaga />
                    </div>
                </div>
            </section>

            <section className='companies-section'>
                <div className='title'>
                    <h1>Empresas em Destaque</h1>
                </div>
                <div className='companies-container'>
                    <div className='companies-wrapper'>
                        <CardEmpresa />
                        <CardEmpresa />
                        <CardEmpresa />
                        <CardEmpresa />
                        <CardEmpresa />
                        <CardEmpresa />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default LandingPage;