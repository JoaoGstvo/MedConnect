import './index.scss';
import Header from "../../../Components/Header/index.js";
import Footer from "../../../Components/Footer/index.js";

function MinhasVagas() {
    // Exemplo de vagas mockadas
    const vagas = [
        {
            id: 1,
            titulo: "Enfermeiro(a) Plantonista",
            empresa: "Hospital Santa Vida",
            tipo: "Presencial",
            local: "São Paulo - SP",
            etapaAtual: 2, // 0=Inscrição, 1=Teste, 2=Entrevista, 3=Análise, 4=Concluído
            etapas: ["Inscrição", "Teste Online", "Entrevista", "Análise Final", "Concluído"]
        },
        {
            id: 2,
            titulo: "Fisioterapeuta Ortopédico",
            empresa: "Clínica Movimento",
            tipo: "Híbrido",
            local: "Rio de Janeiro - RJ",
            etapaAtual: 1,
            etapas: ["Inscrição", "Teste Online", "Entrevista", "Análise Final", "Concluído"]
        },
        {
            id: 3,
            titulo: "Técnico de Enfermagem",
            empresa: "UPA Saúde 24h",
            tipo: "Presencial",
            local: "Belo Horizonte - MG",
            etapaAtual: 0,
            etapas: ["Inscrição", "Teste Online", "Entrevista", "Análise Final", "Concluído"]
        }
    ];

    return (
        <main className="minhasvagas-page">
            <Header />

            <section className="principal-container">
                <div className="title">
                    <h1>Minhas Vagas</h1>
                    <p>Acompanhe aqui cada etapa dos seus processos seletivos.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="wrapper">
                        {vagas.map((vaga) => (
                            <div key={vaga.id} className="vaga-card">
                                <h2>{vaga.titulo}</h2>
                                <p className="empresa">{vaga.empresa}</p>
                                <p className="info">
                                    <span>{vaga.tipo}</span> • <span>{vaga.local}</span>
                                </p>

                                {/* Etapas (steps) */}
                                <div className="steps">
                                    {vaga.etapas.map((etapa, index) => (
                                        <div
                                            key={index}
                                            className={`step ${index <= vaga.etapaAtual ? "active" : ""}`}
                                        >
                                            <div className="circle">{index + 1}</div>
                                            <span>{etapa}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="acoes">
                                    <button className="btn-acessar">Acessar vaga</button>
                                    <button className="btn-cancelar">Cancelar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default MinhasVagas;

