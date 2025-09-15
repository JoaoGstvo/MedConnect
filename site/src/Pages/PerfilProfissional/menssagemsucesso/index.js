import './index.scss';
import Header from "../../../Components/Header/index.js";
import Footer from "../../../Components/Footer/index.js";

function MensagemSucessoPage() {
    return (
        <main className='mensagemsucessopage'>
            <Header />

            {/* Hero Section */}
            <section className='principal-container'>
                <div className='title'>
                    <h1>Mensagem Enviada com Sucesso!</h1>
                    <p>
                        Sua mensagem foi enviada ao profissional da saúde. Ele(a) entrará em contato com você em breve.
                    </p>
                    <a href="/empresas">
                        <button>Voltar para empresas</button>
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default MensagemSucessoPage;

