import './index.scss';

function CardProfissional() {
    return (
        <div className='professional-card'>
            <div className='professional-content'>
                <div className='professional-header'>
                    <div className='avatar'>
                        <img src="https://via.placeholder.com/80" alt="Foto do profissional" />
                    </div>
                    <div className='info'>
                        <h3 className='professional-name'>Dra. Mariana Souza</h3>
                        <p className='professional-role'>Enfermeira Intensivista</p>
                        <span className='location'>Belo Horizonte, MG</span>
                    </div>
                </div>

                <div className='divider'></div>

                <div className='experience'>
                    <h4>Experiência:</h4>
                    <p>5 anos de atuação em UTI adulto e pediátrica, com especialização em cuidados críticos.</p>
                </div>

                <div className='skills'>
                    <h4>Competências:</h4>
                    <ul>
                        <li>Atendimento emergencial</li>
                        <li>Cuidados intensivos</li>
                        <li>Gestão de equipe</li>
                    </ul>
                </div>
            </div>

            <div className='professional-footer'>
                <button className='contact-button'>Entrar em Contato</button>
            </div>
        </div>
    );
}

export default CardProfissional;
