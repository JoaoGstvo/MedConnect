import './index.scss';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardVaga from '../../Components/CardVaga';
import CardEmpresa from '../../Components/CardEmpresa';
import CardProfissional from '../../Components/CardProfissional';
import MapaEmpresas from '../../Components/MapaEmpresas';
function LandingPage() {
  const [vagas, setVagas] = useState([]);
  const sectionRefs = useRef([]);

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

  // Observer para animações de scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view', 'fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach(section => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const addToRefs = el => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  return (
    <main className="landingpage">
      <Header />

      {/* Hero Section */}
      <section className="principal-container">
        <div className="title">
          <h1>Conectando Profissionais da Saúde às Melhores Oportunidades</h1>
          <p>
            Nossa plataforma é especializada em aproximar empresas, clínicas e hospitais
            de profissionais da área da saúde. Aqui você encontra as vagas, talentos e
            empresas que fazem a diferença.
          </p>
        </div>
        <div className="buttons">
          <Link to="/empresas"><button>Ver Empresas</button></Link>
          <Link to="/vagas"><button>Ver Vagas</button></Link>
        </div>
      </section>

      {/* Vagas em Destaque */}
      <section className="section" ref={addToRefs}>
        <div className="title"><h1>Vagas em Destaque</h1></div>
        <div className="container">
          <div className="wrapper">
            {vagas.length > 0 ? (
              vagas.slice(0, 3).map(vaga => <CardVaga key={vaga.id_vaga} vaga={vaga} />)
            ) : (
              <div className="no-data"><p>Nenhuma vaga disponível no momento</p></div>
            )}
          </div>
        </div>
      </section>

      {/* Empresas em Destaque */}
      <section className="section" ref={addToRefs}>
        <div className="title"><h1>Empresas em Destaque</h1></div>
        <div className="container">
          <div className="wrapper">
          </div>
        </div>
      </section>

      {/* Profissionais em Destaque */}
      <section className="section" ref={addToRefs}>
        <div className="title"><h1>Profissionais em Destaque</h1></div>
        <div className="container">
          <div className="wrapper">
            <CardProfissional />
            <CardProfissional />
            <CardProfissional />
          </div>
        </div>
      </section>

      {/* Mapa de Empresas */}
      <section className="section" ref={addToRefs}>
        <div className="title"><h1>Empresas que estão contratando</h1></div>
        <div className="container">
          <MapaEmpresas />
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default LandingPage;
