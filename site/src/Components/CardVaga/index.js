import "./index.scss";

function CardVaga({ vaga }) {
  if (!vaga) return null;

  // Formatação dos dados de acordo com o backend
  const formatarSalario = (salario) => {
    if (!salario || salario === "A combinar" || salario === "0") return "Salário a combinar";
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

  const getRequisitosArray = (requisitos) => {
    if (!requisitos) return [];
    if (Array.isArray(requisitos)) return requisitos;
    if (typeof requisitos === 'string') {
      return requisitos.split(',').map(req => req.trim()).filter(req => req.length > 0);
    }
    return [];
  };

  const handleInscricao = () => {
    // Redireciona para a página de login
    window.location.href = '/login';
  };

  const handleMaisInformacoes = () => {
    window.location.href = `/vaga/${vaga.id_vaga}`;
  };

  // Verificar se a vaga está aberta
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

        {vaga.requisitos && getRequisitosArray(vaga.requisitos).length > 0 && (
          <div className="requirements-section">
            <h4>Requisitos</h4>
            <div className="requirements-list">
              {getRequisitosArray(vaga.requisitos).slice(0, 5).map((req, i) => (
                <span key={i} className="requirement-tag">
                  {req}
                </span>
              ))}
              {getRequisitosArray(vaga.requisitos).length > 5 && (
                <span className="requirement-tag">
                  +{getRequisitosArray(vaga.requisitos).length - 5}
                </span>
              )}
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
            onClick={handleInscricao}
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
  );
}

export default CardVaga;