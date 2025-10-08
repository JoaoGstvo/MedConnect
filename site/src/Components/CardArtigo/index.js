// Components/CardArtigo/index.js
import { Link } from "react-router-dom";
import './index.scss';

function CardArtigo({ id, titulo, resumo, imagem, categoria, autor, dataPublicacao }) {
  return (
    <div className="card-artigo">
      {imagem && <img src={imagem} alt={titulo} className="card-img" />}
      <div className="card-conteudo">
        <span className="categoria">{categoria}</span>
        <h3>{titulo}</h3>
        <p>{resumo}</p>
        
        <div className="card-footer">
          <div className="autor-info">
            <span className="autor">Por {autor}</span>
            <span className="data">
              {new Date(dataPublicacao).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <Link to={`/artigos/${id}`} className="btn-ver">Ler mais</Link>
        </div>
      </div>
    </div>
  );
}

export default CardArtigo;