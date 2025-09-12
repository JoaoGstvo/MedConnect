import './index.scss';

function MetricCard({ title, value, icon }) {
    return (
        <div className='metric-card'>
            <div className='card-header'>
                <div className='icon'>{icon}</div>
                <h2>{title}</h2>
            </div>
            <p className='value'>{value}</p>
            <button className='action-btn'>Ver detalhes</button>
        </div>
    );
}

export default MetricCard;
