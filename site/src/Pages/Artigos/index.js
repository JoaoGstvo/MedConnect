import './index.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { FaThumbsUp, FaRegCommentDots, FaShareSquare } from 'react-icons/fa';

function ArtigoCard({ titulo, autor, data, imagem, resumo, categoria }) {
    return (
        <div className='artigo-card'>
            <div className="artigo-header">
                <div className="autor-avatar">
                    {autor.charAt(0).toUpperCase()}
                </div>
                <div className="autor-info">
                    <h3>{autor}</h3>
                    <p>{data} · {categoria}</p>
                </div>
            </div>

            <h2 className="artigo-titulo">{titulo}</h2>
            <p className="artigo-resumo">{resumo}</p>

            {imagem && <img className="artigo-img" src={imagem} alt={titulo} />}

            <div className="artigo-acoes">
                <button><FaThumbsUp /> Curtir</button>
                <button><FaRegCommentDots /> Comentar</button>
                <button><FaShareSquare /> Compartilhar</button>
            </div>
        </div>
    );
}

function ArtigosPage() {
    return (
        <main className='artigos-page'>
            <Header />

            <section className='intro'>
                <div className='title'>
                    <h1>Feed de Publicações</h1>
                    <p>Estudos, artigos e opiniões da comunidade médica.</p>
                </div>
            </section>

            <section className='artigos-lista'>
                <ArtigoCard 
                    titulo="Uso de Inteligência Artificial na Triagem Médica"
                    autor="Dra. Camila Tavares"
                    data="10/08/2025"
                    categoria="Tecnologia Médica"
                    imagem="https://source.unsplash.com/600x300/?medical,ai"
                    resumo="Estudo analisa como algoritmos de machine learning auxiliam na priorização do atendimento em emergências..."
                />
                <ArtigoCard 
                    titulo="A Humanização no Atendimento Hospitalar"
                    autor="Hospital Vida Plena"
                    data="25/07/2025"
                    categoria="Cuidados com Pacientes"
                    imagem="https://source.unsplash.com/600x300/?hospital,team"
                    resumo="Este artigo destaca a importância da empatia e comunicação na experiência do paciente no ambiente hospitalar..."
                />
                <ArtigoCard 
                    titulo="Telemedicina: Avanços e Desafios"
                    autor="Dr. João Henrique"
                    data="15/06/2025"
                    categoria="Tecnologia Médica"
                    imagem="https://source.unsplash.com/600x300/?telemedicine"
                    resumo="Exploramos o crescimento da prática médica remota, os benefícios e as limitações enfrentadas por profissionais da saúde..."
                />
            </section>

            <Footer />
        </main>
    );
}

export default ArtigosPage;
