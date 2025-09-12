import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

function ContatoPage() {
    return (
        <main className='contato-page'>
            <Header />

            {/* Seção principal */}
            <section className='contato-header'>
                <h1>Fale Conosco</h1>
                <p>Entre em contato com a nossa equipe, teremos prazer em ajudar!</p>
            </section>

            {/* Formulário de contato */}
            <section className='contato-formulario'>
                <form>
                    <div className='form-group'>
                        <label htmlFor='nome'>Nome</label>
                        <input type='text' id='nome' placeholder='Seu nome' />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' id='email' placeholder='Seu email' />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='assunto'>Assunto</label>
                        <input type='text' id='assunto' placeholder='Assunto da mensagem' />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='mensagem'>Mensagem</label>
                        <textarea id='mensagem' rows='5' placeholder='Escreva sua mensagem aqui'></textarea>
                    </div>

                    <button type='submit'>Enviar Mensagem</button>
                </form>
            </section>

            <Footer />
        </main>
    );
}

export default ContatoPage;
