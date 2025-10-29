import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardArtigo from "../../Components/CardArtigo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../Components/Hooks/useAuth';
import {toast} from 'react-toastify';

function ArtigosPage() {
    const [artigos, setArtigos] = useState([]);
    const [artigosFiltrados, setArtigosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroAtivo, setFiltroAtivo] = useState('todos');
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('todos');
    const [artigoSelecionado, setArtigoSelecionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

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
                const response = await fetch("http://localhost:5000/api/artigos");
                
                if (!response.ok) {
                    throw new Error('Erro ao carregar artigos');
                }
                
                const data = await response.json();
                setArtigos(data);
                setArtigosFiltrados(data);
            } catch (err) {
                console.error("Erro ao carregar artigos:", err);
            } finally {
                setLoading(false);
            }
        }
        carregarArtigos();
    }, []);

    // Filtro por busca, categoria e aba
    useEffect(() => {
        let resultado = [...artigos];
        
        if (abaAtiva === 'meus' && user) {
            resultado = resultado.filter(artigo => artigo.id_usuario === user.id_usuario);
        }
        
        if (searchTerm) {
            resultado = resultado.filter(artigo =>
                artigo.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                artigo.resumo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                artigo.autor?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filtroAtivo !== 'todos') {
            resultado = resultado.filter(artigo => 
                artigo.categoria === filtroAtivo
            );
        }

        resultado.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));
        setArtigosFiltrados(resultado);
    }, [artigos, searchTerm, filtroAtivo, abaAtiva, user]);

    // Função para visualizar artigo
    const handleVisualizarArtigo = (artigo) => {
        setArtigoSelecionado(artigo);
        setShowModal(true);
        document.body.style.overflow = 'hidden'; // Impede scroll da página principal
    };

    // Função para fechar modal
    const handleFecharModal = () => {
        setShowModal(false);
        setArtigoSelecionado(null);
        document.body.style.overflow = 'auto'; // Restaura scroll
    };

    // Função para navegar entre artigos
    const handleArtigoAnterior = () => {
        const indexAtual = artigosFiltrados.findIndex(a => a.id === artigoSelecionado.id);
        const indexAnterior = indexAtual > 0 ? indexAtual - 1 : artigosFiltrados.length - 1;
        setArtigoSelecionado(artigosFiltrados[indexAnterior]);
    };

    const handleProximoArtigo = () => {
        const indexAtual = artigosFiltrados.findIndex(a => a.id === artigoSelecionado.id);
        const indexProximo = indexAtual < artigosFiltrados.length - 1 ? indexAtual + 1 : 0;
        setArtigoSelecionado(artigosFiltrados[indexProximo]);
    };

    // Fechar modal com ESC
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.keyCode === 27 && showModal) {
                handleFecharModal();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showModal]);

    // Função para editar artigo
    const handleEditarArtigo = (artigoId) => {
        navigate(`/editar-artigo/${artigoId}`);
    };

    // Função para excluir artigo
    const handleExcluirArtigo = async (artigoId) => {
        if (!window.confirm('Tem certeza que deseja excluir este artigo?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/artigos/${artigoId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setArtigos(prev => prev.filter(a => a.id !== artigoId));
                if (artigoSelecionado?.id === artigoId) {
                    handleFecharModal();
                }
                toast.success('Artigo excluído com sucesso!');
            } else {
                toast.error('Erro ao excluir artigo');
            }
        } catch (error) {
            console.error('Erro ao excluir artigo:', error);
            toast.error('Erro ao excluir artigo');
        }
    };

    // Contar meus artigos
    const meusArtigosCount = user ? artigos.filter(a => a.id_usuario === user.id_usuario).length : 0;

    return (
        <main className="artigos-page linkedin-style">
            <Header />

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
                    {/* Sidebar Esquerda */}
                    <aside className="sidebar-left">
                        <div className="profile-card">
                            <div className="profile-content">
                                <div className="avatar">
                                    {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <h3>{user?.nome || 'Usuário'}</h3>
                                <p>Profissional de Saúde</p>
                                <div className="profile-stats">
                                    <div className="stat">
                                        <span className="stat-number">
                                            {meusArtigosCount}
                                        </span>
                                        <span className="stat-label">Meus Artigos</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-number">
                                            {artigos.length}
                                        </span>
                                        <span className="stat-label">Total Artigos</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="menu-card">
                            <nav className="sidebar-menu">
                                <a href="/artigos" className="menu-item active">
                                    Feed de Artigos
                                </a>
                                <a href="/vagas" className="menu-item">
                                    Vagas
                                </a>
                                <a href="/meucurriculo" className="menu-item">
                                    Meu Currículo
                                </a>
                            </nav>
                        </div>
                    </aside>

                    {/* Conteúdo Principal */}
                    <main className="main-content">
                        {/* Abas e Filtros */}
                        <div className="tools-bar">
                            <div className="abas-container">
                                <button 
                                    className={`aba ${abaAtiva === 'todos' ? 'active' : ''}`}
                                    onClick={() => setAbaAtiva('todos')}
                                >
                                    Todos os Artigos
                                </button>
                                {user && (
                                    <button 
                                        className={`aba ${abaAtiva === 'meus' ? 'active' : ''}`}
                                        onClick={() => setAbaAtiva('meus')}
                                    >
                                        Meus Artigos ({meusArtigosCount})
                                    </button>
                                )}
                            </div>

                            <div className="search-container">
                                <div className="search-box">
                                    <span className="search-icon"></span>
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
                                    <option value="todos">Todas Categorias</option>
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
                                {artigosFiltrados.length} {abaAtiva === 'meus' ? 'dos meus' : ''} artigos
                                {filtroAtivo !== 'todos' && ` em ${filtroAtivo}`}
                            </span>
                            {(searchTerm || filtroAtivo !== 'todos') && (
                                <button
                                    className="clear-search"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFiltroAtivo('todos');
                                    }}
                                >
                                    Limpar filtros
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
                                    <h3>Nenhum artigo encontrado</h3>
                                    <p>
                                        {searchTerm || filtroAtivo !== 'todos'
                                            ? `Não encontramos resultados para os filtros aplicados`
                                            : abaAtiva === 'meus' 
                                                ? 'Você ainda não publicou nenhum artigo'
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
                                        isMeuArtigo={user && artigo.id_usuario === user.id_usuario}
                                        onVisualizar={() => handleVisualizarArtigo(artigo)}
                                        onEditar={handleEditarArtigo}
                                        onExcluir={handleExcluirArtigo}
                                    />
                                ))
                            )}
                        </div>
                    </main>

                    {/* Sidebar Direita */}
                    <aside className="sidebar-right">
                        <div className="trending-card">
                            <div className="card-header">
                                <h4>Categorias Populares</h4>
                            </div>
                            <div className="trending-list">
                                {categorias.slice(0, 5).map((categoria) => {
                                    const count = artigos.filter(a => a.categoria === categoria.nome).length;
                                    return (
                                        <div key={categoria.id_categoria} className="trending-item">
                                            <div className="trending-tag">#{categoria.nome}</div>
                                            <div className="trending-count">
                                                {count} artigo{count !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Modal de Visualização do Artigo */}
            {showModal && artigoSelecionado && (
                <div className="modal-overlay" onClick={handleFecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-info">
                                <span className="categoria">{artigoSelecionado.categoria}</span>
                                <span className="data">
                                    {new Date(artigoSelecionado.data_publicacao).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <button className="btn-fechar" onClick={handleFecharModal}>×</button>
                        </div>

                        <div className="modal-body">
                            {artigoSelecionado.imagem && (
                                <div className="modal-imagem">
                                    <img src={artigoSelecionado.imagem} alt={artigoSelecionado.titulo} />
                                </div>
                            )}
                            
                            <h1 className="modal-titulo">{artigoSelecionado.titulo}</h1>
                            
                            <div className="modal-autor">
                                <span>Por {artigoSelecionado.autor}</span>
                            </div>

                            {artigoSelecionado.resumo && (
                                <div className="modal-resumo">
                                    <p>{artigoSelecionado.resumo}</p>
                                </div>
                            )}

                            <div className="modal-conteudo">
                                <p>{artigoSelecionado.conteudo}</p>
                            </div>

                            <div className="modal-interacoes">
                                <span className="interacao"> {artigoSelecionado.reacoes || 0}</span>
                                <span className="interacao"> {artigoSelecionado.comentarios || 0}</span>
                                <span className="interacao"> {artigoSelecionado.visualizacoes || 0}</span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="modal-acoes">
                                {user && artigoSelecionado.id_usuario === user.id_usuario && (
                                    <>
                                        <button 
                                            className="btn-editar"
                                            onClick={() => handleEditarArtigo(artigoSelecionado.id)}
                                        >
                                             Editar Artigo
                                        </button>
                                        <button 
                                            className="btn-excluir"
                                            onClick={() => handleExcluirArtigo(artigoSelecionado.id)}
                                        >
                                             Excluir Artigo
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            <div className="modal-navegacao">
                                <button className="btn-navegacao" onClick={handleArtigoAnterior}>
                                    ← Anterior
                                </button>
                                <span className="contador-artigos">
                                    {artigosFiltrados.findIndex(a => a.id === artigoSelecionado.id) + 1} de {artigosFiltrados.length}
                                </span>
                                <button className="btn-navegacao" onClick={handleProximoArtigo}>
                                    Próximo →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}

export default ArtigosPage;