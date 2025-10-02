import './index.scss';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NovoArtigoPage() {
    const [titulo, setTitulo] = useState("");
    const [categoria, setCategoria] = useState("Tecnologia Médica");
    const [resumo, setResumo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [imagem, setImagem] = useState("");
    const [mensagem, setMensagem] = useState("");

    const navigate = useNavigate();

    const categorias = ["Tecnologia Médica", "Cuidados com Pacientes", "Inovação", "Telemedicina"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const novoArtigo = { titulo, categoria, resumo, conteudo, imagem };

        try {
            const response = await fetch("http://localhost:5000/api/artigos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoArtigo),
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`/artigos/${data.artigo.id_artigo}`);
            } else {
                setMensagem(data.msg || "Erro ao publicar artigo");
            }
        } catch (error) {
            console.error("Erro no envio:", error);
            setMensagem("Erro de conexão com o servidor");
        }
    };

    return (
        <main className="novo-artigo-page">
            <Header />

            <section className="form-container">
                <h2>Criar Novo Artigo</h2>
                <form onSubmit={handleSubmit}>
                    <label>Título</label>
                    <input 
                        type="text" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        required 
                    />

                    <label>Categoria</label>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        {categorias.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <label>Resumo</label>
                    <textarea 
                        value={resumo} 
                        onChange={(e) => setResumo(e.target.value)} 
                        rows="3"
                        required
                    />

                    <label>Conteúdo</label>
                    <textarea 
                        value={conteudo} 
                        onChange={(e) => setConteudo(e.target.value)} 
                        rows="8"
                        required
                    />

                    <label>Imagem (URL)</label>
                    <input 
                        type="text" 
                        value={imagem} 
                        onChange={(e) => setImagem(e.target.value)} 
                        placeholder="Opcional" 
                    />
                    
                    <button type="submit" className="btn-publicar">Publicar Artigo</button>
                </form>

                {mensagem && <p className="mensagem-feedback">{mensagem}</p>}

                <button type="button" className="btn-back" onClick={() => navigate("/artigos")}>
                    Voltar
                </button>
            </section>

            <Footer />
        </main>
    );
}

export default NovoArtigoPage;
