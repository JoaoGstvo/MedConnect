import './index.scss';

function CardArtigo({ 
  id, 
  titulo, 
  resumo, 
  imagem, 
  categoria, 
  dataPublicacao, 
  autor, 
  visualizacoes, 
  comentarios, 
  reacoes,
  isMeuArtigo = false,
  onVisualizar,
  onEditar,
  onExcluir
}) {
  
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleVisualizar = (e) => {
    e.stopPropagation();
    if (onVisualizar) onVisualizar();
  };

  const handleEditar = (e) => {
    e.stopPropagation();
    if (onEditar) onEditar(id);
  };

  const handleExcluir = (e) => {
    e.stopPropagation();
    if (onExcluir) onExcluir(id);
  };

  return (
    <article className="card-artigo" onClick={handleVisualizar}>
      {imagem && (
        <div className="card-imagem">
          <img src={imagem} alt={titulo} />
        </div>
      )}
      
      <div className="card-conteudo">
        <div className="card-cabecalho">
          <span className="categoria">{categoria}</span>
          <span className="data">{formatarData(dataPublicacao)}</span>
        </div>
        
        <h3 className="card-titulo">{titulo}</h3>
        
        {resumo && (
          <p className="card-resumo">{resumo}</p>
        )}
        
        <div className="card-rodape">
          <div className="autor-info">
            <span className="autor">Por {autor}</span>
          </div>
        </div>

        {isMeuArtigo && (
          <div className="acoes-artigo">
            <button className="btn-editar" onClick={handleEditar}>
               Editar
            </button>
            <button className="btn-excluir" onClick={handleExcluir}>
                 Excluir
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default CardArtigo;