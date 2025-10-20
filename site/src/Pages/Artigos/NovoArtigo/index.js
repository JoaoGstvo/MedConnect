import './index.scss';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NovoArtigoPage() {
  const [form, setForm] = useState({
    titulo: "",
    id_categoria: "",
    resumo: "",
    conteudo: "",
    imagem: "",
    id_usuario: 1 // Temporário - substituir pelo ID do usuário logado
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
            setForm(prev => ({ ...prev, id_categoria: data[0].id_categoria }));
          }
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setMensagem({ type: 'error', text: 'Erro ao carregar categorias' });
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
    if (!form.titulo.trim() || !form.conteudo.trim() || !form.id_categoria) {
      showMensagem('error', 'Preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/artigos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (response.ok) {
        showMensagem('success', '🎉 Artigo publicado com sucesso!');
        setTimeout(() => navigate('/artigos'), 1500);
      } else {
        showMensagem('error', data.error || data.msg || "❌ Erro ao publicar artigo");
      }
    } catch (err) {
      console.error(err);
      showMensagem('error', "❌ Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="criar-artigo-page">
      <Header />

      <section className="hero-section">
        <h1>Compartilhe Seu Conhecimento</h1>
        <p>Escreva um artigo e contribua para a comunidade de profissionais da saúde.</p>
      </section>

      <section className="form-container">
        <h2>Criar Novo Artigo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título do Artigo *</label>
            <input 
              type="text" 
              name="titulo" 
              value={form.titulo} 
              onChange={handleChange}
              placeholder="Digite um título atrativo..." 
              required 
              maxLength={120}
            />
            <div className="contador-caracteres">
              {form.titulo.length}/120 caracteres
            </div>
          </div>

          <div className="form-group">
            <label>Categoria *</label>
            <select name="id_categoria" value={form.id_categoria} onChange={handleChange} required>
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Resumo</label>
            <textarea 
              name="resumo" 
              value={form.resumo} 
              onChange={handleChange} 
              placeholder="Breve descrição do artigo..."
              maxLength={200} 
              rows="3"
            />
            <div className="contador-caracteres">
              {form.resumo.length}/200 caracteres
            </div>
          </div>

          <div className="form-group">
            <label>Conteúdo *</label>
            <textarea 
              name="conteudo" 
              value={form.conteudo} 
              onChange={handleChange} 
              placeholder="Escreva o conteúdo do seu artigo..."
              required 
              rows="12"
              className="conteudo"
            />
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

          {mensagem.text && (
            <div className={`mensagem-feedback ${mensagem.type}`}>
              {mensagem.text}
            </div>
          )}

          <div className="acoes-form">
            <button 
              type="button" 
              className="btn-voltar"
              onClick={() => navigate("/artigos")}
              disabled={loading}
            >
              ← Voltar para Artigos
            </button>
            <button 
              type="submit" 
              className={`btn-publicar ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? ' Publicando...' : ' Publicar Artigo'}
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}

export default NovoArtigoPage;