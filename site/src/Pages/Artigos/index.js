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
    const [curriculo, setCurriculo] = useState(null);
    const [loadingCurriculo, setLoadingCurriculo] = useState(true);
    const navigate = useNavigate();

    // Buscar currículo do usuário
    useEffect(() => {
        async function carregarCurriculo() {
            try {
                const usuarioId = 1; // Você pode ajustar para pegar do contexto de autenticação
                const response = await fetch(`http://localhost:5000/api/curriculos/usuario/${usuarioId}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setCurriculo(data);
                }
            } catch (error) {
                console.error("Erro ao carregar currículo:", error);
            } finally {
                setLoadingCurriculo(false);
            }
        }
        carregarCurriculo();
    }, []);

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

    // Função para gerar iniciais do nome
    const gerarIniciais = (nome) => {
        if (!nome) return 'US';
        return nome
            .split(' ')
            .map(palavra => palavra[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Função para extrair profissão/cargo do objetivo ou resumo
    const obterProfissao = () => {
        if (!curriculo) return 'Profissional de Saúde';
        
        if (curriculo.objetivo) {
            // Tenta extrair cargo do objetivo
            const objetivo = curriculo.objetivo.toLowerCase();
            if (objetivo.includes('médico') || objetivo.includes('medico')) return 'Médico';
            if (objetivo.includes('enfermeiro')) return 'Enfermeiro';
            if (objetivo.includes('nutricionista')) return 'Nutricionista';
            if (objetivo.includes('fisioterapeuta')) return 'Fisioterapeuta';
            if (objetivo.includes('dentista')) return 'Dentista';
            if (objetivo.includes('psicólogo') || objetivo.includes('psicologo')) return 'Psicólogo';
            if (objetivo.includes('farmacêutico') || objetivo.includes('farmaceutico')) return 'Farmacêutico';
        }
        
        if (curriculo.resumo) {
            const resumo = curriculo.resumo.toLowerCase();
            if (resumo.includes('médico') || resumo.includes('medico')) return 'Médico';
            if (resumo.includes('enfermeiro')) return 'Enfermeiro';
            if (resumo.includes('nutricionista')) return 'Nutricionista';
            if (resumo.includes('fisioterapeuta')) return 'Fisioterapeuta';
        }
        
        return 'Profissional de Saúde';
    };

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
                    {/* Sidebar Esquerda com dados do currículo */}
                    <aside className="sidebar-left">
                        <div className="profile-card">
                            <div className="profile-content">
                                {loadingCurriculo ? (
                                    <div className="loading-curriculo">
                                        <div className="avatar-skeleton"></div>
                                        <div className="info-skeleton">
                                            <div className="skeleton-line nome"></div>
                                            <div className="skeleton-line profissao"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="avatar">
                                            {gerarIniciais(curriculo?.nome_completo)}
                                        </div>
                                        <h3>{curriculo?.nome_completo || 'Usuário'}</h3>
                                        <p>{obterProfissao()}</p>
                                        <div className="profile-stats">
                                            <div className="stat">
                                                <span className="stat-number">
                                                    {artigos.filter(a => a.autor === curriculo?.nome_completo).length}
                                                </span>
                                                <span className="stat-label">Artigos</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="menu-card">
                            <nav className="sidebar-menu">
                                <a href="/artigos" className="menu-item active">
                                    <span className="icon"></span>
                                    Feed de Artigos
                                </a>
                                <a href="/vagas" className="menu-item">
                                    <span className="icon"></span>
                                    Vagas
                                </a>
                                <a href="/meucurriculo" className="menu-item">
                                    <span className="icon"></span>
                                    Meu Currículo
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
                                    <div className="empty-icon"></div>
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
                        <div className="trending-card">
                            <div className="card-header">
                                <h4>Categorias</h4>
                            </div>
                            <div className="trending-list">
                                {categorias.length === 0 ? (
                                    <p>Carregando categorias...</p>
                                ) : (
                                    categorias.map((categoria) => (
                                        <div key={categoria.id_categoria} className="trending-item">
                                            <div className="trending-tag">{categoria.nome}</div>
                                            <div className="trending-count">{categoria.quantidade || 1}</div>
                                        </div>
                                    ))
                                )}
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