import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import './index.scss';

function CardArtigo({ id, titulo, resumo, imagem, categoria, autor, dataPublicacao }) {
  return (
    <div className="card-artigo fade-in">
      {imagem && <img src={imagem} alt={titulo} className="card-img" />}
      <div className="card-conteudo">
        <span className="categoria">{categoria}</span>

        <h3 className="titulo">{titulo}</h3>
        <p className="resumo">{resumo}</p>

        <div className="card-footer">
          <div className="autor-info">
            <span className="autor">
              <User size={14} className="icon" /> {autor}
            </span>
            <span className="data">
              <Calendar size={14} className="icon" />
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
