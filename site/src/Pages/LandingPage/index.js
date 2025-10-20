import './index.scss';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardVaga from '../../Components/CardVaga';
import CardEmpresa from '../../Components/CardEmpresa';
import MapaEmpresas from '../../Components/MapaEmpresas';

function LandingPage() {
  const [vagas, setVagas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loadingVagas, setLoadingVagas] = useState(true);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const sectionRefs = useRef([]);

  // Buscar vagas do backend
  useEffect(() => {
    const fetchVagas = async () => {
      try {
        setLoadingVagas(true);
        const res = await fetch('http://localhost:5000/api/vagas');
        if (res.ok) {
          const data = await res.json();
          setVagas(data || []);
        }
      } catch (err) {
        console.error("Erro ao buscar vagas:", err);
      } finally {
        setLoadingVagas(false);
      }
    };

    fetchVagas();
  }, []);

  // Buscar empresas do backend
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        setLoadingEmpresas(true);
        const res = await fetch('http://localhost:5000/api/empresas');
        if (res.ok) {
          const data = await res.json();
          setEmpresas(data || []);
        }
      } catch (err) {
        console.error("Erro ao buscar empresas:", err);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    fetchEmpresas();
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
          <Link to="/empresas">
            <button className="btn-primary">Explorar Empresas</button>
          </Link>
          <Link to="/vagas">
            <button className="btn-secondary">Ver Vagas</button>
          </Link>
        </div>
      </section>

      {/* Vagas em Destaque */}
      <section className="section" ref={addToRefs}>
        <div className="section-header">
          <h2>Vagas em Destaque</h2>
          <p>Encontre oportunidades que combinam com seu perfil</p>
        </div>
        <div className="container">
          <div className="cards-grid">
            {loadingVagas ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Carregando vagas...</p>
              </div>
            ) : vagas.length > 0 ? (
              vagas.slice(0, 3).map(vaga => (
                <CardVaga 
                  key={vaga.id_vaga} 
                  vaga={vaga}
                  showActions={true} // Garante que os botões sejam mostrados
                />
              ))
            ) : (
              <div className="empty-state">
                <p>Nenhuma vaga disponível no momento</p>
                <Link to="/vagas">
                  <button className="btn-outline">Ver todas as vagas</button>
                </Link>
              </div>
            )}
          </div>
          {vagas.length > 0 && (
            <div className="section-footer">
              <Link to="/vagas" className="view-all-link">
                Ver todas as vagas →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Empresas em Destaque */}
      <section className="section" ref={addToRefs}>
        <div className="section-header">
          <h2>Empresas em Destaque</h2>
          <p>Conheça hospitais, clínicas e instituições de saúde parceiras</p>
        </div>
        <div className="container">
          <div className="cards-grid">
            {loadingEmpresas ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Carregando empresas...</p>
              </div>
            ) : empresas.length > 0 ? (
              empresas.slice(0, 3).map(empresa => (
                <CardEmpresa 
                  key={empresa.id_empresa} 
                  empresa={empresa}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>Nenhuma empresa cadastrada no momento</p>
                <Link to="/empresas">
                  <button className="btn-outline">Explorar empresas</button>
                </Link>
              </div>
            )}
          </div>
          {empresas.length > 0 && (
            <div className="section-footer">
              <Link to="/empresas" className="view-all-link">
                Ver todas as empresas →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Mapa de Empresas */}
      <section className="section" ref={addToRefs}>
        <div className="section-header">
          <h2>Empresas que estão contratando</h2>
          <p>Encontre oportunidades perto de você</p>
        </div>
        <div className="container">
          <MapaEmpresas empresas={empresas} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" ref={addToRefs}>
        <div className="cta-content">
          <h2>Pronto para encontrar sua próxima oportunidade?</h2>
          <p>Junte-se a milhares de profissionais da saúde que já encontraram seu lugar ideal</p>
          <div className="cta-buttons">
            <Link to="/cadastro">
              <button className="btn-primary">Criar Conta</button>
            </Link>
            <Link to="/vagas">
              <button className="btn-outline">Explorar Vagas</button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default LandingPage;