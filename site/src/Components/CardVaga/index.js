// Components/CardVaga/index.js - VERSÃO CORRIGIDA
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './index.scss';

function CardVaga({ vaga }) {
    const navigate = useNavigate();
    const { isAuthenticated, isEmpresa, user } = useAuth();
    const [jaInscrito, setJaInscrito] = useState(false);
    const [statusInscricao, setStatusInscricao] = useState(null);

    // Verificar se usuário já está inscrito na vaga e pegar status
    useEffect(() => {
        if (!user?.id_usuario || isEmpresa()) return;

        const verificarInscricao = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/inscricoes/usuario/${user.id_usuario}`);
                if (response.ok) {
                    const inscricoes = await response.json();
                    const inscricaoExistente = inscricoes.find(inscricao => 
                        inscricao.id_vaga === vaga.id_vaga
                    );
                    
                    if (inscricaoExistente) {
                        setJaInscrito(true);
                        setStatusInscricao(inscricaoExistente.status);
                        
                        // Se o status for cancelado, permite reinscrição
                        if (inscricaoExistente.status === 'cancelado') {
                            setJaInscrito(false);
                        }
                    } else {
                        setJaInscrito(false);
                        setStatusInscricao(null);
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar inscrições:', error);
            }
        };

        verificarInscricao();
    }, [user, vaga.id_vaga, isEmpresa]);

    const handleCandidatar = () => {
        // BLOQUEAR se for empresa
        if (isEmpresa()) {
            toast.error('Empresas não podem se candidatar a vagas.');
            return;
        }

        // NÃO BLOQUEAR se o status for cancelado - permite reinscrição
        if (jaInscrito && statusInscricao !== 'cancelado') {
            toast.info('Você já está inscrito nesta vaga!');
            return;
        }

        if (!isAuthenticated) {
            toast.warning('Você precisa estar logado para se candidatar a vagas.');
            navigate('/login');
            return;
        }
        
        navigate(`/inscricaovaga/${vaga.id_vaga}`);
    };

    // Verificar se deve bloquear o botão
    // NÃO bloqueia se o status for cancelado
    const shouldBlockButton = isEmpresa() || 
                             vaga.status !== 'aberta' || 
                             (jaInscrito && statusInscricao !== 'cancelado');

    const getButtonText = () => {
        if (jaInscrito && statusInscricao !== 'cancelado') return ' Inscrito';
        if (statusInscricao === 'cancelado') return 'Candidatar-se Novamente';
        if (isEmpresa()) return 'Apenas Profissionais';
        if (vaga.status !== 'aberta') return 'Vaga Fechada';
        return 'Candidatar-se';
    };

    const getStatusBadge = () => {
        if (statusInscricao === 'cancelado') {
            return statusInscricao === 'cancelado';
        }

        return null;
    };

    return (
        <div className="job-card">
            <div className="job-header">
                <img 
                    src={vaga.empresa_logo || '/images/company-placeholder.png'} 
                    alt={vaga.empresa_nome} 
                    className="company-logo"
                    onError={(e) => {
                        e.target.src = '/images/company-placeholder.png';
                    }}
                />
                <div className="header-info">
                    <h3 className="job-title">{vaga.titulo}</h3>
                    <p className="company-name">{vaga.empresa_nome}</p>
                    <div className="job-meta">
                        <span className="meta-tag">
                            <span className="meta-text">{vaga.localizacao}</span>
                        </span>
                        <span className="meta-tag">
                            <span className="meta-text">{vaga.modalidade}</span>
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="job-content">
                <div className="salary-section">
                    <span className="salary-range">R$ {vaga.salario || 'Salário a combinar'}</span>
                </div>
                <div className="job-description">
                    <p>{vaga.descricao?.substring(0, 150)}...</p>
                </div>
            </div>
            
            <div className="job-footer">
                <div className="job-status">
                    {vaga.status === 'aberta' ? ' Aberta' : ' Fechada'}
                    {getStatusBadge()}
                </div>
                
                <div className="job-action">
                    <button 
                        onClick={handleCandidatar}
                        disabled={shouldBlockButton}
                        className={`apply-button ${jaInscrito && statusInscricao !== 'cancelado' ? 'inscrito' : ''}`}
                        title={
                            isEmpresa() ? "Empresas não podem se candidatar" : 
                            (jaInscrito && statusInscricao !== 'cancelado') ? "Você já está inscrito" : 
                            ""
                        }
                    >
                        {getButtonText()}
                    </button>
                    
                    <button 
                        onClick={() => navigate(`/vaga/${vaga.id_vaga}`)}
                        className="info-button"
                    >
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CardVaga;