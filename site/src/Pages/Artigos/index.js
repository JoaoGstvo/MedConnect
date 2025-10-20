import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardArtigo from "../../Components/CardArtigo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ArtigosPage() {
    const [artigos, setArtigos] = useState([]);
    const [artigosFiltrados, setArtigosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroAtivo, setFiltroAtivo] = useState('todos');
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Buscar categorias
    useEffect(() => {
        async function carregarCategorias() {
            try {
                const res = await fetch("http://localhost:5000/api/categorias");
                const data = await res.json();
                setCategorias(data);
            } catch (err) {
                console.error("Erro ao carregar categorias:", err);
            }
        }
        carregarCategorias();
    }, []);

    // Buscar artigos
    useEffect(() => {
        async function carregarArtigos() {
            try {
                setLoading(true);
                const url = filtroAtivo === 'todos'
                    ? "http://localhost:5000/api/artigos"
                    : `http://localhost:5000/api/artigos?categoria=${filtroAtivo}`;

                const res = await fetch(url);
                const data = await res.json();
                setArtigos(data);
                setArtigosFiltrados(data);
            } catch (err) {
                console.error("Erro ao carregar artigos:", err);
            } finally {
                setLoading(false);
            }
        }
        carregarArtigos();
    }, [filtroAtivo]);

    // Filtro por busca
    useEffect(() => {
        let resultado = [...artigos];
        if (searchTerm) {
            resultado = resultado.filter(artigo =>
                artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                artigo.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                artigo.autor.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        resultado.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));
        setArtigosFiltrados(resultado);
    }, [artigos, searchTerm]);

    return (
        <main className="artigos-page linkedin-style">
            <Header />

            {/* Hero Section Simplificada */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1>Artigos da Comunidade de Saúde</h1>
                        <p>Compartilhe conhecimentos e insights com profissionais da saúde</p>
                        <button 
                            className="btn-criar-artigo"
                            onClick={() => navigate('/novoartigo')}
                        >
                             Escrever Artigo
                        </button>
                    </div>
                </div>
            </section>

            <div className="container main-container">
                <div className="layout">
                    {/* Sidebar Esquerda Simplificada */}
                    <aside className="sidebar-left">
                        <div className="profile-card">
                            <div className="profile-content">
                                <div className="avatar">JS</div>
                                <h3>João Silva</h3>
                                <p>Médico Cardiologista</p>
                                <div className="profile-stats">
                                    <div className="stat">
                                        <span className="number">245</span>
                                        <span className="label">Seguidores</span>
                                    </div>
                                    <div className="stat">
                                        <span className="number">1.2k</span>
                                        <span className="label">Visualizações</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="menu-card">
                            <nav className="sidebar-menu">
                                <a href="/artigos" className="menu-item active">
                                    <span className="icon">📰</span>
                                    Feed de Artigos
                                </a>
                                <a href="/vagas" className="menu-item">
                                    <span className="icon">💼</span>
                                    Vagas
                                </a>
                            </nav>
                        </div>
                    </aside>

                    {/* Conteúdo Principal */}
                    <main className="main-content">
                        {/* Barra de Busca e Filtros */}
                        <div className="tools-bar">
                            <div className="search-container">
                                <div className="search-box">
                                    <span className="search-icon">🔍</span>
                                    <input 
                                        type="text"
                                        placeholder="Pesquisar artigos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>

                            <div className="filters-container">
                                <select 
                                    value={filtroAtivo} 
                                    onChange={(e) => setFiltroAtivo(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="todos">Todos os Artigos</option>
                                    {categorias.map(categoria => (
                                        <option key={categoria.id_categoria} value={categoria.nome}>
                                            {categoria.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="stats-bar">
                            <span className="stats-text">
                                {artigosFiltrados.length} de {artigos.length} artigos
                            </span>
                            {searchTerm && (
                                <button 
                                    className="clear-search"
                                    onClick={() => setSearchTerm('')}
                                >
                                    Limpar pesquisa
                                </button>
                            )}
                        </div>

                        {/* Feed de Artigos */}
                        <div className="articles-feed">
                            {loading ? (
                                <div className="loading-state">
                                    <div className="loading-spinner"></div>
                                    <p>Carregando artigos...</p>
                                </div>
                            ) : artigosFiltrados.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📝</div>
                                    <h3>Nenhum artigo encontrado</h3>
                                    <p>
                                        {searchTerm 
                                            ? `Não encontramos resultados para "${searchTerm}"`
                                            : 'Ainda não há artigos publicados'
                                        }
                                    </p>
                                    <button 
                                        className="btn-primary"
                                        onClick={() => navigate('/novoartigo')}
                                    >
                                        Escrever primeiro artigo
                                    </button>
                                </div>
                            ) : (
                                artigosFiltrados.map((artigo) => (
                                    <CardArtigo
                                        key={artigo.id}
                                        id={artigo.id}
                                        titulo={artigo.titulo}
                                        resumo={artigo.resumo}
                                        imagem={artigo.imagem}
                                        categoria={artigo.categoria}
                                        dataPublicacao={artigo.data_publicacao}
                                        autor={artigo.autor}
                                        visualizacoes={artigo.visualizacoes || Math.floor(Math.random() * 1000)}
                                        comentarios={artigo.comentarios || Math.floor(Math.random() * 50)}
                                        reacoes={artigo.reacoes || Math.floor(Math.random() * 200)}
                                    />
                                ))
                            )}
                        </div>
                    </main>

                    {/* Sidebar Direita Simplificada */}
                    <aside className="sidebar-right">
                        <div className="suggestions-card">
                            <div className="card-header">
                                <h4>Profissionais para seguir</h4>
                            </div>
                            <div className="suggestions-list">
                                <div className="suggestion-item">
                                    <div className="suggestion-avatar">MS</div>
                                    <div className="suggestion-info">
                                        <div className="suggestion-name">Dra. Maria Santos</div>
                                        <div className="suggestion-role">Enfermeira Chefe</div>
                                    </div>
                                    <button className="follow-btn">Seguir</button>
                                </div>
                                <div className="suggestion-item">
                                    <div className="suggestion-avatar">RL</div>
                                    <div className="suggestion-info">
                                        <div className="suggestion-name">Dr. Roberto Lima</div>
                                        <div className="suggestion-role">Pesquisador</div>
                                    </div>
                                    <button className="follow-btn">Seguir</button>
                                </div>
                            </div>
                        </div>

                        <div className="trending-card">
                            <div className="card-header">
                                <h4>Tendências</h4>
                            </div>
                            <div className="trending-list">
                                <div className="trending-item">
                                    <div className="trending-tag">#SaúdeDigital</div>
                                    <div className="trending-count">2.5K posts</div>
                                </div>
                                <div className="trending-item">
                                    <div className="trending-tag">#Telemedicina</div>
                                    <div className="trending-count">1.8K posts</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </main>
    );
}

export default ArtigosPage;