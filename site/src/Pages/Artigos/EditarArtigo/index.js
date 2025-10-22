import './index.scss';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../../../Components/Hooks/useAuth';

function EditarArtigoPage() {
  const [form, setForm] = useState({
    titulo: "",
    id_categoria: "",
    resumo: "",
    conteudo: "",
    imagem: ""
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carregandoArtigo, setCarregandoArtigo] = useState(true);
  const [mensagem, setMensagem] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  // Buscar categorias do backend
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch("http://localhost:5000/api/categorias");
        const data = await res.json();
        if (res.ok) {
          setCategorias(data);
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setMensagem({ type: 'error', text: 'Erro ao carregar categorias' });
      }
    }
    fetchCategorias();
  }, []);

  // Buscar artigo para edição
  useEffect(() => {
    async function fetchArtigo() {
      if (!id) {
        setMensagem({ type: 'error', text: 'ID do artigo não encontrado' });
        setCarregandoArtigo(false);
        return;
      }
      
      try {
        setCarregandoArtigo(true);
        const response = await fetch(`http://localhost:5000/api/artigos/${id}`);
        
        if (!response.ok) {
          throw new Error('Artigo não encontrado');
        }
        
        const artigo = await response.json();
        console.log('Artigo carregado:', artigo);
        
        // Verificar se o usuário é o autor do artigo
        if (user && artigo.id_usuario !== user.id_usuario) {
          setMensagem({ type: 'error', text: 'Você não tem permissão para editar este artigo' });
          setTimeout(() => navigate('/artigos'), 2000);
          return;
        }
        
        // Preencher o formulário com os dados do artigo
        setForm({
          titulo: artigo.titulo || "",
          id_categoria: artigo.id_categoria?.toString() || "",
          resumo: artigo.resumo || "",
          conteudo: artigo.conteudo || "",
          imagem: artigo.imagem || ""
        });
        
      } catch (err) {
        console.error("Erro ao carregar artigo:", err);
        setMensagem({ type: 'error', text: 'Erro ao carregar artigo' });
        setTimeout(() => navigate('/artigos'), 2000);
      } finally {
        setCarregandoArtigo(false);
      }
    }
    
    if (user && id) {
      fetchArtigo();
    }
  }, [id, user, navigate]);

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
    
    if (!user) {
      showMensagem('error', 'Você precisa estar logado para editar um artigo');
      return;
    }

    setLoading(true);

    // Validação mínima
    if (!form.titulo.trim() || !form.conteudo.trim() || !form.id_categoria) {
      showMensagem('error', 'Preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/artigos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (response.ok) {
        showMensagem('success', '🎉 Artigo atualizado com sucesso!');
        setTimeout(() => navigate('/artigos'), 1500);
      } else {
        showMensagem('error', data.error || "❌ Erro ao atualizar artigo");
      }
    } catch (err) {
      console.error(err);
      showMensagem('error', "❌ Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  if (carregandoArtigo) {
    return (
      <main className="criar-artigo-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando artigo...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="criar-artigo-page">
      <Header />

      <section className="hero-section">
        <h1>Editar Artigo</h1>
        <p>Atualize seu artigo e mantenha o conteúdo sempre relevante.</p>
      </section>

      <section className="form-container">
        <h2>Editar Artigo</h2>
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
              ← Cancelar
            </button>
            <button 
              type="submit" 
              className={`btn-publicar ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? ' Atualizando...' : ' Atualizar Artigo'}
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}

export default EditarArtigoPage;