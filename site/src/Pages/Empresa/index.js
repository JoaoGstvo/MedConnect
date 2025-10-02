import "./index.scss";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardEmpresa from "../../Components/CardEmpresa";
import hospitais from "./hospitais";
import { useState, useEffect, useRef } from 'react';

function EmpresaPage() {
  const [filtros, setFiltros] = useState({
    nome: '',
    localizacao: '',
    especialidade: '',
    porte: '',
    categoria: ''
  });
  
  const sectionRefs = useRef([]);

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

  const handleChipClick = (categoria) => {
    setFiltros(prev => ({
      ...prev,
      categoria: prev.categoria === categoria ? '' : categoria
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      nome: '',
      localizacao: '',
      especialidade: '',
      porte: '',
      categoria: ''
    });
  };

  return (
    <main className="empresa-page">
      <Header />

      {/* Cabeçalho */}
      <section className="empresa-header">
        <div className="empresa-info">
          <h1>Encontre o hospital ideal para sua carreira</h1>
          <p>
            Explore avaliações, vagas e informações sobre hospitais em todo o Brasil.
            Descubra onde você pode crescer e fazer a diferença na área da saúde.
          </p>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="empresa-conteudo" ref={addToRefs}>
        {/* Filtros */}
        <aside className="empresa-filtros">
          <h3>Filtre os Hospitais</h3>
          <input 
            type="text" 
            name="nome"
            placeholder="🏥 Nome do Hospital"
            value={filtros.nome}
            onChange={handleFiltroChange}
          />
          <input 
            type="text" 
            name="localizacao"
            placeholder="📍 Localização (cidade / estado)"
            value={filtros.localizacao}
            onChange={handleFiltroChange}
          />
          <select 
            name="especialidade"
            value={filtros.especialidade}
            onChange={handleFiltroChange}
          >
            <option value="">🎯 Especialidade</option>
            <option value="Clínica Geral">Clínica Geral</option>
            <option value="Pediatria">Pediatria</option>
            <option value="Cardiologia">Cardiologia</option>
            <option value="Cirurgia">Cirurgia</option>
          </select>
          <select 
            name="porte"
            value={filtros.porte}
            onChange={handleFiltroChange}
          >
            <option value="">📊 Porte do Hospital</option>
            <option value="Pequeno">Pequeno (até 50 leitos)</option>
            <option value="Médio">Médio (51-200 leitos)</option>
            <option value="Grande">Grande (200+ leitos)</option>
          </select>
          
          <h4>Classificação por categoria</h4>
          <div className="chips">
            <button 
              className={`chip ${filtros.categoria === 'Estrutura hospitalar' ? 'active' : ''}`}
              onClick={() => handleChipClick('Estrutura hospitalar')}
            >
              Estrutura hospitalar
            </button>
            <button 
              className={`chip ${filtros.categoria === 'Equipe e gestão' ? 'active' : ''}`}
              onClick={() => handleChipClick('Equipe e gestão')}
            >
              Equipe e gestão
            </button>
            <button 
              className={`chip ${filtros.categoria === 'Remuneração' ? 'active' : ''}`}
              onClick={() => handleChipClick('Remuneração')}
            >
              Remuneração
            </button>
            <button 
              className={`chip ${filtros.categoria === 'Qualidade de vida' ? 'active' : ''}`}
              onClick={() => handleChipClick('Qualidade de vida')}
            >
              Qualidade de vida
            </button>
          </div>
          
          <button className="limpar" onClick={limparFiltros}>
            🗑️ Apagar filtros
          </button>
        </aside>

        {/* Lista de hospitais */}
        <div className="empresa-lista">
          <div className="lista-info">
            <h2>Explorar hospitais</h2>
            <p>Mostrando {hospitais.length} hospitais. Use os filtros para refinar sua busca.</p>
          </div>

          {hospitais.map((hospital) => (
            <CardEmpresa key={hospital.id} hospital={hospital} />
          ))}

          {/* Paginação simples */}
          <div className="paginacao">
            <button>{"<"}</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>{">"}</button>
          </div>
        </div>
      </section>

      {/* Ranking */}
      <section className="empresa-ranking" ref={addToRefs}>
        <h2>🏆 Melhores Hospitais para Trabalhar</h2>
        <ol>
          <li>Hospital Albert Einstein - 4.8⭐</li>
          <li>Hospital Samaritano - 4.5⭐</li>
          <li>Rede D'Or São Luiz - 4.4⭐</li>
          <li>Hospital Nove de Julho - 4.3⭐</li>
        </ol>
        <a className="ver-completa" href="#!">Ver a lista completa →</a>
      </section>

      <Footer />
    </main>
  );
}

export default EmpresaPage;