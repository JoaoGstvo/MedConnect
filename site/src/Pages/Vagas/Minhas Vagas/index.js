import './index.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";

function MinhasVagas() {
    const [inscricoes, setInscricoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelando, setCancelando] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMinhasInscricoes();
    }, []);

    const fetchMinhasInscricoes = async () => {
        try {
            // Buscar inscrições do usuário demo (ID 1)
            const response = await fetch('http://localhost:5000/api/inscricoes/usuario/1');
            
            if (response.ok) {
                const data = await response.json();
                setInscricoes(data);
            } else {
                console.error('Erro ao buscar inscrições');
            }
        } catch (error) {
            console.error('Erro ao buscar inscrições:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pendente: { text: 'Pendente', class: 'pending' },
            analise: { text: 'Em Análise', class: 'analyzing' },
            aprovado: { text: 'Aprovado', class: 'approved' },
            recusado: { text: 'Recusado', class: 'rejected' },
            cancelado: { text: 'Cancelado', class: 'cancelled' }
        };
        return statusConfig[status] || statusConfig.pendente;
    };

    const getProgressStep = (status) => {
        const steps = {
            pendente: 1,
            analise: 2,
            aprovado: 3,
            recusado: 3,
            cancelado: 1
        };
        return steps[status] || 1;
    };

    const handleCancelarInscricao = async (idCandidatura, vagaTitulo) => {
        if (!window.confirm(`Tem certeza que deseja cancelar sua inscrição na vaga "${vagaTitulo}"?`)) {
            return;
        }

        setCancelando(idCandidatura);
        
        try {
            const response = await fetch(`http://localhost:5000/api/inscricoes/${idCandidatura}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'cancelado'
                })
            });

            if (response.ok) {
                // Atualiza o status localmente
                setInscricoes(prev => 
                    prev.map(insc => 
                        insc.id_candidatura === idCandidatura 
                            ? { ...insc, status: 'cancelado' }
                            : insc
                    )
                );
                alert('Inscrição cancelada com sucesso!');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao cancelar inscrição');
            }
        } catch (error) {
            console.error('Erro ao cancelar inscrição:', error);
            alert(`Erro: ${error.message}`);
        } finally {
            setCancelando(null);
        }
    };

    const handleVerVaga = (idVaga) => {
        navigate(`/vaga/${idVaga}`);
    };

    const handleNovaInscricao = () => {
        navigate('/vagas');
    };

    const formatarData = (dataString) => {
        return new Date(dataString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filtra apenas inscrições não canceladas para exibição principal
    const inscricoesAtivas = inscricoes.filter(insc => insc.status !== 'cancelado');
    const hasInscricoes = inscricoesAtivas.length > 0;

    return (
        <main className="minhasvagas-page">
            <Header />

            <section className="principal-container">
                <div className="title">
                    <h1>Minhas Candidaturas</h1>
                    <p>Acompanhe o andamento de todos os seus processos seletivos</p>
                    
                    {hasInscricoes && (
                        <div className="stats">
                            <span className="stat-item">
                                {inscricoesAtivas.length} candidatura(s) ativa(s)
                            </span>
                        </div>
                    )}
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Carregando suas candidaturas...</p>
                        </div>
                    ) : hasInscricoes ? (
                        <div className="inscricoes-grid">
                            {inscricoesAtivas.map((inscricao) => {
                                const statusInfo = getStatusBadge(inscricao.status);
                                const progressStep = getProgressStep(inscricao.status);
                                
                                return (
                                    <div key={inscricao.id_candidatura} className="vaga-card">
                                        <div className="card-header">
                                            <h2>{inscricao.vaga_titulo}</h2>
                                            <div className={`status-badge ${statusInfo.class}`}>
                                                {statusInfo.text}
                                            </div>
                                        </div>
                                        
                                        <p className="empresa">
                                            <strong>Empresa:</strong> {inscricao.empresa_nome}
                                        </p>
                                        
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <span className="label">Data da Inscrição:</span>
                                                <span className="value">
                                                    {formatarData(inscricao.data_candidatura)}
                                                </span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Local:</span>
                                                <span className="value">{inscricao.localizacao}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Modalidade:</span>
                                                <span className="value">{inscricao.modalidade}</span>
                                            </div>
                                        </div>

                                        <div className="progress-section">
                                            <div className="progress-bar">
                                                <div 
                                                    className={`progress-fill step-${progressStep}`}
                                                    style={{ width: `${(progressStep / 3) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="progress-labels">
                                                <span className={progressStep >= 1 ? 'active' : ''}>Inscrito</span>
                                                <span className={progressStep >= 2 ? 'active' : ''}>Em Análise</span>
                                                <span className={progressStep >= 3 ? 'active' : ''}>Finalizado</span>
                                            </div>
                                        </div>

                                        <div className="acoes">
                                            <button 
                                                className="btn-acessar"
                                                onClick={() => handleVerVaga(inscricao.id_vaga)}
                                            >
                                                👁️ Ver Vaga
                                            </button>
                                            {inscricao.status === 'pendente' && (
                                                <button 
                                                    className="btn-cancelar"
                                                    onClick={() => handleCancelarInscricao(
                                                        inscricao.id_candidatura, 
                                                        inscricao.vaga_titulo
                                                    )}
                                                    disabled={cancelando === inscricao.id_candidatura}
                                                >
                                                    {cancelando === inscricao.id_candidatura ? 'Cancelando...' : '❌ Cancelar'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>Nenhuma candidatura encontrada</h3>
                            <p>
                                Você ainda não se candidatou a nenhuma vaga. 
                                Explore as oportunidades disponíveis e comece sua jornada profissional.
                            </p>
                            <button 
                                className="btn-primary"
                                onClick={handleNovaInscricao}
                            >
                                🔍 Explorar Vagas
                            </button>
                        </div>
                    )}

                    {/* Seção de histórico de cancelados (opcional) */}
                    {inscricoes.some(insc => insc.status === 'cancelado') && (
                        <div className="historico-section">
                            <h3>Histórico de Candidaturas Canceladas</h3>
                            <div className="inscricoes-grid">
                                {inscricoes
                                    .filter(insc => insc.status === 'cancelado')
                                    .map(inscricao => (
                                        <div key={inscricao.id_candidatura} className="vaga-card cancelled">
                                            <div className="card-header">
                                                <h2>{inscricao.vaga_titulo}</h2>
                                                <div className="status-badge cancelled">
                                                    Cancelada
                                                </div>
                                            </div>
                                            <p className="empresa">{inscricao.empresa_nome}</p>
                                            <div className="info">
                                                <span>Cancelada em: {formatarData(inscricao.data_candidatura)}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default MinhasVagas;