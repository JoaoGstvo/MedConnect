import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/Hooks/useAuth';

function CardVaga({ vaga }) {
    const [salvando, setSalvando] = useState(false);
    const [estaSalva, setEstaSalva] = useState(false);
    const navigate = useNavigate();
    
    const { user, isAuthenticated } = useAuth();

    const handleSalvarVaga = async () => {
        if (!isAuthenticated) {
            alert('Você precisa estar logado para salvar vagas.');
            navigate('/login');
            return;
        }

        setSalvando(true);
        try {
            const response = await fetch('http://localhost:5000/api/vagas/salvar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: user.id_usuario,
                    id_vaga: vaga.id_vaga
                })
            });

            if (response.ok) {
                setEstaSalva(true);
                alert('Vaga salva com sucesso!');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao salvar vaga');
            }
        } catch (error) {
            console.error('Erro ao salvar vaga:', error);
            alert(`Erro: ${error.message}`);
        } finally {
            setSalvando(false);
        }
    };

    const handleCandidatar = () => {
        if (!isAuthenticated) {
            alert('Você precisa estar logado para se candidatar a vagas.');
            navigate('/login');
            return;
        }
        
        navigate(`/inscricaovaga/${vaga.id_vaga}`);
    };

    return (
        <div className="card-vaga">
            {/* Conteúdo do card vaga */}
            
            <div className="card-actions">
                <button 
                    onClick={handleCandidatar}
                    className="btn-candidatar"
                >
                     Candidatar-se
                </button>
                
                <button 
                    onClick={handleSalvarVaga}
                    disabled={salvando || estaSalva}
                    className={`btn-salvar ${estaSalva ? 'saved' : ''}`}
                >
                    {salvando ? 'Salvando...' : estaSalva ? '✅ Salva' : '💾 Salvar'}
                </button>
            </div>
        </div>
    );
}

export default CardVaga;