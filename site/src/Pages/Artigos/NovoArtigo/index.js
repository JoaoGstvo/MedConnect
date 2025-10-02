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
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Buscar categorias do backend
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch("http://localhost:5000/api/categorias");
        const data = await res.json();
        if (res.ok) {
          setCategorias(data);
          if (data.length > 0) {
            setForm(prev => ({ ...prev, categoria: data[0].id_categoria }));
          }
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      }
    }
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (mensagem.text) setMensagem({ type: '', text: '' });
  };

  const showMensagem = (type, text) => {
    setMensagem({ type, text });
    setTimeout(() => setMensagem({ type: '', text: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação mínima
    if (!form.titulo.trim() || !form.conteudo.trim() || !form.categoria) {
      showMensagem('error', 'Preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    const novoArtigo = {
      titulo: form.titulo.trim(),
      id_categoria: form.categoria,
      resumo: form.resumo.trim() || null,
      conteudo: form.conteudo.trim(),
      imagem: form.imagem.trim() || null
    };

    try {
      const response = await fetch("http://localhost:5000/api/artigos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoArtigo)
      });

      const data = await response.json();
      if (response.ok) {
        showMensagem('success', '🎉 Artigo publicado com sucesso!');
        setTimeout(() => navigate(`/artigos/${data.artigo.id_artigo}`), 1500);
      } else {
        showMensagem('error', data.msg || "❌ Erro ao publicar artigo");
      }
    } catch (err) {
      console.error(err);
      showMensagem('error', "❌ Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="form-group">
            <label>Título do Artigo</label>
            <input 
              type="text" name="titulo" value={form.titulo} onChange={handleChange}
              placeholder="Digite um título..." required maxLength={120}
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select name="categoria" value={form.categoria} onChange={handleChange} required>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Resumo</label>
            <textarea name="resumo" value={form.resumo} onChange={handleChange} maxLength={200} />
          </div>

          <div className="form-group">
            <label>Conteúdo</label>
            <textarea name="conteudo" value={form.conteudo} onChange={handleChange} rows={10} required />
          </div>

          <div className="form-group">
            <label>URL da Imagem (Opcional)</label>
            <input type="text" name="imagem" value={form.imagem} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
          </div>

          {mensagem.text && <div className={`mensagem-feedback ${mensagem.type}`}>{mensagem.text}</div>}

          <div className="acoes-form">
            <button type="button" onClick={() => navigate("/artigos")}>Voltar</button>
            <button type="submit" disabled={loading}>{loading ? 'Publicando...' : 'Publicar Artigo'}</button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}

export default NovoArtigoPage;
