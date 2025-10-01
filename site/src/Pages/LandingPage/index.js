import './index.scss';
import { useState, useEffect } from 'react';
import Header from "../../Components/Header/index.js";
import Footer from "../../Components/Footer";
import CardVaga from '../../Components/CardVaga/index.js';
import CardEmpresa from '../../Components/CardEmpresa/index.js';
import { hospitais } from '../Empresa/hospitais.js';
import CardProfissional from '../../Components/CardProfissional/index.js';
import { Link } from 'react-router-dom';
import MapaEmpresas from '../../Components/MapaEmpresas/index.js';

function LandingPage() {
    const [vagas, setVagas] = useState([]);

    // Buscar vagas do backend
    useEffect(() => {
        const fetchVagas = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/vagas');
                const data = await res.json();
                setVagas(data || []);
            } catch (err) {
                console.error("Erro ao buscar vagas:", err);
            }
        };

        fetchVagas();
    }, []);

    return (
        <main className='landingpage'>
            <Header />

            {/* Hero Section */}
            <section className='principal-container'>
                <div className='title'>
                    <h1>Conectando Profissionais da Saúde às Melhores Oportunidades</h1>
                    <p>
                        Nossa plataforma é especializada em aproximar empresas, clínicas e hospitais
                        de profissionais da área da saúde. Aqui você encontra as vagas, talentos e
                        empresas que fazem a diferença.
                    </p>
                </div>
                <div className='buttons'>
                    <Link to="/empresas"><button>Ver Empresas</button></Link>
                    <Link to="/vagas"><button>Ver Vagas</button></Link>
                </div>
            </section>

            {/* Vagas em Destaque */}
            <section className='section'>
                <div className='title'>
                    <h1>Vagas em Destaque</h1>
                </div>
                <div className='container'>
                    <div className='wrapper'>
                        {vagas.length > 0 ? (
                            vagas.map(vaga => <CardVaga key={vaga.id_vaga} vaga={vaga} />)
                        ) : (
                            <p>Nenhuma vaga disponível</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Empresas em Destaque */}
            <section className='section'>
                <div className='title'>
                    <h1>Empresas em Destaque</h1>
                </div>
                <div className='container'>
                    <div className='wrapper'>
                        {hospitais.slice(0, 4).map(hospital => (
                            <CardEmpresa key={hospital.id} hospital={hospital} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Profissionais em Destaque */}
            <section className='section'>
                <div className='title'>
                    <h1>Profissionais em Destaque</h1>
                </div>
                <div className='container'>
                    <div className='wrapper'>
                        <CardProfissional />
                        <CardProfissional />
                        <CardProfissional />
                    </div>
                </div>
            </section>
            <section className='section'>
                <div className='title'>
                    <h1>Empresas que estão contratando</h1>
                </div>
                <div className='container'>
                    <MapaEmpresas />
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default LandingPage
