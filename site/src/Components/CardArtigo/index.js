import './index.scss';

function CardArtigo() {
    return (
        <main className='card'>
            <header>
                <div className="autor-avatar">D</div>
                <div className="autor-info">
                    <h3>Dr. João Henrique</h3>
                    <p>15/06/2025 · Tecnologia Médica</p>
                </div>
            </header>

            <h2 className="title">Telemedicina: Avanços e Desafios</h2>
            <p className="resumo">Exploramos o crescimento da prática médica remota, os benefícios e as limitações enfrentadas por profissionais da saúde...</p>

            <img src="https://source.unsplash.com/600x300/?telemedicine" alt="Telemedicina" />
        </main>
    );
}

export default CardArtigo;
