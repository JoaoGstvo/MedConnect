import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardArtigo from "../../Components/CardArtigo";

function ArtigosPage() {
    const categorias = ["Todos", "Tecnologia Médica", "Cuidados com Pacientes", "Inovação", "Telemedicina"];

    return (
        <main className='artigos-page'>
            <Header />

            <div className="layout">
                {/* Coluna esquerda (pode ser perfil, menus, etc.) */}
                <aside className="sidebar-esquerda">
                    <div className="perfil-card">
                        <div className="perfil-avatar">T</div>
                        <h3>Thiago Ferreira</h3>
                        <p>Estudante de TI | Inovação em Saúde</p>
                    </div>

                    <div className="menu-links">
                        <a href="#">Meus Artigos</a>
                        <a href="#">Minhas Conexões</a>
                        <a href="#">Favoritos</a>
                        <a href="/novoartigo"> Crie um Artigo</a>
                    </div>
                </aside>

                {/* Feed principal */}
                <section className="feed">
                    {/* Filtros */}
                    <div className="filtros-feed">
                        {categorias.map((cat, index) => (
                            <button key={index} className="filtro-btn">
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Lista de artigos */}
                    <div className="artigos-grid">
                        <CardArtigo />
                        <CardArtigo />
                        <CardArtigo />
                        <CardArtigo />
                    </div>

                    <div className="load-more">
                        <button>Carregar mais</button>
                    </div>
                </section>

                {/* Coluna direita (sugestões, notícias, etc.) */}
                <aside className="sidebar-direita">
                    <div className="noticias-card">
                        <h4>Últimas Notícias</h4>
                        <ul>
                            <li>⚕️ Avanços em IA para diagnósticos</li>
                            <li>🏥 Novo hospital referência em SP</li>
                            <li>💡 Telemedicina bate recordes</li>
                        </ul>
                    </div>

                    <div className="sugestoes-card">
                        <h4>Sugestões de Conexão</h4>
                        <ul>
                            <li>👩‍⚕️ Dra. Camila Tavares</li>
                            <li>👨‍⚕️ Dr. João Henrique</li>
                            <li>🏢 Hospital Vida Plena</li>
                        </ul>
                    </div>
                </aside>
            </div>

            <Footer />
        </main>
    );
}

export default ArtigosPage;
