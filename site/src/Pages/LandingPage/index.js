import './index.scss';
import Header from "../../Components/Header/index.js";
import Footer from "../../Components/Footer/index.js";
import CardVaga from '../../Components/CardProfissional/index.js';
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

            {/* <div className='divider'></div> */}
            <CardVaga />
            <CardEmpresa />
            <Footer />
        </main>
    );
}

export default LandingPage;