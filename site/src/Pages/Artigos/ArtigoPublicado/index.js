import './index.scss';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useNavigate } from "react-router-dom";

function ArtigoPublicadoPage() {
    const navigate = useNavigate();

    return (
        <main className="artigo-publicado-page fade-in">
            <Header />

            <section className="form-container sucesso-container">
                <h2>Artigo Publicado com Sucesso!</h2>
                <p>Seu artigo foi publicado e agora está disponível para leitura.</p>
                
                <button className="btn-publicar" onClick={() => navigate("/artigos")}>
                    Ver Artigos
                </button>
            </section>

            <Footer />
        </main>
    );
}

export default ArtigoPublicadoPage;
