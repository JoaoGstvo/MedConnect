import './index.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";

function DashboardCandidato() {
    const [usuario, setUsuario] = useState({});
    const [inscricoes, setInscricoes] = useState([]);
    const [curriculo, setCurriculo] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    // Dados do usuário demo
    const usuarioId = 1;

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setCarregando(true);
        try {
            // Carregar dados do usuário
            const responseUsuario = await fetch(`http://localhost:5000/api/profissionais/${usuarioId}`);
            if (responseUsuario.ok) {
                const dataUsuario = await responseUsuario.json();
                setUsuario(dataUsuario);
            }

            // Carregar currículo
            const responseCurriculo = await fetch(`http://localhost:5000/api/curriculos/usuario/${usuarioId}`);
            if (responseCurriculo.ok) {
                const dataCurriculo = await responseCurriculo.json();
                setCurriculo(dataCurriculo);
            }

            // Carregar inscrições
            const responseInscricoes = await fetch(`http://localhost:5000/api/inscricoes/usuario/${usuarioId}`);
            if (responseInscricoes.ok) {
                const dataInscricoes = await responseInscricoes.json();
                setInscricoes(dataInscricoes);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setCarregando(false);
        }
    };

    // Estatísticas
    const estatisticas = {
        totalInscricoes: inscricoes.length,
        pendentes: inscricoes.filter(insc => insc.status === 'pendente').length,
        emAnalise: inscricoes.filter(insc => insc.status === 'analise').length,
        aprovadas: inscricoes.filter(insc => insc.status === 'aprovado').length,
        curriculoCompleto: curriculo ? 85 : 0 // Exemplo de progresso
    };

    if (carregando) {
        return (
            <main className="dashboard-candidato">
                <Header />
                <div className="loading">Carregando...</div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="dashboard-candidato">
            <Header />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="welcome-card">
                        <div className="welcome-text">
                            <h1>Olá, {usuario.nome || 'Candidato'}! 👋</h1>
                            <p>Bem-vindo à sua área de candidato. Gerencie seu perfil, currículo e candidaturas.</p>
                        </div>
                        <div className="welcome-actions">
                            <button 
                                className="btn-primary"
                                onClick={() => navigate('/vagas')}
                            >
                                🔍 Buscar Vagas
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cards de Ação Rápida */}
            <section className="quick-actions-section">
                <div className="container">
                    <h2>Ações Rápidas</h2>
                    <div className="actions-grid">
                        <div className="action-card" onClick={() => navigate('/perfil-candidato')}>
                            <div className="action-icon">👤</div>
                            <h3>Meu Perfil</h3>
                            <p>Atualize suas informações pessoais e profissionais</p>
                            <div className="action-badge">Completo</div>
                        </div>

                        <div className="action-card" onClick={() => navigate('/meu-curriculo')}>
                            <div className="action-icon">📝</div>
                            <h3>Meu Currículo</h3>
                            <p>Gerencie e edite seu currículo online</p>
                            <div className="action-badge">{estatisticas.curriculoCompleto}%</div>
                        </div>

                        <div className="action-card" onClick={() => navigate('/minhas-vagas')}>
                            <h3>Minhas Candidaturas</h3>
                            <p>Acompanhe suas inscrições em vagas</p>
                            <div className="action-badge">{estatisticas.totalInscricoes}</div>
                        </div>

                        <div className="action-card" onClick={() => navigate('/vagas')}>
                            <h3>Buscar Vagas</h3>
                            <p>Encontre novas oportunidades</p>
                            <div className="action-badge">Novo</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Estatísticas e Atividade Recente */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {/* Estatísticas */}
                        <div className="stats-card">
                            <h3>📊 Estatísticas</h3>
                            <div className="stats-list">
                                <div className="stat-item">
                                    <span className="stat-number">{estatisticas.totalInscricoes}</span>
                                    <span className="stat-label">Total de Candidaturas</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{estatisticas.pendentes}</span>
                                    <span className="stat-label">Pendentes</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{estatisticas.emAnalise}</span>
                                    <span className="stat-label">Em Análise</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{estatisticas.aprovadas}</span>
                                    <span className="stat-label">Aprovadas</span>
                                </div>
                            </div>
                        </div>

                        {/* Atividade Recente */}
                        <div className="activity-card">
                            <h3>🕒 Atividade Recente</h3>
                            <div className="activity-list">
                                {inscricoes.slice(0, 3).map(inscricao => (
                                    <div key={inscricao.id_candidatura} className="activity-item">
                                        <div className="activity-icon">
                                            {inscricao.status === 'pendente' && ''}
                                            {inscricao.status === 'analise' && ''}
                                            {inscricao.status === 'aprovado' && ''}
                                            {inscricao.status === 'recusado' && ''}
                                        </div>
                                        <div className="activity-content">
                                            <div className="activity-title">{inscricao.vaga_titulo}</div>
                                            <div className="activity-subtitle">{inscricao.empresa_nome}</div>
                                            <div className="activity-date">
                                                {new Date(inscricao.data_candidatura).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                        <div className={`activity-status ${inscricao.status}`}>
                                            {inscricao.status}
                                        </div>
                                    </div>
                                ))}
                                {inscricoes.length === 0 && (
                                    <div className="empty-activity">
                                        <p>Nenhuma atividade recente</p>
                                        <button 
                                            className="btn-outline"
                                            onClick={() => navigate('/vagas')}
                                        >
                                            Buscar Vagas
                                        </button>
                                    </div>
                                )}
                            </div>
                            {inscricoes.length > 3 && (
                                <button 
                                    className="btn-ver-mais"
                                    onClick={() => navigate('/minhas-vagas')}
                                >
                                    Ver todas as candidaturas
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Progresso do Perfil */}
            <section className="progress-section">
                <div className="container">
                    <div className="progress-card">
                        <h3>🎯 Progresso do Seu Perfil</h3>
                        <div className="progress-bars">
                            <div className="progress-item">
                                <div className="progress-info">
                                    <span>Informações Pessoais</span>
                                    <span>100%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{width: '100%'}}></div>
                                </div>
                            </div>
                            <div className="progress-item">
                                <div className="progress-info">
                                    <span>Currículo</span>
                                    <span>{estatisticas.curriculoCompleto}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{width: `${estatisticas.curriculoCompleto}%`}}
                                    ></div>
                                </div>
                            </div>
                            <div className="progress-item">
                                <div className="progress-info">
                                    <span>Experiência Profissional</span>
                                    <span>75%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{width: '75%'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default DashboardCandidato;