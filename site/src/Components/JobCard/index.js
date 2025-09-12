import './index.scss';

function JobCard({ companyLogo, title, subtitle, type, location, status }) {
    return (
        <div className={`job-card status-${status.toLowerCase().replace(/\s/g, '-')}`}>
            <img src={companyLogo} alt={title} className="company-logo" />
            <div className="job-info">
                <h3>{title}</h3>
                <p className="subtitle">{subtitle}</p>
                <p className="details">{type} • {location}</p>
            </div>
            <span className="status-badge">{status}</span>
        </div>
    );
}

export default JobCard;

