import './index.scss';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useNavigate } from "react-router-dom";

function ArtigoPublicadoPage() {
    const navigate = useNavigate();

    return (
        <main className="artigo-publicado-page fade-in">
            <Header />

            <section className="sucesso-container">
                <div className="sucesso-content">
                    <div className="sucesso-icon">
                        <svg viewBox="0 0 52 52">
                            <path 
                                className="checkmark" 
                                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                            />
                        </svg>
                    </div>
                    
                    <h2>Artigo Publicado com Sucesso</h2>
                    <p>
                        Seu artigo foi publicado e agora está disponível para toda a comunidade de profissionais da saúde. 
                        Compartilhe conhecimento e inspire outros profissionais.
                    </p>
                    
                    <button className="btn-publicar" onClick={() => navigate("/artigos")}>
                        Ver Todos os Artigos
                    </button>

                    <div className="sucesso-details">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <svg viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1110 3.6a6.4 6.4 0 010 12.8z"/>
                                    <path d="M13.2 8.8l-3.6 3.6-1.6-1.6"/>
                                </svg>
                            </div>
                            <span>Artigo disponível publicamente</span>
                        </div>
                        <div className="detail-item">
                            <div className="detail-icon">
                                <svg viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1110 3.6a6.4 6.4 0 010 12.8z"/>
                                    <path d="M13.2 8.8l-3.6 3.6-1.6-1.6"/>
                                </svg>
                            </div>
                            <span>Compartilhe com outros profissionais</span>
                        </div>
                        <div className="detail-item">
                            <div className="detail-icon">
                                <svg viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1110 3.6a6.4 6.4 0 010 12.8z"/>
                                    <path d="M13.2 8.8l-3.6 3.6-1.6-1.6"/>
                                </svg>
                            </div>
                            <span>Receba feedback da comunidade</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default ArtigoPublicadoPage;