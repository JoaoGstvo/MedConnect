import './index.scss';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
function MaisInformacoesPage() {
    return (
        <main className='maisinfopage'>
            <Header />

            {/* Seção de Introdução */}
            <section className='principal-container'>
                <div className='title'>
                    <h1>Mais Informações sobre a Vaga</h1>
                    <p>Aqui você encontra os detalhes completos da oportunidade selecionada.</p>
                </div>
            </section>

            {/* Seção Detalhes */}
            <section className='section'>
                <div className='details-container'>
                    <h2>Cargo: Médico Clínico Geral</h2>
                    <p><strong>Local:</strong> Hospital Central - São Paulo, SP</p>
                    <p><strong>Tipo de Contrato:</strong> CLT</p>
                    <p><strong>Descrição da Vaga:</strong> Atendimento a pacientes em clínica geral, realização de consultas, diagnósticos e encaminhamentos. Trabalho em equipe multidisciplinar.</p>
                    <p><strong>Requisitos:</strong> Graduação em Medicina, registro ativo no CRM, experiência mínima de 2 anos.</p>
                    <p><strong>Benefícios:</strong> Plano de saúde, vale alimentação, auxílio transporte, bonificação por desempenho.</p>
                </div>
                <div className='actions'>
                    <a href='inscricaovaga'>
                    <button className='btn-apply'>Candidatar-se</button>
                    </a>
                    <a href="/">
                    <button className='btn-back'>Voltar</button>
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default MaisInformacoesPage;
