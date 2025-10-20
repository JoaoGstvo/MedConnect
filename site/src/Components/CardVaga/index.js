import "./index.scss";
import { useNavigate } from "react-router-dom";

function CardVaga({ vaga }) {
  const navigate = useNavigate();

  if (!vaga) return null;

  // Formatação dos dados
  const formatarSalario = (salario) => {
    if (!salario || salario === "0") return "Salário a combinar";
    return `R$ ${parseFloat(salario).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatarModalidade = (modalidade) => {
    const modalidades = {
      'presencial': ' Presencial',
      'remoto': ' Remoto', 
      'hibrido': ' Híbrido'
    };
    return modalidades[modalidade] || modalidade || "📍 Não informado";
  };

  const getLocationIcon = (localizacao) => {
    if (!localizacao) return "📍";
    if (localizacao.toLowerCase().includes('sp') || localizacao.toLowerCase().includes('são paulo')) return "🏙️";
    if (localizacao.toLowerCase().includes('rj') || localizacao.toLowerCase().includes('rio')) return "";
    return "📍";
  };

  // Funções de navegação
  const handleFazerInscricao = () => {
    navigate(`/inscricaovaga/${vaga.id_vaga}`);
  };

  const handleMaisInformacoes = () => {
    navigate(`/vaga/${vaga.id_vaga}`);
  };

  const isVagaAberta = vaga.status === 'aberta';
  
  // Determinar se é vaga destacada ou urgente
  const isFeatured = vaga.destaque === true || vaga.prioridade === 'alta';
  const isUrgent = vaga.urgente === true || vaga.prioridade === 'urgente';

  return (
    <div className={`job-card ${isFeatured ? 'featured' : ''} ${isUrgent ? 'urgent' : ''}`}>
      {/* Cabeçalho do Card */}
      <div className="card-header">
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
              <p className="company-name">
                🏭 {vaga.empresa_nome}
              </p>
            )}
            <div className="job-meta">
              <div className="meta-tag">
                <span className="meta-text">
                  {getLocationIcon(vaga.localizacao)} {vaga.localizacao || "Local não informado"}
                </span>
              </div>
              <div className="meta-tag">
                <span className="meta-text">
                  {formatarModalidade(vaga.modalidade)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="card-content">
        <div className="job-content">
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
              <h4> Requisitos</h4>
              <div className="requirements-text">
                {vaga.requisitos}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rodapé do Card */}
      <div className="card-footer">
        <div className="job-footer">
          <span className={`job-status ${!isVagaAberta ? 'closed' : ''}`}>
            {isVagaAberta ? ' Vaga Aberta' : '❌ Vaga Encerrada'}
          </span>

          <div className="job-action">
            <button 
              className="apply-button" 
              onClick={handleFazerInscricao}
              disabled={!isVagaAberta}
            >
               Fazer Inscrição
            </button>
            <button 
              className="info-button" 
              onClick={handleMaisInformacoes}
            >
               Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardVaga;