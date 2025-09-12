import './index.scss';

function CardCandidato() {
    return (
        <div className='card-candidato'>
            <div className='info'>
                <h3>Nome do Candidato</h3>
                <p><strong>Email:</strong> candidato@email.com</p>
                <p><strong>Telefone:</strong> (11) 98765-4321</p>
                <p><strong>Vaga:</strong> Enfermeiro(a)</p>
            </div>

            <div className='acoes'>
                <button>Visualizar Currículo</button>
                <select>
                    <option>Status</option>
                    <option>Em Análise</option>
                    <option>Selecionado para Entrevista</option>
                    <option>Rejeitado</option>
                </select>
            </div>
        </div>
    );
}

export default CardCandidato;
