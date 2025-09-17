import "./index.scss";

function CardEmpresa({ hospital }) {
  // Transformar nota (4.5) em estrelas (★)
  const nota = parseFloat(hospital.nota);
  const estrelasCheias = Math.floor(nota);
  const meiaEstrela = nota - estrelasCheias >= 0.5 ? 1 : 0;
  const estrelasVazias = 5 - estrelasCheias - meiaEstrela;

  const estrelas = "★".repeat(estrelasCheias) + (meiaEstrela ? "⯪" : "") + "☆".repeat(estrelasVazias);

  return (
    <article className="empresa-card">
      <img
        className="logo"
        src={hospital.logo}
        alt={`${hospital.nome} logo`}
        onError={(e) => { e.target.onerror = null; e.target.src = "/logos/placeholder.png"; }}
      />

      <div className="empresa-card-info">
        <div className="top">
          <h3>{hospital.nome}</h3>
          <div className="rating">
            <span className="nota">{estrelas}</span>
            <span className="valor">{hospital.nota}</span>
          </div>
        </div>

        <p className="descricao">{hospital.descricao}</p>

        <div className="meta">
          <span>{hospital.localizacao}</span>
          <span>{hospital.vagas} vagas</span>
          <span>{hospital.avaliacoes} avaliações</span>
        </div>
      </div>
    </article>
  );
}

export default CardEmpresa;
