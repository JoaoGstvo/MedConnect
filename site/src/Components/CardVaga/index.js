import "./index.scss";
import { useNavigate } from "react-router-dom"; // ← Importar useNavigate

function CardVaga({ vaga }) {
  const navigate = useNavigate(); // ← Hook para navegação

  if (!vaga) return null;

  // Formatação dos dados (mantém igual)
  const formatarSalario = (salario) => {
    if (!salario || salario === "0") return "Salário a combinar";
    return `R$ ${parseFloat(salario).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatarModalidade = (modalidade) => {
    const modalidades = {
      'presencial': 'Presencial',
      'remoto': 'Remoto', 
      'hibrido': 'Híbrido'
    };
    return modalidades[modalidade] || modalidade || "Não informado";
  };

  // NOVA FUNÇÃO: Redireciona para página de inscrição
  const handleFazerInscricao = () => {
    navigate(`/inscricaovaga/${vaga.id_vaga}`);
  };

  // Função antiga (pode remover se não for usar mais)
  /*
  const handleInscricao = async () => {
    // ... código antigo ...
  };
  */

  const handleMaisInformacoes = () => {
    // Melhor usar navigate em vez de window.location
    navigate(`/vaga/${vaga.id_vaga}`);
  };

  const isVagaAberta = vaga.status === 'aberta';

  return (
    <div className="job-card">
      <div className="job-content">
        <div className="job-header">
          {vaga.empresa_logo && (
            <img 
              src={vaga.empresa_logo} 
              alt={`Logo ${vaga.empresa_nome}`}
              className="company-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="header-info">
            <h3 className="job-title">{vaga.titulo || "Título não informado"}</h3>
            {vaga.empresa_nome && (
              <p className="company-name">{vaga.empresa_nome}</p>
            )}
          </div>
        </div>

        <div className="job-details">
          <div className="detail-item">
            <span className="detail-text">
              {vaga.localizacao || "Local não informado"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-text">
              {formatarModalidade(vaga.modalidade)}
            </span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="salary-section">
          <p className="salary-range">
            <strong>{formatarSalario(vaga.salario)}</strong>
          </p>
        </div>

        <div className="job-description">
          <p>{vaga.descricao || "Descrição não disponível."}</p>
        </div>

        {vaga.requisitos && (
          <div className="requirements-section">
            <h4>Requisitos</h4>
            <div className="requirements-text">
              {vaga.requisitos}
            </div>
          </div>
        )}
      </div>

      <div className="job-footer">
        <div className="job-meta">
          <span className={`job-status ${!isVagaAberta ? 'closed' : ''}`}>
            {isVagaAberta ? 'Vaga Aberta' : 'Vaga Encerrada'}
          </span>
        </div>

        <div className="job-action">
          <button 
            className="apply-button" 
            onClick={handleFazerInscricao} // ← Agora chama a nova função
            disabled={!isVagaAberta} // ← Remove inscrito e loading do disable
          >
            📝 Fazer Inscrição {/* ← Texto sempre igual */}
          </button>
          <button 
            className="info-button" 
            onClick={handleMaisInformacoes}
          >
            🔍 Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardVaga;