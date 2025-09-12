import "./index.scss";

function CardVaga() {
  return (
    <div className="job-card">
      <div className="job-content">
        <div className="job-header">
          <h3 className="job-title">Médico Cardiologista</h3>

          <p className="company-name">
            <strong>Hospital do Coração</strong>
          </p>
        </div>

        <div className="job-details">
          <div className="detail-item">
            <span className="detail-text">São Paulo, SP</span>
          </div>
          <div className="detail-item">
            <span className="detail-text">40h/semana</span>
          </div>
          <div className="detail-item">
            <span className="detail-text">CLT</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="salary-section">
          <p className="salary-range">
            <strong>R$ 15.000 - R$ 25.000</strong>
          </p>
        </div>

        <div className="job-description">
          <p>
            Procuramos médico cardiologista experiente para integrar nossa
            equipe. Responsável por consultas, procedimentos e cirurgias
            cardiovasculares.
          </p>
        </div>

        <div className="requirements-benefits">
          <div className="requirements-section">
            <h4>Requisitos:</h4>
            <ul>
              <li>CRM ativo</li>
              <li>Residência em Cardiologia</li>
              <li>Mínimo 3 anos de experiência</li>
            </ul>
          </div>

          <div className="benefits-section">
            <h4>Benefícios:</h4>
            <ul>
              <li>Plano de saúde</li>
              <li>Vale refeição</li>
              <li>Participação nos lucros</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="job-footer">
        <div className="job-meta">
          <span className="publish-date">Publicado 2 dias atrás</span>
        </div>

        <div className="job-action">
          <button
            className="apply-button"
            onClick={() => (window.location.href = "/inscricao")}
          >
            Fazer Inscrição
          </button>

          <button
            className="apply-button"
            onClick={() => (window.location.href = "/informacoes")}
          >
            Mais informações
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardVaga;
