import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import FilterBar from "../../Components/FilterBar";
import JobCard from "../../Components/JobCard";

function DashboardCandidatoPage() {
    const jobs = [
        {
            companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Nestlé.svg",
            title: "Trainee em Tecnologia da Informação",
            subtitle: "Programa Trainee Nestlé 2026",
            type: "Presencial",
            location: "Localidades diversas",
            status: "Em Análise"
        },
        {
            companyLogo: "https://logodownload.org/wp-content/uploads/2014/09/bradesco-logo.png",
            title: "Bradesco Seguros 2025.2",
            subtitle: "Estágio Bradesco Seguros 2025.2",
            type: "Híbrido",
            location: "Localidades diversas",
            status: "Visualizado pela Empresa"
        },
        {
            companyLogo: "https://sodexo.com/logo.png",
            title: "Estágio em Gestão de Projetos Infraestrutura e Segurança da Informação",
            subtitle: "Programa de Estágio Sodexo 2025",
            type: "Híbrido",
            location: "São Paulo",
            status: "Entrevista Agendada"
        },
        {
            companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Nestlé.svg",
            title: "Estágio em Marketing Digital",
            subtitle: "Programa Estágio Nestlé 2025",
            type: "Remoto",
            location: "Localidades diversas",
            status: "Rejeitado"
        }
    ];

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
                    {jobs.map((job, index) => (
                        <JobCard
                            key={index}
                            companyLogo={job.companyLogo}
                            title={job.title}
                            subtitle={job.subtitle}
                            type={job.type}
                            location={job.location}
                            status={job.status}
                        />
                    ))}
                </div>

                <p className="all-loaded">Todas as vagas carregadas</p>
            </section>

            <Footer />
        </main>
    );
}

export default DashboardCandidatoPage;

