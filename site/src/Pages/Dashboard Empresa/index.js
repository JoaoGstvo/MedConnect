import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

function DashboardEmpresaPage() {
    return (
        <main className='dashboard-empresa-page'>
            <Header />

            <section className='section'>
                <div className='title'>
                    <h1>Painel da Empresa</h1>
                    <p>Gerencie suas vagas e acompanhe os candidatos.</p>
                </div>

                <div className='container'>
                    <div className='wrapper'>
                        <div className='card'>
                            <h2>Vagas Ativas</h2>
                            <p>5</p>
                        </div>
                        <div className='card'>
                            <h2>Candidatos Recebidos</h2>
                            <p>32</p>
                        </div>
                        <div className='card'>
                            <h2>Entrevistas Agendadas</h2>
                            <p>4</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default DashboardEmpresaPage;
