// Components/CardEmpresa/index.js - Versão atualizada
import "./index.scss";

function CardEmpresa({ hospital }) {
  // Garantir compatibilidade com dados do backend
  const empresa = {
    id: hospital.id_empresa || hospital.id,
    nome: hospital.nome,
    logo: hospital.logo,
    nota: hospital.nota,
    vagas: hospital.vagas,
    avaliacoes: hospital.avaliacoes,
    descricao: hospital.descricao,
    localizacao: hospital.localizacao
  };

  // Transformar nota em estrelas
  const nota = parseFloat(empresa.nota) || 0;
  const estrelasCheias = Math.floor(nota);
  const meiaEstrela = nota - estrelasCheias >= 0.5 ? 1 : 0;
  const estrelasVazias = 5 - estrelasCheias - meiaEstrela;

  const estrelas = "★".repeat(estrelasCheias) + 
                  (meiaEstrela ? "⯪" : "") + 
                  "☆".repeat(estrelasVazias);

  return (
    <article className="empresa-card">
      <img
        className="logo"
        src={empresa.logo}
        alt={`${empresa.nome} logo`}
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = "/logos/placeholder.png"; 
        }}
      />

      <div className="empresa-card-info">
        <div className="top">
          <h3>{empresa.nome}</h3>
          <div className="rating">
            <span className="nota">{estrelas}</span>
            <span className="valor">{empresa.nota}</span>
          </div>
        </div>

        <p className="descricao">{empresa.descricao}</p>

        <div className="meta">
          <span>{empresa.localizacao}</span>
          <span>{empresa.vagas} vagas</span>
          <span>{empresa.avaliacoes} avaliações</span>
        </div>
      </div>
    </article>
  );
}

export default CardEmpresa;