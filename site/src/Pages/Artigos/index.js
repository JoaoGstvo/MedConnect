import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardArtigo from "../../Components/CardArtigo";
import { useEffect, useState } from "react";

function ArtigosPage() {
    const [artigos, setArtigos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroAtivo, setFiltroAtivo] = useState('todos');
    const [categorias, setCategorias] = useState([]);

    const filtros = [
        { id: 'todos', label: '📰 Todos os Artigos' },
        { id: 'medicina', label: '👨‍⚕️ Medicina' },
        { id: 'enfermagem', label: '👩‍⚕️ Enfermagem' },
        { id: 'pesquisa', label: '🔬 Pesquisa' }
    ];

    useEffect(() => {
        async function carregarArtigos() {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:5000/api/artigos");
                const data = await res.json();
                setArtigos(data);
                
                // Extrair categorias únicas
                const cats = [...new Set(data.map(artigo => artigo.categoria))];
                setCategorias(cats);
            } catch (err) {
                console.error("Erro ao carregar artigos:", err);
            } finally {
                setLoading(false);
            }
        }
        carregarArtigos();
    }, []);

    const artigosFiltrados = filtroAtivo === 'todos' 
        ? artigos 
        : artigos.filter(artigo => artigo.categoria === filtroAtivo);

    const sugestoesProfissionais = [
        { id: 1, nome: "Dr. Carlos Silva", especialidade: "Cardiologista" },
        { id: 2, nome: "Dra. Ana Costa", especialidade: "Enfermeira Chefe" },
        { id: 3, nome: "Dr. Roberto Lima", especialidade: "Pesquisador" }
    ];

    return (
        <main className="artigos-page">
            <Header />

            {/* Hero Section */}
            <section className="hero-section">
                <h1>Artigos & Conhecimento</h1>
                <p>
                    Descubra os melhores conteúdos da área da saúde, escritos por profissionais 
                    especializados para aprimorar sua carreira e conhecimento.
                </p>
            </section>

            <div className="layout">
                {/* Coluna Esquerda - Perfil e Menu */}
                <aside className="sidebar-esquerda">
                    <div className="perfil-card">
                        <div className="perfil-avatar">JS</div>
                        <h3>João Silva</h3>
                        <p>Médico Cardiologista</p>
                    </div>

                    <nav className="menu-links">
                        <a href="/meus-artigos">Meus Artigos</a>
                        <a href="/novoartigo">Escrever Artigo</a>
                    </nav>
                </aside>

                {/* Feed Principal */}
                <main className="feed">
                    {/* Filtros */}
                    <div className="filtros-feed">
                        {filtros.map(filtro => (
                            <button
                                key={filtro.id}
                                className={`filtro-btn ${filtroAtivo === filtro.id ? 'active' : ''}`}
                                onClick={() => setFiltroAtivo(filtro.id)}
                            >
                                {filtro.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid de Artigos */}
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Carregando artigos...</p>
                        </div>
                    ) : artigosFiltrados.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📚</div>
                            <h3>Nenhum artigo encontrado</h3>
                            <p>
                                {filtroAtivo === 'todos' 
                                    ? 'Ainda não há artigos publicados. Seja o primeiro a compartilhar conhecimento!'
                                    : `Não encontramos artigos na categoria ${filtroAtivo}.`
                                }
                            </p>
                            <a href="/novoartigo" className="btn-primary">
                                ✏️ Escrever Primeiro Artigo
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="artigos-grid">
                                {artigosFiltrados.map((artigo) => (
                                    <CardArtigo
                                        key={artigo.id_artigo}
                                        id={artigo.id_artigo}
                                        titulo={artigo.titulo}
                                        resumo={artigo.resumo}
                                        imagem={artigo.imagem}
                                        categoria={artigo.categoria}
                                        dataPublicacao={artigo.data_publicacao}
                                        autor={artigo.autor}
                                        visualizacoes={artigo.visualizacoes}
                                    />
                                ))}
                            </div>

                            {/* Botão Carregar Mais */}
                            {artigosFiltrados.length >= 6 && (
                                <div className="load-more">
                                    <button>Carregar Mais Artigos</button>
                                </div>
                            )}
                        </>
                    )}
                </main>

                {/* Coluna Direita - Conteúdo Adicional */}
                <aside className="sidebar-direita">
                    <div className="noticias-card">
                        <h4>📰 Notícias da Saúde</h4>
                        <ul>
                            <li>Novas diretrizes para tratamento de COVID-19</li>
                            <li>Avancos na inteligência artificial na medicina</li>
                            <li>Congresso nacional de enfermagem 2024</li>
                            <li>Descobertas recentes em cardiologia</li>
                            <li>Tendências em saúde digital</li>
                        </ul>
                    </div>

                    <div className="sugestoes-card">
                        <h4>👥 Sugestões para Seguir</h4>
                        {sugestoesProfissionais.map(profissional => (
                            <div key={profissional.id} className="sugestao-item">
                                <div className="avatar">
                                    {profissional.nome.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="info">
                                    <div className="nome">{profissional.nome}</div>
                                    <div className="especialidade">{profissional.especialidade}</div>
                                </div>
                                <button className="seguir-btn">Seguir</button>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            <Footer />
        </main>
    );
}

export default ArtigosPage;