import './index.scss';
import { useAuth } from '../Hooks/useAuth';

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
  id_usuario, // Adicionar id do usuário autor
  tipo_autor, // Adicionar tipo do autor
  onVisualizar,
  onEditar,
  onExcluir
}) {
  const { user } = useAuth();

  // Função para verificar se o artigo pertence ao usuário logado
  const isMeuArtigo = () => {
    if (!user) return false;
    
    // Se for empresa, verifica se o id_usuario do artigo é igual ao id_empresa do usuário
    // E se o tipo_autor é 'empresa'
    if (user.tipo_usuario === 'empresa') {
      return user.id_usuario === id_usuario && tipo_autor === 'empresa';
    }
    
    // Se for profissional, verifica se o id_usuario do artigo é igual ao id_usuario do usuário
    // E se o tipo_autor é 'profissional'
    if (user.tipo_usuario === 'profissional') {
      return user.id_usuario === id_usuario && tipo_autor === 'profissional';
    }
    
    return false;
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleVisualizar = (e) => {
    e.stopPropagation();
    if (onVisualizar) onVisualizar();
  };

  const handleEditar = (e) => {
    e.stopPropagation();
    if (isMeuArtigo() && onEditar) {
      onEditar(id);
    }
  };

  const handleExcluir = (e) => {
    e.stopPropagation();
    if (isMeuArtigo() && onExcluir) {
      onExcluir(id);
    }
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
            {tipo_autor === 'empresa' && (
              <span className="badge-empresa">Empresa</span>
            )}
          </div>
        </div>

        {isMeuArtigo() && (
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