import './index.scss';

function CardEmpresa({ logoText = "Foto", name = "Clínica Reabilitar", sector = "Fisioterapia", description = "Centro especializado em reabilitação física" }) {
    return (
        <div className='company-card'>
            {/* Header */}
            <div className='header'>
                <div className='logo'>{logoText}</div>
                <div className='header-info'>
                    <h2 title={name}>{name}</h2>
                    <p className='sector' title={sector}>{sector}</p>
                    <p className='description' title={description}>{description}</p>
                </div>
            </div>

            {/* Divider */}
            <div className='divider'></div>

            {/* Actions */}
            <div className='actions'>
                <button className='secondary'>Ver Perfil</button>
                <button className='primary'>Ver Vagas</button>
            </div>
        </div>
    );
}

export default CardEmpresa;
