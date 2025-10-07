import './index.scss';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";

function MaisInformacoesPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vaga, setVaga] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVaga = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/vagas/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setVaga(data);
                } else {
                    console.error('Vaga não encontrada');
                }
            } catch (error) {
                console.error('Erro ao buscar vaga:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVaga();
    }, [id]);

    const handleCandidatar = () => {
        // ✅ CORREÇÃO: Navegação correta para a página de inscrição
        navigate(`/inscricaovaga/${id}`);
    };

    const handleVoltar = () => {
        navigate('/vagas');
    };

    if (loading) return <div className="loading-page">Carregando...</div>;
    if (!vaga) return <div className="error-page">Vaga não encontrada</div>;

    return (
        <main className='maisinfopage'>
            <Header />

            <section className='principal-container'>
                <div className='title'>
                    <h1>Detalhes da Vaga</h1>
                    <p>Confira todas as informações desta oportunidade</p>
                </div>
            </section>

            <section className='section'>
                <div className='details-container'>
                    <h2>{vaga.titulo}</h2>
                    <div className='vaga-info'>
                        <p><strong>Empresa:</strong> {vaga.empresa_nome}</p>
                        <p><strong>Descrição:</strong> {vaga.descricao}</p>
                        <p><strong>Requisitos:</strong> {vaga.requisitos || "Não informados"}</p>
                        <p><strong>Modalidade:</strong> {vaga.modalidade || "Não informada"}</p>
                        <p><strong>Salário:</strong> {vaga.salario ? `R$ ${parseFloat(vaga.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "A combinar"}</p>
                        <p><strong>Localização:</strong> {vaga.localizacao || "Não informado"}</p>
                        <p><strong>Status:</strong> <span className={`status ${vaga.status}`}>{vaga.status === 'aberta' ? '🟢 Aberta' : '🔴 Fechada'}</span></p>
                    </div>
                </div>
                
                <div className='actions'>
                    <button 
                        className='btn-apply' 
                        onClick={handleCandidatar}
                        disabled={vaga.status !== 'aberta'}
                    >
                        {vaga.status === 'aberta' ? 'Candidatar-se' : 'Vaga Fechada'}
                    </button>
                    <button className='btn-back' onClick={handleVoltar}>
                        Voltar para Vagas
                    </button>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default MaisInformacoesPage;