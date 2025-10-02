import { Link } from "react-router-dom";
import './index.scss';

function CardArtigo({ id, titulo, resumo, imagem, categoria }) {
    return (
        <main className="card-artigo">
            {imagem && <img src={imagem} alt={titulo} className="card-img" />}
            <div className="card-conteudo">
                <h3>{titulo}</h3>
                <p>{resumo}</p>
                <span className="categoria">{categoria}</span>
                <Link to={`/artigos/${id}`} className="btn-ver">Ler mais</Link>
            </div>
        </main>
    );
}

export default CardArtigo;
