import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import FilterBar from "../../Components/FilterBar";
import JobCard from "../../Components/JobCard";

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
                    <JobCard
                        companyLogo="https://upload.wikimedia.org/wikipedia/commons/7/7d/Nestlé.svg"
                        title="Trainee em Tecnologia da Informação"
                        subtitle="Programa Trainee Nestlé 2026"
                        type="Presencial"
                        location="Localidades diversas"
                        progress=""
                    />
                    <JobCard
                        companyLogo="https://logodownload.org/wp-content/uploads/2014/09/bradesco-logo.png"
                        title="Bradesco Seguros 2025.2"
                        subtitle="Estágio Bradesco Seguros 2025.2"
                        type="Híbrido"
                        location="Localidades diversas"
                        progress=""
                    />
                    <JobCard
                        companyLogo="https://sodexo.com/logo.png"
                        title="Estágio em Gestão de Projetos Infraestrutura e Segurança da Informação"
                        subtitle="Programa de Estágio Sodexo 2025"
                        type="Híbrido"
                        location="São Paulo"
                        progress=""
                    />
                </div>

                <p className="all-loaded">Todas as vagas carregadas</p>
            </section>

            <Footer />
        </main>
    );
}

export default DashboardCandidatoPage;
