import './index.scss';
import { useState, useEffect, useRef } from 'react';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardVaga from '../../Components/CardVaga';

function VagasPage() {
    const [vagas, setVagas] = useState([]);
    const [filtros, setFiltros] = useState({
        pesquisa: '',
        localidade: '',
        tipoContrato: ''
    });
    const sectionRefs = useRef([]);

    // Simulação de busca de vagas
    useEffect(() => {
        // Aqui você pode fazer a chamada para a API
        const fetchVagas = async () => {
            try {
                // const res = await fetch('http://localhost:5000/api/vagas');
                // const data = await res.json();
                // setVagas(data || []);
                
                // Dados mockados para exemplo
                setVagas([
                    { id: 1, titulo: "Enfermeiro Intensivista", empresa: "Hospital Central", local: "São Paulo", tipo: "CLT" },
                    { id: 2, titulo: "Médico Cardiologista", empresa: "Clínica Saúde", local: "Rio de Janeiro", tipo: "PJ" },
                    { id: 3, titulo: "Fisioterapeuta", empresa: "Hospital Municipal", local: "Belo Horizonte", tipo: "CLT" },
                    { id: 4, titulo: "Enfermeiro Pediátrico", empresa: "Hospital Infantil", local: "Curitiba", tipo: "Estágio" },
                    { id: 5, titulo: "Médico Pediatra", empresa: "Clínica Kids", local: "Porto Alegre", tipo: "PJ" }
                ]);
            } catch (err) {
                console.error("Erro ao buscar vagas:", err);
            }
        };

        fetchVagas();
    }, []);

    // Observer para animações de scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view', 'fade-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        sectionRefs.current.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBuscar = () => {
        // Implementar lógica de filtro aqui
        console.log('Aplicando filtros:', filtros);
    };

    return (
        <main className='vagaspage'>
            <Header />

            <section className='principal-container'>
                <div className='title'>
                    <h1>Encontre a Oportunidade Ideal na Área da Saúde</h1>
                    <p>Busque vagas por especialidade, localidade ou tipo de contrato e distribua melhor os profissionais da saúde.</p>
                </div>
            </section>

            <section className='section' ref={addToRefs}>
                <div className='title'>
                    <h1>Filtros de Busca</h1>
                </div>
                <div className='filters'>
                    <input 
                        type="text" 
                        name="pesquisa"
                        placeholder="🔍 Pesquisar por cargo ou especialidade"
                        value={filtros.pesquisa}
                        onChange={handleFiltroChange}
                    />
                    <input 
                        type="text" 
                        name="localidade"
                        placeholder="📍 Cidade ou região"
                        value={filtros.localidade}
                        onChange={handleFiltroChange}
                    />
                    <select 
                        name="tipoContrato"
                        value={filtros.tipoContrato}
                        onChange={handleFiltroChange}
                    >
                        <option value="">📄 Tipo de Contrato</option>
                        <option value="CLT">CLT</option>
                        <option value="PJ">PJ</option>
                        <option value="Estágio">Estágio</option>
                        <option value="Temporário">Temporário</option>
                    </select>
                    <button onClick={handleBuscar}>
                        Buscar Vagas
                    </button>
                </div>
            </section>

            <section className='section' ref={addToRefs}>
                <div className='title'>
                    <h1>Vagas Disponíveis</h1>
                </div>
                <div className='container'>
                    <div className='wrapper'>
                        {vagas.length > 0 ? (
                            vagas.map(vaga => (
                                <CardVaga 
                                    key={vaga.id} 
                                    vaga={vaga}
                                />
                            ))
                        ) : (
                            <div className="no-vagas">
                                <p>Nenhuma vaga encontrada</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default VagasPage;