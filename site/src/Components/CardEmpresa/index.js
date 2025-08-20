import './index.scss';

function CardEmpresa() {
    return (
        <div className='company-card'>
            <div className='header'>
                <div className='logo'>Foto</div>
                <div>
                    <h2>Clinica Reabilitar</h2>
                    <p className='sector'>Fisioterapia</p>
                    <p className='description'>Centro especializado em reabilitação física</p>
                </div>
            </div>

            <div className='divider'></div>

            <div className='actions'>
                <button className='secondary'>Ver Perfil</button>
                <button className='primary'>Ver Vagas</button>
            </div>
        </div>
    );
}

export default CardEmpresa;