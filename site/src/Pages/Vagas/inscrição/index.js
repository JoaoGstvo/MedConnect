import './index.scss';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";

function InscricaoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vaga, setVaga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nome: 'Usuário Demo',
        email: 'demo@saude.com',
        telefone: '',
        curriculo: null,
        mensagem: ''
    });
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        const fetchVaga = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/vagas/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setVaga(data);
                }
            } catch (error) {
                console.error('Erro ao buscar vaga:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVaga();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);

        try {
            // Primeiro faz a inscrição na vaga
            const inscricaoResponse = await fetch('http://localhost:5000/api/inscricoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_vaga: parseInt(id),
                    id_usuario: 1 // Usuário demo
                })
            });

            if (!inscricaoResponse.ok) {
                const error = await inscricaoResponse.json();
                throw new Error(error.error || 'Erro ao realizar inscrição');
            }
            
            alert('🎉 Inscrição realizada com sucesso!');
            navigate('/minhas-vagas');
            
        } catch (error) {
            console.error('Erro:', error);
            alert(`Erro: ${error.message}`);
        } finally {
            setEnviando(false);
        }
    };

    if (loading) return <div className="loading-page">Carregando...</div>;
    if (!vaga) return <div className="error-page">Vaga não encontrada</div>;

    return (
        <main className='inscricaopage'>
            <Header />

            <section className='principal-container'>
                <div className='title'>
                    <h1>Inscreva-se na Vaga</h1>
                    <p>Preencha seus dados para se candidatar à oportunidade</p>
                </div>
            </section>

            <section className='section'>
                <div className='vaga-info'>
                    <h2>{vaga.titulo}</h2>
                    <p><strong>Empresa:</strong> {vaga.empresa_nome}</p>
                    <p><strong>Local:</strong> {vaga.localizacao}</p>
                    <p><strong>Modalidade:</strong> {vaga.modalidade}</p>
                </div>

                <form className='form-container' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Nome Completo *</label>
                        <input 
                            type="text" 
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            required 
                            disabled
                        />
                        <small>Usuário demo - em produção será automático</small>
                    </div>

                    <div className='form-group'>
                        <label>E-mail *</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required 
                            disabled
                        />
                    </div>

                    <div className='form-group'>
                        <label>Telefone</label>
                        <input 
                            type="tel" 
                            name="telefone"
                            placeholder="(11) 99999-9999"
                            value={formData.telefone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Currículo (PDF)</label>
                        <input 
                            type="file" 
                            name="curriculo"
                            accept=".pdf" 
                            onChange={handleInputChange}
                        />
                        <small>Opcional para demonstração</small>
                    </div>

                    <div className='form-group'>
                        <label>Mensagem para o recrutador</label>
                        <textarea 
                            name="mensagem"
                            placeholder="Conte um pouco sobre sua experiência e por que você é a pessoa ideal para esta vaga..."
                            rows="4"
                            value={formData.mensagem}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <div className='actions'>
                        <button type="submit" className='btn-submit' disabled={enviando}>
                            {enviando ? 'Enviando...' : '✅ Confirmar Inscrição'}
                        </button>
                        <button type="button" className='btn-back' onClick={() => navigate(-1)}>
                            ← Voltar
                        </button>
                    </div>
                </form>
            </section>

            <Footer />
        </main>
    );
}

export default InscricaoPage;