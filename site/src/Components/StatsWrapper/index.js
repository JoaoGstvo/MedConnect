import './index.scss';
import MetricCard from '../MetricCard';
import { Briefcase, Users, Calendar } from 'lucide-react';

function StatsWrapper() {
    return (
        <div className='stats-wrapper'>
            <MetricCard 
                title="Vagas Ativas" 
                value="5" 
                icon={<Briefcase size={32} />} 
            />
            <MetricCard 
                title="Candidatos Recebidos" 
                value="32" 
                icon={<Users size={32} />} 
            />
            <MetricCard 
                title="Entrevistas Agendadas" 
                value="4" 
                icon={<Calendar size={32} />} 
            />
        </div>
    );
}

export default StatsWrapper;
