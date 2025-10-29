// Components/CardVaga/index.js - VERSÃO FINAL COM BLOQUEIO PARA EMPRESAS
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import './index.scss';

function CardVaga({ vaga }) {
    const navigate = useNavigate();
    const { isAuthenticated, isEmpresa } = useAuth();

    const handleCandidatar = () => {
        // BLOQUEAR se for empresa
        if (isEmpresa()) {
            alert('Empresas não podem se candidatar a vagas.');
            return;
        }

        if (!isAuthenticated) {
            alert('Você precisa estar logado para se candidatar a vagas.');
            navigate('/login');
            return;
        }
        navigate(`/inscricaovaga/${vaga.id_vaga}`);
    };

    // ADICIONAR: Verificar se deve bloquear o botão
    const shouldBlockButton = isEmpresa() || vaga.status !== 'aberta';

    return (
        <div className="job-card">
            <div className="job-header">
                <img 
                    src={vaga.empresa_logo || '/Images/company-placeholder.png'} 
                    alt={vaga.empresa_nome} 
                    className="company-logo"
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
                    <span className="salary-range">{vaga.salario || 'Salário a combinar'}</span>
                </div>
                <div className="job-description">
                    <p>{vaga.descricao?.substring(0, 150)}...</p>
                </div>
            </div>
            
            <div className="job-footer">
                <div className="job-status">
                    {vaga.status === 'aberta' ? '🟢 Aberta' : '🔴 Fechada'}
                </div>
                
                <div className="job-action">
                    <button 
                        onClick={handleCandidatar}
                        disabled={shouldBlockButton}
                        className="apply-button"
                        title={isEmpresa() ? "Empresas não podem se candidatar" : ""}
                    >
                        {shouldBlockButton 
                            ? (isEmpresa() ? "Apenas Profissionais" : "Vaga Fechada")
                            : 'Candidatar-se'
                        }
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