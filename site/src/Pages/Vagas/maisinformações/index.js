// Pages/Vagas/maisinformações/index.js - PERMITE REINSCRIÇÃO SE CANCELADO
import './index.scss';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useAuth } from '../../../Components/Hooks/useAuth';

function MaisInformacoesPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isEmpresa, user, isAuthenticated } = useAuth();
    const [vaga, setVaga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jaInscrito, setJaInscrito] = useState(false);
    const [statusInscricao, setStatusInscricao] = useState(null);
    const [inscricaoId, setInscricaoId] = useState(null);

    // Verificar se usuário já está inscrito na vaga e pegar status
    useEffect(() => {
        const verificarInscricaoExistente = async () => {
            if (!user?.id_usuario || isEmpresa()) return;

            try {
                const response = await fetch(`http://localhost:5000/api/inscricoes/usuario/${user.id_usuario}`);
                if (response.ok) {
                    const inscricoes = await response.json();
                    const inscricaoExistente = inscricoes.find(inscricao => 
                        inscricao.id_vaga === parseInt(id)
                    );
                    
                    if (inscricaoExistente) {
                        setJaInscrito(true);
                        setStatusInscricao(inscricaoExistente.status);
                        setInscricaoId(inscricaoExistente.id_candidatura);
                        
                        // Se o status for cancelado, permite reinscrição
                        if (inscricaoExistente.status === 'cancelado') {
                            setJaInscrito(false);
                        }
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar inscrições:', error);
            }
        };

        const fetchVaga = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/vagas/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setVaga(data);
                }

                // Verificar se já está inscrito e pegar status
                await verificarInscricaoExistente();

            } catch (error) {
                console.error('Erro ao buscar vaga:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVaga();
    }, [id, user, isEmpresa]);

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
            recusado: 3, // Finalizado
            cancelado: 3  // Finalizado (cancelado também é um estado final)
        };
        return steps[status] || 1;
    };

    const handleCandidatar = () => {
        // BLOQUEAR se for empresa
        if (isEmpresa()) {
            alert('Empresas não podem se candidatar a vagas.');
            return;
        }

        // NÃO BLOQUEAR se o status for cancelado - permite reinscrição
        if (jaInscrito && statusInscricao !== 'cancelado') {
            alert('Você já está inscrito nesta vaga!');
            return;
        }

        if (!isAuthenticated) {
            alert('Você precisa estar logado para se candidatar a vagas.');
            navigate('/login');
            return;
        }

        navigate(`/inscricaovaga/${id}`);
    };

    const handleVoltar = () => {
        navigate('/vagas');
    };

    // Verificar se deve bloquear o botão
    // NÃO bloqueia se o status for cancelado
    const shouldBlockButton = isEmpresa() || 
                             vaga?.status !== 'aberta' || 
                             (jaInscrito && statusInscricao !== 'cancelado');

    const getButtonText = () => {
        if (jaInscrito && statusInscricao !== 'cancelado') return 'Já Inscrito';
        if (statusInscricao === 'cancelado') return 'Candidatar-se Novamente';
        if (isEmpresa()) return 'Apenas Profissionais';
        if (vaga?.status !== 'aberta') return 'Vaga Fechada';
        return 'Candidatar-se';
    };

    if (loading) return <div className="loading-page">Carregando...</div>;
    if (!vaga) return <div className="error-page">Vaga não encontrada</div>;

    return (
        <main className='maisinfopage'>
            <Header />

            <section className='principal-container'>
                <div className='title'>
                    <h1>Detalhes da Vaga</h1>
                    <p>Confira todas as informações desta oportunidade</p>
                </div>
            </section>

            <section className='section'>
                <div className='details-container'>
                    <h2>{vaga.titulo}</h2>
                    <div className='vaga-info'>
                        <p><strong>Empresa:</strong> {vaga.empresa_nome}</p>
                        <p><strong>Descrição:</strong> {vaga.descricao}</p>
                        <p><strong>Requisitos:</strong> {vaga.requisitos || "Não informados"}</p>
                        <p><strong>Modalidade:</strong> {vaga.modalidade || "Não informada"}</p>
                        <p><strong>Salário:</strong> {vaga.salario ? `R$ ${parseFloat(vaga.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "A combinar"}</p>
                        <p><strong>Localização:</strong> {vaga.localizacao || "Não informado"}</p>
                        <p><strong>Status da Vaga:</strong> <span className={`status ${vaga.status}`}>{vaga.status === 'aberta' ? '🟢 Aberta' : '🔴 Fechada'}</span></p>
                        
                        {/* Status da Inscrição - Mostra mesmo se cancelado */}
                        {(jaInscrito || statusInscricao === 'cancelado') && statusInscricao && (
                            <div className="status-inscricao-section">
                                <div className="status-header">
                                    <strong>
                                        {statusInscricao === 'cancelado' 
                                            ? 'Status da candidatura anterior:' 
                                            : 'Status da sua candidatura:'
                                        }
                                    </strong>
                                    <div className={`status-badge ${getStatusBadge(statusInscricao).class}`}>
                                        {getStatusBadge(statusInscricao).text}
                                    </div>
                                </div>
                                
                                {/* Mostra barra de progresso mesmo para cancelado */}
                                <div className="progress-section">
                                    <div className="progress-bar">
                                        <div
                                            className={`progress-fill step-${getProgressStep(statusInscricao)}`}
                                            style={{ width: `${(getProgressStep(statusInscricao) / 3) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="progress-labels">
                                        <span className={getProgressStep(statusInscricao) >= 1 ? 'active' : ''}>Inscrito</span>
                                        <span className={getProgressStep(statusInscricao) >= 2 ? 'active' : ''}>Em Análise</span>
                                        <span className={getProgressStep(statusInscricao) >= 3 ? 'active' : ''}>Finalizado</span>
                                    </div>
                                </div>

                                {/* Mensagem especial para candidatura cancelada */}
                                {statusInscricao === 'cancelado' && (
                                    <div className="cancelado-message">
                                        <p>Sua candidatura anterior foi cancelada. Você pode se candidatar novamente!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className='actions'>
                    <button 
                        className='btn-apply' 
                        onClick={handleCandidatar}
                        disabled={shouldBlockButton}
                        title={
                            isEmpresa() ? "Empresas não podem se candidatar" : 
                            (jaInscrito && statusInscricao !== 'cancelado') ? "Você já está inscrito" : 
                            ""
                        }
                    >
                        {getButtonText()}
                    </button>
                    <button className='btn-back' onClick={handleVoltar}>
                        Voltar para Vagas
                    </button>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default MaisInformacoesPage;