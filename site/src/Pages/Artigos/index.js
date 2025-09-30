import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ArtigoPage() {
    const { id } = useParams();
    const [artigo, setArtigo] = useState(null);

    useEffect(() => {
        async function carregarArtigo() {
            try {
                const res = await fetch(`http://localhost:5000/api/artigos/${id}`);
                const data = await res.json();
                setArtigo(data);
            } catch (err) {
                console.error("Erro ao carregar artigo:", err);
            }
        }
        carregarArtigo();
    }, [id]);

    if (!artigo) return <p>Carregando artigo...</p>;

    return (
        <main className="artigo-page">
            <Header />

            <article className="artigo-detalhe">
                {artigo.imagem && <img src={artigo.imagem} alt={artigo.titulo} className="artigo-img" />}
                <h1>{artigo.titulo}</h1>
                <p className="artigo-categoria">📂 {artigo.categoria}</p>
                <p className="artigo-resumo"><strong>Resumo:</strong> {artigo.resumo}</p>
                <div className="artigo-conteudo">
                    {artigo.conteudo}
                </div>
                <p className="artigo-data">Publicado em {new Date(artigo.data_publicacao).toLocaleDateString()}</p>
            </article>

            <Footer />
        </main>
    );
}

export default ArtigoPage;
