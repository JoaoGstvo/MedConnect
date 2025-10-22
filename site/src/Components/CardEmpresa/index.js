// Components/CardEmpresa/index.js - VERSÃO CORRIGIDA
import { useState, useEffect } from "react";
import "./index.scss";

function CardEmpresa({ empresa }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Se não há dados da empresa, mostra estado de erro
  useEffect(() => {
    if (!empresa) {
      setError("Dados da empresa não disponíveis");
    }
  }, [empresa]);

  // Loading state
  if (loading) {
    return (
      <article className="empresa-card loading">
        <div className="logo-skeleton"></div>
        <div className="empresa-card-info">
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-text skeleton-desc"></div>
          <div className="skeleton-text skeleton-meta"></div>
        </div>
      </article>
    );
  }

  // Error state
  if (error || !empresa) {
    return (
      <article className="empresa-card error">
        <div className="error-message">
          <span></span>
          <p>Não foi possível carregar os dados da empresa</p>
        </div>
      </article>
    );
  }

  // Usar dados reais da empresa conforme estrutura do banco
  const empresaNome = empresa.nome || "Hospital";
  const empresaLogo = empresa.logo_url;
  const empresaDescricao = empresa.descricao || "Descrição não disponível";
  const empresaEndereco = empresa.endereco;
  const empresaTelefone = empresa.telefone;
  const empresaEmail = empresa.email;

  return (
    <article className="empresa-card">
      <img
        className="logo"
        src={empresaLogo || "/logos/placeholder.png"}
        alt={`${empresaNome} logo`}
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = "/logos/placeholder.png"; 
        }}
      />

      <div className="empresa-card-info">
        <div className="top">
          <h3>{empresaNome}</h3>
        </div>

        <p className="descricao">{empresaDescricao}</p>

        <div className="meta">
          {empresaEndereco && (
            <span className="meta-item">
              {empresaEndereco}
            </span>
          )}
          {empresaTelefone && (
            <span className="meta-item">
              {empresaTelefone}
            </span>
          )}
          {empresaEmail && (
            <span className="meta-item">
              {empresaEmail}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default CardEmpresa;