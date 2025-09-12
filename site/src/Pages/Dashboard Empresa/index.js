import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import StatsWrapper from "../../Components/StatsWrapper";

function DashboardEmpresaPage() {
    return (
        <main className='dashboard-empresa-page'>
            <Header />

            <section className='section'>
                <div className='title'>
                    <h1>Painel da Empresa</h1>
                    <p>Gerencie suas vagas e acompanhe os candidatos em tempo real.</p>
                </div>

                <StatsWrapper />
            </section>

            <Footer />
        </main>
    );
}

export default DashboardEmpresaPage;
