// GerenciamentoCandidatosPage.jsx
import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardCandidato from '../../Components/CardCandidato';

function GerenciamentoCandidatosPage() {
    return (
        <main className='gerenciamento-candidatos-page'>
            <Header />

            {/* Seção principal */}
            <section className='candidatos-header'>
                <h1>Gerenciamento de Candidatos</h1>
                <p>Filtre, visualize e gerencie o status dos candidatos para suas vagas.</p>
            </section>

            {/* Filtros */}
            <section className='candidatos-filtros'>
                <select>
                    <option>Selecionar Vaga</option>
                    <option>Enfermeiro(a)</option>
                    <option>Médico(a)</option>
                    <option>Fisioterapeuta</option>
                </select>

                <select>
                    <option>Status do Candidato</option>
                    <option>Em Análise</option>
                    <option>Selecionado para Entrevista</option>
                    <option>Rejeitado</option>
                </select>
            </section>

            {/* Lista de candidatos */}
            <section className='candidatos-lista'>
                <CardCandidato />
                <CardCandidato />
                <CardCandidato />
            </section>

            <Footer />
        </main>
    );
}

export default GerenciamentoCandidatosPage;
