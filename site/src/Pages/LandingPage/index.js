import './index.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardVaga from '../../Components/CardVaga';
import CardEmpresa from '../../Components/CardEmpresa';
import MapaEmpresas from '../../Components/MapaEmpresas';
import { useCurrentUser } from '../../Components/Hooks/useCurrentUser';

function LandingPage() {
  const [vagas, setVagas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loadingVagas, setLoadingVagas] = useState(true);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [errorVagas, setErrorVagas] = useState(null);
  const sectionRefs = useRef([]);
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  // Buscar vagas do backend - EXATAMENTE IGUAL À PÁGINA DE VAGAS
  useEffect(() => {
    const fetchVagas = async () => {
      try {
        setLoadingVagas(true);
        setErrorVagas(null);
        
        const response = await fetch('http://localhost:5000/api/vagas');
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setVagas(data || []);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        setErrorVagas('Erro ao carregar vagas. Tente novamente.');
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

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <main className="landingpage">
      <Header />

      {/* Hero Section */}
      <section className="principal-container">
        <div className="title">
          <h1>Conectando Profissionais da Saúde às Melhores Oportunidades</h1>
          <p>
            {currentUser ? (
              <>
                Bem-vindo de volta, <strong>{currentUser.nome}</strong>! 
                Encontre as melhores oportunidades que combinam com seu perfil.
              </>
            ) : (
              "Nossa plataforma é especializada em aproximar empresas, clínicas e hospitais de profissionais da área da saúde. Aqui você encontra as vagas, talentos e empresas que fazem a diferença."
            )}
          </p>
        </div>
        <div className="buttons">
          <button 
            className="btn-primary"
            onClick={() => handleNavigation('/empresas')}
          >
            Explorar Empresas
          </button>
          <button 
            className="btn-secondary"
            onClick={() => handleNavigation('/vagas')}
          >
            Ver Vagas
          </button>
        </div>
      </section>

      {/* Vagas em Destaque - EXATAMENTE IGUAL À PÁGINA DE VAGAS */}
      <section className="section" ref={addToRefs}>
        <div className="section-header">
          <h2>Vagas em Destaque</h2>
          <p>
            {currentUser 
              ? `Encontre oportunidades para ${currentUser.nome}`
              : "Encontre oportunidades que combinam com seu perfil"
            }
          </p>
        </div>
        <div className="container">
          {errorVagas && (
            <div className="error-message">
              <p>{errorVagas}</p>
            </div>
          )}
          
          <div className="cards-grid">
            {loadingVagas ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Carregando vagas...</p>
              </div>
            ) : vagas.length > 0 ? (
              vagas.slice(0, 3).map(vaga => (
                <CardVaga key={vaga.id_vaga} vaga={vaga} />
              ))
            ) : (
              <div className="no-vagas">
                <h3>Nenhuma vaga encontrada</h3>
                <p>Em breve teremos novas oportunidades</p>
                <button onClick={() => handleNavigation('/vagas')} className='btn-primary'>
                  Ver Todas as Vagas
                </button>
              </div>
            )}
          </div>
          
          {vagas.length > 0 && (
            <div className="section-footer">
              <button 
                className="view-all-link"
                onClick={() => handleNavigation('/vagas')}
              >
                Ver todas as vagas →
              </button>
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
              <div className="loading">
                <div className="spinner"></div>
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
              <div className="no-vagas">
                <h3>Nenhuma empresa cadastrada</h3>
                <p>Em breve teremos empresas parceiras</p>
                <button 
                  className="btn-primary"
                  onClick={() => handleNavigation('/empresas')}
                >
                  Explorar Empresas
                </button>
              </div>
            )}
          </div>
          {empresas.length > 0 && (
            <div className="section-footer">
              <button 
                className="view-all-link"
                onClick={() => handleNavigation('/empresas')}
              >
                Ver todas as empresas →
              </button>
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
          <h2>
            {currentUser 
              ? `Pronto para a próxima oportunidade, ${currentUser.nome}?`
              : "Pronto para encontrar sua próxima oportunidade?"
            }
          </h2>
          <p>
            {currentUser
              ? "Continue explorando para encontrar a vaga perfeita para sua carreira"
              : "Junte-se a milhares de profissionais da saúde que já encontraram seu lugar ideal"
            }
          </p>
          <div className="cta-buttons">
            {currentUser ? (
              <>
                <button 
                  className="btn-primary"
                  onClick={() => handleNavigation('/vagas')}
                >
                  Explorar Mais Vagas
                </button>
                <button 
                  className="btn-outline"
                  onClick={() => handleNavigation('/meucurriculo')}
                >
                  Atualizar Meu Perfil
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn-primary"
                  onClick={() => handleNavigation('/cadastro')}
                >
                  Criar Conta
                </button>
                <button 
                  className="btn-outline"
                  onClick={() => handleNavigation('/vagas')}
                >
                  Explorar Vagas
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default LandingPage;