import './index.scss';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useState } from "react";

function NovoArtigoPage() {
    const [titulo, setTitulo] = useState("");
    const [categoria, setCategoria] = useState("Tecnologia Médica");
    const [resumo, setResumo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [imagem, setImagem] = useState("");

    const categorias = ["Tecnologia Médica", "Cuidados com Pacientes", "Inovação", "Telemedicina"];

    const handleSubmit = (e) => {
        e.preventDefault();
        const novoArtigo = {
            titulo,
            categoria,
            resumo,
            conteudo,
            imagem
        };
        console.log("Artigo criado:", novoArtigo);

        // 🔗 Futuramente aqui você conecta com API/banco
        // fetch("/api/artigos", { method: "POST", body: JSON.stringify(novoArtigo) })
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
                        placeholder="Digite o título do artigo" 
                        required 
                    />

                    <label>Categoria</label>
                    <select 
                        value={categoria} 
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        {categorias.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <label>Resumo</label>
                    <textarea 
                        value={resumo} 
                        onChange={(e) => setResumo(e.target.value)} 
                        placeholder="Escreva um breve resumo..."
                        rows="3"
                        required
                    />

                    <label>Conteúdo</label>
                    <textarea 
                        value={conteudo} 
                        onChange={(e) => setConteudo(e.target.value)} 
                        placeholder="Escreva o conteúdo completo do artigo..."
                        rows="8"
                        required
                    />

                    <label>Imagem (URL)</label>
                    <input 
                        type="text" 
                        value={imagem} 
                        onChange={(e) => setImagem(e.target.value)} 
                        placeholder="Cole o link da imagem (opcional)" 
                    />
                    
                    <button type="submit" className="btn-publicar">Publicar Artigo</button>
                </form>
                    <a href="/artigos">
                    <button type="back" className='btn-back'>Voltar</button>
                    </a>
            </section>

            <Footer />
        </main>
    );
}

export default NovoArtigoPage;
