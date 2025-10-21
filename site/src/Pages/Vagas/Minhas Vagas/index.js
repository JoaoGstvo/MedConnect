import './index.scss';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useAuth } from '../../../Components/Hooks/useAuth';

function MinhasVagas() {
    const [inscricoes, setInscricoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelando, setCancelando] = useState(null);
    const navigate = useNavigate();
    
    const { user, isAuthenticated, isLoading } = useAuth();

    // Redirecionar se não estiver autenticado
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, isLoading, navigate]);

    // ✅ CORREÇÃO: useCallback para evitar recriação da função
    const fetchMinhasInscricoes = useCallback(async () => {
        if (!user?.id_usuario) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            console.log('📥 Buscando inscrições para usuário:', user.id_usuario);
            
            const response = await fetch(`http://localhost:5000/api/inscricoes/usuario/${user.id_usuario}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Inscrições carregadas:', data.length);
                setInscricoes(data || []);
            } else {
                console.error('❌ Erro ao buscar inscrições');
                setInscricoes([]);
            }
        } catch (error) {
            console.error('💥 Erro ao buscar inscrições:', error);
            setInscricoes([]);
        } finally {
            setLoading(false);
        }
    }, [user?.id_usuario]); // ✅ Dependência apenas do id_usuario

    // ✅ CORREÇÃO: useEffect com dependências específicas
    useEffect(() => {
        if (isAuthenticated && user?.id_usuario) {
            console.log('🎯 Executando busca de inscrições');
            fetchMinhasInscricoes();
        }
    }, [isAuthenticated, user?.id_usuario, fetchMinhasInscricoes]);

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
                // Atualizar estado local
                setInscricoes(prev => 
                    prev.map(insc => 
                        insc.id_candidatura === idCandidatura 
                            ? { ...insc, status: 'cancelado' }
                            : insc
                    )
                );
                alert('✅ Inscrição cancelada com sucesso!');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao cancelar inscrição');
            }
        } catch (error) {
            console.error('💥 Erro ao cancelar inscrição:', error);
            alert(`❌ Erro: ${error.message}`);
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

    const handleAtualizarCurriculo = () => {
        navigate('/meucurriculo');
    };

    const formatarData = (dataString) => {
        if (!dataString) return 'Data não disponível';
        
        try {
            return new Date(dataString).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Data inválida';
        }
    };

    // Filtrar inscrições ativas (não canceladas)
    const inscricoesAtivas = inscricoes.filter(insc => insc.status !== 'cancelado');
    const hasInscricoes = inscricoesAtivas.length > 0;
    const inscricoesCanceladas = inscricoes.filter(insc => insc.status === 'cancelado');

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <main className="minhasvagas-page">
                <Header />
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Verificando autenticação...</p>
                </div>
                <Footer />
            </main>
        );
    }

    // Se não está autenticado (já redireciona pelo useEffect, mas mostra mensagem)
    if (!isAuthenticated) {
        return (
            <main className="minhasvagas-page">
                <Header />
                <div className="auth-required">
                    <div className="empty-icon">🔒</div>
                    <h2>Autenticação Necessária</h2>
                    <p>Você precisa estar logado para acessar suas candidaturas.</p>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Fazer Login
                    </button>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="minhasvagas-page">
            <Header />

            <section className="principal-container">
                <div className="title">
                    <h1>Minhas Candidaturas</h1>
                    <p>Acompanhe o andamento de todos os seus processos seletivos</p>
                    
                    <div className="user-info-badge">
                        👤 Logado como: <strong>{user.nome}</strong> 
                        {user.tipo_usuario && (
                            <span className="user-type"> • {user.tipo_usuario === 'empresa' ? 'Empresa' : 'Profissional'}</span>
                        )}
                    </div>
                    
                    {hasInscricoes && (
                        <div className="stats">
                            <span className="stat-item">
                                📊 {inscricoesAtivas.length} candidatura(s) ativa(s)
                            </span>
                            {inscricoesCanceladas.length > 0 && (
                                <span className="stat-item cancelled">
                                    📋 {inscricoesCanceladas.length} cancelada(s)
                                </span>
                            )}
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
                        <>
                            <div className="inscricoes-grid">
                                {inscricoesAtivas.map((inscricao) => {
                                    const statusInfo = getStatusBadge(inscricao.status);
                                    const progressStep = getProgressStep(inscricao.status);
                                    
                                    return (
                                        <div key={inscricao.id_candidatura} className="vaga-card">
                                            <div className="card-header">
                                                <h2>{inscricao.vaga_titulo || 'Vaga sem título'}</h2>
                                                <div className={`status-badge ${statusInfo.class}`}>
                                                    {statusInfo.text}
                                                </div>
                                            </div>
                                            
                                            <p className="empresa">
                                                <strong>🏢 Empresa:</strong> {inscricao.empresa_nome || 'Não informada'}
                                            </p>
                                            
                                            <div className="info-grid">
                                                <div className="info-item">
                                                    <span className="label">📅 Data da Inscrição:</span>
                                                    <span className="value">
                                                        {formatarData(inscricao.data_candidatura)}
                                                    </span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="label">📍 Local:</span>
                                                    <span className="value">{inscricao.vaga_localizacao || inscricao.localizacao || 'Não informado'}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="label">💼 Modalidade:</span>
                                                    <span className="value">{inscricao.vaga_modalidade || inscricao.modalidade || 'Não informada'}</span>
                                                </div>
                                                {inscricao.vaga_salario && (
                                                    <div className="info-item">
                                                        <span className="label">💰 Salário:</span>
                                                        <span className="value">{inscricao.vaga_salario}</span>
                                                    </div>
                                                )}
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
                                                        {cancelando === inscricao.id_candidatura ? '⏳ Cancelando...' : '❌ Cancelar'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Ações adicionais */}
                            <div className="actions-footer">
                                <button 
                                    className="btn-secondary"
                                    onClick={handleNovaInscricao}
                                >
                                    🔍 Buscar Mais Vagas
                                </button>
                                {user.tipo_usuario !== 'empresa' && (
                                    <button 
                                        className="btn-outline"
                                        onClick={handleAtualizarCurriculo}
                                    >
                                        📄 Atualizar Currículo
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>Nenhuma candidatura encontrada</h3>
                            <p>
                                Você ainda não se candidatou a nenhuma vaga. 
                                Explore as oportunidades disponíveis e comece sua jornada profissional.
                            </p>
                            <div className="empty-actions">
                                <button 
                                    className="btn-primary"
                                    onClick={handleNovaInscricao}
                                >
                                    🔍 Explorar Vagas
                                </button>
                                {user.tipo_usuario !== 'empresa' && (
                                    <button 
                                        className="btn-secondary"
                                        onClick={handleAtualizarCurriculo}
                                    >
                                        📄 Criar Currículo
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Histórico de candidaturas canceladas */}
                    {inscricoesCanceladas.length > 0 && (
                        <div className="historico-section">
                            <h3>📋 Histórico de Candidaturas Canceladas</h3>
                            <div className="inscricoes-grid historico">
                                {inscricoesCanceladas.map(inscricao => (
                                    <div key={inscricao.id_candidatura} className="vaga-card cancelled">
                                        <div className="card-header">
                                            <h2>{inscricao.vaga_titulo || 'Vaga sem título'}</h2>
                                            <div className="status-badge cancelled">
                                                ❌ Cancelada
                                            </div>
                                        </div>
                                        <p className="empresa">
                                            <strong>🏢 Empresa:</strong> {inscricao.empresa_nome || 'Não informada'}
                                        </p>
                                        <div className="info">
                                            <span>📅 Cancelada em: {formatarData(inscricao.data_candidatura)}</span>
                                        </div>
                                    </div>
                                ))}
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