import './index.scss';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NovoArtigoPage() {
    const [form, setForm] = useState({
        titulo: "",
        categoria: "",
        resumo: "",
        conteudo: "",
        imagem: ""
    });
    const [categorias, setCategorias] = useState([]); // puxar do backend
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // 🔥 Buscar categorias do backend
    useEffect(() => {
        async function fetchCategorias() {
            try {
                const res = await fetch("http://localhost:5000/api/categorias");
                const data = await res.json();

                if (res.ok) {
                    setCategorias(data);
                    // já setar a primeira como default
                    if (data.length > 0) {
                        setForm(prev => ({ ...prev, categoria: data[0].id_categoria }));
                    }
                } else {
                    console.error("Erro ao carregar categorias:", data.msg);
                }
            } catch (err) {
                console.error("Erro de conexão:", err);
            }
        }

        fetchCategorias();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        if (mensagem.text) {
            setMensagem({ type: '', text: '' });
        }
    };

    const showMensagem = (type, text) => {
        setMensagem({ type, text });
        setTimeout(() => setMensagem({ type: '', text: '' }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.titulo.trim() || !form.resumo.trim() || !form.conteudo.trim() || !form.categoria) {
            showMensagem('error', 'Preencha todos os campos obrigatórios.');
            setLoading(false);
            return;
        }

        if (form.resumo.length > 200) {
            showMensagem('error', 'O resumo deve ter no máximo 200 caracteres.');
            setLoading(false);
            return;
        }

        const novoArtigo = { 
            titulo: form.titulo.trim(),
            id_categoria: form.categoria, // agora manda o ID da categoria
            resumo: form.resumo.trim(),
            conteudo: form.conteudo.trim(),
            imagem: form.imagem.trim() || null
        };

        try {
            const response = await fetch("http://localhost:5000/api/artigos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoArtigo),
            });

            const data = await response.json();

            if (response.ok) {
                showMensagem('success', '🎉 Artigo publicado com sucesso!');
                setTimeout(() => {
                    navigate(`/artigos/${data.artigo.id_artigo}`);
                }, 1500);
            } else {
                showMensagem('error', data.msg || "❌ Erro ao publicar artigo");
            }
        } catch (error) {
            console.error("Erro no envio:", error);
            showMensagem('error', "❌ Erro de conexão com o servidor");
        } finally {
            setLoading(false);
        }
    };

    const contadorResumo = form.resumo.length;
    const contadorConteudo = form.conteudo.length;

    return (
        <main className="novo-artigo-page">
            <Header />

            <section className="hero-section">
                <h1>Compartilhe Seu Conhecimento</h1>
                <p>Escreva um artigo e contribua para a comunidade de profissionais da saúde.</p>
            </section>

            <section className="form-container">
                <h2>Criar Novo Artigo</h2>
                
                <form onSubmit={handleSubmit}>
                    {/* Título */}
                    <div className="form-group">
                        <label>Título do Artigo</label>
                        <input 
                            type="text" 
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Digite um título atraente..."
                            required 
                            maxLength={120}
                        />
                        <div className="contador-caracteres">
                            {form.titulo.length}/120 caracteres
                        </div>
                    </div>

                    {/* Categoria e Imagem */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Categoria</label>
                            <select 
                                name="categoria"
                                value={form.categoria}
                                onChange={handleChange}
                                required
                            >
                                {categorias.length > 0 ? (
                                    categorias.map((cat) => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>
                                            {cat.nome}
                                        </option>
                                    ))
                                ) : (
                                    <option>Carregando categorias...</option>
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>URL da Imagem (Opcional)</label>
                            <input 
                                type="text" 
                                name="imagem"
                                value={form.imagem}
                                onChange={handleChange}
                                placeholder="https://exemplo.com/imagem.jpg" 
                            />
                        </div>
                    </div>

                    {/* Resumo */}
                    <div className="form-group">
                        <label>Resumo</label>
                        <textarea 
                            name="resumo"
                            value={form.resumo}
                            onChange={handleChange}
                            rows="3"
                            required
                            maxLength={200}
                        />
                        <div className={`contador-caracteres ${contadorResumo > 180 ? 'limite' : ''}`}>
                            {contadorResumo}/200 caracteres
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="form-group">
                        <label>Conteúdo do Artigo</label>
                        <textarea 
                            name="conteudo"
                            value={form.conteudo}
                            onChange={handleChange}
                            className="conteudo"
                            required
                            minLength={300}
                        />
                        <div className="contador-caracteres">
                            {contadorConteudo} caracteres {contadorConteudo < 300 && `(mínimo 300)`}
                        </div>
                    </div>

                    {mensagem.text && (
                        <div className={`mensagem-feedback ${mensagem.type}`}>
                            {mensagem.text}
                        </div>
                    )}

                    <div className="acoes-form">
                        <button 
                            type="button" 
                            className="btn-back"
                            onClick={() => navigate("/artigos")}
                            disabled={loading}
                        >
                            Voltar
                        </button>
                        <button 
                            type="submit" 
                            className={`btn-publicar ${loading ? 'loading' : ''}`}
                            disabled={loading || contadorConteudo < 300}
                        >
                            {loading ? 'Publicando...' : 'Publicar Artigo'}
                        </button>
                    </div>
                </form>
            </section>

            <Footer />
        </main>
    );
}

export default NovoArtigoPage;
