import './index.scss';
import Header from "../../../../Components/Header";
import Footer from "../../../../Components/Footer";

function InscricaoSucessoPage() {
    return (
        <main className='inscricaosucessopage'>
            <Header />

            {/* Seção de Sucesso */}
            <section className='principal-container'>
                <div className='icon-success'>
                    <svg viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" />
                        <path fill="none" d="M14 27l7 7 16-16" />
                    </svg>
                </div>

                <div className='title'>
                    <h1>Inscrição Enviada!</h1>
                    <p>Sua candidatura foi recebida com sucesso. Em breve, nossa equipe entrará em contato.</p>
                </div>

                <div className='actions'>
                    <a href="/">
                        <button className='btn-back'>Voltar à Home</button>
                    </a>
                    <a href="/vagas">
                        <button className='btn-back-outline'>Ver Outras Vagas</button>
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default InscricaoSucessoPage;
