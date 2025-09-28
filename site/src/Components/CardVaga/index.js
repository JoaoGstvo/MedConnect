import "./index.scss";

function CardVaga({ vaga }) {
  if (!vaga) return null; // evita erro se vaga não estiver definida

  const formatarData = (dataString) => {
    if (!dataString) return "Data não informada";
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="job-card">
      <div className="job-content">
        <div className="job-header">
          <h3 className="job-title">{vaga.titulo}</h3>

          {vaga.empresa && (
            <p className="company-name">
              <strong>{vaga.empresa}</strong>
            </p>
          )}
        </div>

        <div className="job-details">
          <div className="detail-item">
            <span className="detail-text">{vaga.local || "Local não informado"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-text">{vaga.modelo || "Modelo não informado"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-text">{vaga.tipo_contrato}</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="salary-section">
          <p className="salary-range">
            <strong>{vaga.salario ? `R$ ${vaga.salario}` : "Salário a combinar"}</strong>
          </p>
        </div>

        <div className="job-description">
          <p>{vaga.descricao}</p>
        </div>

        {vaga.requisitos && (
          <div className="requirements-benefits">
            <div className="requirements-section">
              <h4>Requisitos:</h4>
              <ul>
                {vaga.requisitos.split(',').map((req, i) => (
                  <li key={i}>{req.trim()}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="job-footer">
        <div className="job-meta">
          <span className="publish-date">
            Publicado em {formatarData(vaga.data_publicacao)}
          </span>
        </div>

        <div className="job-action">
          <button className="apply-button" onClick={() => (window.location.href = "/inscricaovaga")}>
            Fazer Inscrição
          </button>
          <button className="info-button" onClick={() => (window.location.href = "/informacoesvaga")}>
            Mais informações
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardVaga;
