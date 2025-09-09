import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardVaga from '../../Components/CardVaga';

function VagasPage() {
    return (
        <main className='vagaspage'>
            <Header />

            <section className='principal-container'>
                <div className='title'>
                    <h1>Encontre a Oportunidade Ideal na Área da Saúde</h1>
                    <p>Busque vagas por especialidade, localidade ou tipo de contrato e distribua melhor os profissionais da saúde.</p>
                </div>
            </section>

            <section className='section'>
                <div className='title'>
                    <h1>Filtros de Busca</h1>
                </div>
                <div className='filters'>
                    <input type="text" placeholder="Pesquisar por cargo ou especialidade" />
                    <input type="text" placeholder="Cidade ou região" />
                    <select>
                        <option value="">Tipo de Contrato</option>
                        <option value="CLT">CLT</option>
                        <option value="PJ">PJ</option>
                        <option value="Estágio">Estágio</option>
                    </select>
                    <button>Buscar</button>
                </div>
            </section>

            <section className='section'>
                <div className='title'>
                    <h1>Vagas Disponíveis</h1>
                </div>
                <div className='container'>
                    <div className='wrapper'>
                        <CardVaga />
                        <CardVaga />
                        <CardVaga />
                        <CardVaga />
                        <CardVaga />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default VagasPage;
