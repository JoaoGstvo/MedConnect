import "./index.scss";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardEmpresa from "../../Components/CardEmpresa";
import { useState, useEffect, useRef } from 'react';

function EmpresaPage() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    nome: '',
    localizacao: '',
    especialidade: '',
    porte: '',
    categoria: ''
  });
  
  const sectionRefs = useRef([]);

  // 🔥 Buscar empresas do backend
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/empresas");
        
        if (!res.ok) {
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setEmpresas(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar empresas:", err);
        setError("Erro ao carregar empresas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchEmpresas();
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

  // 🔥 Filtrar empresas baseado nos filtros
  const empresasFiltradas = empresas.filter(empresa => {
    const matchNome = filtros.nome === '' || 
      empresa.nome.toLowerCase().includes(filtros.nome.toLowerCase());
    
    const matchLocalizacao = filtros.localizacao === '' || 
      empresa.localizacao.toLowerCase().includes(filtros.localizacao.toLowerCase());
    
    const matchEspecialidade = filtros.especialidade === '' || true; // Futuramente implementar especialidades
    
    const matchPorte = filtros.porte === '' || true; // Futuramente implementar porte
    
    const matchCategoria = filtros.categoria === '' || true; // Futuramente implementar categorias

    return matchNome && matchLocalizacao && matchEspecialidade && matchPorte && matchCategoria;
  });

  // 🔥 Top 3 empresas para o ranking
  const topEmpresas = [...empresas]
    .sort((a, b) => parseFloat(b.nota) - parseFloat(a.nota))
    .slice(0, 3);

  return (
    <main className="empresa-page">
      <Header />

      {/* Cabeçalho */}
      <section className="empresa-header">
        <div className="empresa-info">
          <h1>Encontre o hospital ideal para sua carreira</h1>
          <p>
            Explore avaliações, vagas e informações sobre hospitais em todo o Brasil.
            Descobre onde você pode crescer e fazer a diferença na área da saúde.
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
            {loading ? (
              <p>Carregando empresas...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <p>Mostrando {empresasFiltradas.length} de {empresas.length} hospitais. Use os filtros para refinar sua busca.</p>
            )}
          </div>

          {/* Estados de loading e error */}
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando hospitais...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <p>❌ {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-retry"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Lista de empresas */}
          {!loading && !error && empresasFiltradas.length === 0 && (
            <div className="empty-state">
              <p>Nenhum hospital encontrado com os filtros atuais.</p>
              <button onClick={limparFiltros} className="btn-limpar">
                Limpar Filtros
              </button>
            </div>
          )}

          {!loading && !error && empresasFiltradas.map((empresa) => (
            <CardEmpresa key={empresa.id_empresa} hospital={empresa} />
          ))}

          {/* Paginação simples - Futuramente implementar paginação no backend */}
          {!loading && !error && empresasFiltradas.length > 0 && (
            <div className="paginacao">
              <button disabled>{"<"}</button>
              <button className="active">1</button>
              <button disabled>{">"}</button>
            </div>
          )}
        </div>
      </section>

      {/* Ranking */}
      <section className="empresa-ranking" ref={addToRefs}>
        <h2>🏆 Melhores Hospitais para Trabalhar</h2>
        {loading ? (
          <p>Carregando ranking...</p>
        ) : error ? (
          <p>Não foi possível carregar o ranking</p>
        ) : (
          <>
            <ol>
              {topEmpresas.map((empresa, index) => (
                <li key={empresa.id_empresa}>
                  {empresa.nome} - {empresa.nota}⭐
                </li>
              ))}
            </ol>
            <a className="ver-completa" href="#!">
              Ver a lista completa →
            </a>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default EmpresaPage;