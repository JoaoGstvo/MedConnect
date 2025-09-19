import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import FilterBar from "../../Components/FilterBar";
import CardVaga from "../../Components/CardVaga"; // ✅ importa seu card

function DashboardCandidatoPage() {
    return (
        <main className="dashboard-candidato-page">
            <Header />

            <section className="section">
                <div className="tabs">
                    <button className="tab active">Minhas vagas</button>
                    <button className="tab">Para você</button>
                </div>

                <FilterBar />

                <div className="jobs-container">
                    {/* ✅ agora renderiza diretamente seu card de vaga */}
                    <CardVaga />
                    <CardVaga />
                    <CardVaga />
                </div>

                <p className="all-loaded">Todas as vagas carregadas</p>
            </section>

            <Footer />
        </main>
    );
}

export default DashboardCandidatoPage;


