import './index.scss';

function JobCard({ companyLogo, title, subtitle, type, location, progress }) {
    return (
        <div className="job-card">
            <img src={companyLogo} alt="Logo da empresa" className="company-logo" />
            <h3>{title}</h3>
            <p className="subtitle">{subtitle}</p>
            <p className="details">
                <span>{type}</span> • <span>{location}</span>
            </p>
            <div className="progress">
                <strong></strong>
                <div className="progress-bar"></div>
                <p>{progress}</p>
            </div>
            <div className="actions">
                <button className="btn-access">Acessar vaga</button>
                <button className="btn-block">🚫</button>
            </div>
        </div>
    );
}

export default JobCard;
