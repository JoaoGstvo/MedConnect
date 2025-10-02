import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardArtigo from "../../Components/CardArtigo";
import { useEffect, useState } from "react";

function ArtigosPage() {
    const [artigos, setArtigos] = useState([]);

    useEffect(() => {
        async function carregarArtigos() {
            try {
                const res = await fetch("http://localhost:5000/api/artigos");
                const data = await res.json();
                setArtigos(data);
            } catch (err) {
                console.error("Erro ao carregar artigos:", err);
            }
        }
        carregarArtigos();
    }, []);

    return (
        <main className="artigos-page">
            <Header />

            <section className="artigos-container">
                <h1>Artigos</h1>
                {artigos.length === 0 ? (
                    <p>Nenhum artigo publicado ainda.</p>
                ) : (
                    <div className="artigos-wrapper">
                        {artigos.map((artigo) => (
                            <CardArtigo
                                key={artigo.id_artigo}
                                id={artigo.id_artigo}
                                titulo={artigo.titulo}
                                resumo={artigo.resumo}
                                imagem={artigo.imagem}
                                categoria={artigo.categoria}
                            />
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}

export default ArtigosPage;
