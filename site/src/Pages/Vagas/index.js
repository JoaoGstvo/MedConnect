// Pages/Vagas/index.js - VERSÃO FINAL
import './index.scss';
import { useState, useEffect } from 'react';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardVaga from '../../Components/CardVaga';
import { useAuth } from '../../Components/Hooks/useAuth';

function VagasPage() {
    const [vagas, setVagas] = useState([]);
    const [filtros, setFiltros] = useState({
        pesquisa: '',
        localidade: '',
        tipoContrato: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchVagas = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('http://localhost:5000/api/vagas');
                
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                setVagas(data);
            } catch (error) {
                console.error('Erro ao buscar vagas:', error);
                setError('Erro ao carregar vagas. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchVagas();
    }, []);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const vagasFiltradas = vagas.filter(vaga => {
        const matchPesquisa = !filtros.pesquisa || 
            vaga.titulo?.toLowerCase().includes(filtros.pesquisa.toLowerCase()) ||
            vaga.empresa_nome?.toLowerCase().includes(filtros.pesquisa.toLowerCase());
        
        const matchLocalidade = !filtros.localidade || 
            vaga.localizacao?.toLowerCase().includes(filtros.localidade.toLowerCase());
        
        const matchContrato = !filtros.tipoContrato || 
            vaga.modalidade?.toLowerCase().includes(filtros.tipoContrato.toLowerCase());

        return matchPesquisa && matchLocalidade && matchContrato;
    });

    const handleLimparFiltros = () => {
        setFiltros({
            pesquisa: '',
            localidade: '',
            tipoContrato: ''
        });
    };

    return (
        <main className='vagaspage'>
            <Header />

            <section className='hero-section'>
                <div className='hero-content'>
                    <h1>Encontre Sua Vaga na Área da Saúde</h1>
                    <p>Conectamos profissionais qualificados às melhores oportunidades</p>
                </div>
            </section>

            <section className='filters-section'>
                <div className='filters-container'>
                    <h2>Buscar Vagas</h2>
                    <div className='filters-grid'>
                        <input 
                            type="text" 
                            name="pesquisa"
                            placeholder=" Cargo, especialidade ou empresa"
                            value={filtros.pesquisa}
                            onChange={handleFiltroChange}
                            className='filter-input'
                        />
                        <input 
                            type="text" 
                            name="localidade"
                            placeholder="Cidade ou estado"
                            value={filtros.localidade}
                            onChange={handleFiltroChange}
                            className='filter-input'
                        />
                    </div>
                    <div className='filters-actions'>
                        <button onClick={handleLimparFiltros} className='btn-limpar'>
                            Limpar Filtros
                        </button>
                        <div className='results-count'>
                            {vagasFiltradas.length} vaga(s) encontrada(s)
                        </div>
                    </div>
                </div>
            </section>

            <section className='vagas-section'>
                <div className='container'>
                    <div className='section-title'>
                        <h2>
                            Vagas Disponíveis 
                            <span className='vagas-count'> ({vagasFiltradas.length})</span>
                        </h2>
                    </div>
                    
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Carregando vagas...</p>
                        </div>
                    ) : vagasFiltradas.length > 0 ? (
                        <div className='vagas-grid'>
                            {vagasFiltradas.map(vaga => (
                                <CardVaga key={vaga.id_vaga} vaga={vaga} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-vagas">
                            <h3>Nenhuma vaga encontrada</h3>
                            <p>Tente ajustar os filtros de busca ou limpar os filtros</p>
                            <button onClick={handleLimparFiltros} className='btn-primary'>
                                Limpar Filtros
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default VagasPage;