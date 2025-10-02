import './index.scss';
import Header from "../../../Components/Header/index.js";
import Footer from "../../../Components/Footer/index.js";
import { useState } from "react";

function MinhasVagas() {
    const [vagas, setVagas] = useState([
        {
            id: 1,
            titulo: "Enfermeiro(a) Plantonista - UTI",
            empresa: "Hospital Santa Vida",
            tipo: "Presencial",
            local: "São Paulo - SP",
            etapaAtual: 2,
            totalEtapas: 5,
            status: "active",
            dataInscricao: "2024-01-15",
            etapas: ["Inscrição", "Teste Online", "Entrevista", "Análise Final", "Concluído"]
        },
        {
            id: 2,
            titulo: "Fisioterapeuta Ortopédico Sênior",
            empresa: "Clínica Movimento & Saúde",
            tipo: "Híbrido",
            local: "Rio de Janeiro - RJ",
            etapaAtual: 1,
            totalEtapas: 5,
            status: "pending",
            dataInscricao: "2024-01-10",
            etapas: ["Inscrição", "Teste Online", "Entrevista", "Análise Final", "Concluído"]
        },
        {
            id: 3,
            titulo: "Técnico de Enfermagem - Plantão",
            empresa: "UPA Saúde 24h",
            tipo: "Presencial",
            local: "Belo Horizonte - MG",
            etapaAtual: 0,
            totalEtapas: 5,
            status: "pending",
            dataInscricao: "2024-01-20",
            etapas: ["Inscrição", "Teste Online", "Entrevista", "Análise Final", "Concluído"]
        },
        {
            id: 4,
            titulo: "Médico Cardiologista",
            empresa: "Hospital CardioCenter",
            tipo: "Presencial",
            local: "Curitiba - PR",
            etapaAtual: 4,
            totalEtapas: 5,
            status: "completed",
            dataInscricao: "2023-12-05",
            etapas: ["Inscrição", "Teste Online", "Entrevista", "Análise Final", "Concluído"]
        }
    ]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { text: 'Em Andamento', class: 'active' },
            pending: { text: 'Pendente', class: 'pending' },
            completed: { text: 'Concluído', class: 'completed' }
        };
        return statusConfig[status] || statusConfig.pending;
    };

    const handleAcessarVaga = (vagaId) => {
        console.log(`Acessando vaga ${vagaId}`);
        // Navegar para detalhes da vaga
    };

    const handleCancelarInscricao = (vagaId, vagaTitulo) => {
        if (window.confirm(`Tem certeza que deseja cancelar sua inscrição na vaga "${vagaTitulo}"?`)) {
            setVagas(vagas.filter(vaga => vaga.id !== vagaId));
            console.log(`Inscrição cancelada para vaga ${vagaId}`);
        }
    };

    const hasVagas = vagas.length > 0;

    return (
        <main className="minhasvagas-page">
            <Header />

            <section className="principal-container">
                <div className="title">
                    <h1>Minhas Candidaturas</h1>
                    <p>Acompanhe o andamento de todos os seus processos seletivos em um só lugar.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {hasVagas ? (
                        <div className="wrapper">
                            {vagas.map((vaga) => {
                                const statusInfo = getStatusBadge(vaga.status);
                                return (
                                    <div key={vaga.id} className="vaga-card">
                                        {/* Status Badge */}
                                        <div className={`status-badge ${statusInfo.class}`}>
                                            {statusInfo.text}
                                        </div>

                                        <h2>{vaga.titulo}</h2>
                                        <p className="empresa">{vaga.empresa}</p>
                                        <div className="info">
                                            <span>{vaga.tipo}</span>
                                            <span>{vaga.local}</span>
                                        </div>

                                        {/* Progresso e Etapas */}
                                        <div className="steps">
                                            {vaga.etapas.map((etapa, index) => {
                                                const isActive = index === vaga.etapaAtual;
                                                const isCompleted = index < vaga.etapaAtual;
                                                const stepClass = isCompleted ? 'completed' : isActive ? 'active' : '';

                                                return (
                                                    <div key={index} className={`step ${stepClass}`}>
                                                        <div className="circle">
                                                            {isCompleted ? '' : index + 1}
                                                        </div>
                                                        <span>{etapa}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Ações */}
                                        <div className="acoes">
                                            <button 
                                                className="btn-acessar"
                                                onClick={() => handleAcessarVaga(vaga.id)}
                                            >
                                                 Ver Detalhes
                                            </button>
                                            <button 
                                                className="btn-cancelar"
                                                onClick={() => handleCancelarInscricao(vaga.id, vaga.titulo)}
                                            >
                                                 Cancelar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>Nenhuma candidatura encontrada</h3>
                            <p>
                                Você ainda não se candidatou a nenhuma vaga. 
                                Explore as oportunidades disponíveis e comece sua jornada profissional.
                            </p>
                            <a href="/vagas" className="btn-primary">
                                🔍 Explorar Vagas
                            </a>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default MinhasVagas;