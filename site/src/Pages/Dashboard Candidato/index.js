import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

function DashboardCandidatoPage() {
    return (
        <main className='dashboard-candidato-page'>
            <Header />

            <section className='section'>
                <div className='title'>
                    <h1>Meu Painel</h1>
                    <p>Resumo das suas candidaturas e recomendações de vagas.</p>
                </div>

                <div className='container'>
                    <div className='wrapper'>
                        <div className='card'>
                            <h2>Vagas Aplicadas</h2>
                            <p>8</p>
                        </div>
                        <div className='card'>
                            <h2>Vagas Salvas</h2>
                            <p>4</p>
                        </div>
                        <div className='card'>
                            <h2>Entrevistas</h2>
                            <p>2</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default DashboardCandidatoPage;
