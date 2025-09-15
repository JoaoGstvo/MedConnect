import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

function InscricaoPage() {
    return (
        <main className='inscricaopage'>
            <Header />

            {/* Seção de Introdução */}
            <section className='principal-container'>
                <div className='title'>
                    <h1>Inscreva-se na Vaga</h1>
                    <p>Preencha seus dados abaixo para se candidatar à oportunidade selecionada.</p>
                </div>
            </section>

            {/* Formulário de Inscrição */}
            <section className='section'>
                <form className='form-container'>
                    <div className='form-group'>
                        <label>Nome Completo</label>
                        <input type="text" placeholder="Digite seu nome" required />
                    </div>

                    <div className='form-group'>
                        <label>E-mail</label>
                        <input type="email" placeholder="Digite seu e-mail" required />
                    </div>

                    <div className='form-group'>
                        <label>Telefone</label>
                        <input type="tel" placeholder="(XX) XXXXX-XXXX" required />
                    </div>

                    <div className='form-group'>
                        <label>Currículo (PDF)</label>
                        <input type="file" accept=".pdf" />
                    </div>

                    <div className='form-group'>
                        <label>Mensagem</label>
                        <textarea placeholder="Escreva uma breve mensagem..." rows="4"></textarea>
                    </div>

                    <div className='actions'>
                        <a herf ="/inscricaosucess">
                        <button type="submit" className='btn-submit'>Enviar Inscrição</button>
                        </a>
                        <a href="/">        
                        <button type="button" className='btn-back'>Voltar</button>
                        </a>
                    </div>
                </form>
            </section>

            <Footer />
        </main>
    );
}

export default InscricaoPage;
