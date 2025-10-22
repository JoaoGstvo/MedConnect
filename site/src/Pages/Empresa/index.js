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
    localizacao: ''
  });
  
  const sectionRefs = useRef([]);

  // Buscar empresas do backend
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

  const limparFiltros = () => {
    setFiltros({
      nome: '',
      localizacao: ''
    });
  };

  // Filtrar empresas baseado nos filtros
  const empresasFiltradas = empresas.filter(empresa => {
    const matchNome = filtros.nome === '' || 
      (empresa.nome && empresa.nome.toLowerCase().includes(filtros.nome.toLowerCase()));
    
    const matchLocalizacao = filtros.localizacao === '' || 
      (empresa.cidade && empresa.cidade.toLowerCase().includes(filtros.localizacao.toLowerCase())) ||
      (empresa.estado && empresa.estado.toLowerCase().includes(filtros.localizacao.toLowerCase())) ||
      (empresa.endereco && empresa.endereco.toLowerCase().includes(filtros.localizacao.toLowerCase()));

    return matchNome && matchLocalizacao;
  });

  return (
    <main className="empresa-page">
      <Header />

      {/* Cabeçalho */}
      <section className="empresa-header">
        <div className="empresa-info">
          <h1>Encontre o hospital ideal para sua carreira</h1>
          <p>
            Conheça hospitais, clínicas e instituições de saúde. 
            Explore suas estruturas, localizações e oportunidades disponíveis.
          </p>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="empresa-conteudo" ref={addToRefs}>
        {/* Filtros */}
        <aside className="empresa-filtros">
          <h3>Filtrar Hospitais</h3>
          <input 
            type="text" 
            name="nome"
            placeholder=" Nome do Hospital"
            value={filtros.nome}
            onChange={handleFiltroChange}
          />
          <input 
            type="text" 
            name="localizacao"
            placeholder=" Cidade ou Estado"
            value={filtros.localizacao}
            onChange={handleFiltroChange}
          />
          
          <div className="filtros-info">
            <p>Encontre hospitais por nome ou endereço</p>
          </div>
          
          <button className="limpar" onClick={limparFiltros}>
             Limpar Filtros
          </button>
        </aside>

        {/* Lista de hospitais */}
        <div className="empresa-lista">
          <div className="lista-info">
            <h2>Hospitais Cadastrados</h2>
            {loading ? (
              <p>Buscando hospitais...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <p>
                {empresasFiltradas.length === empresas.length 
                  ? `Mostrando todos os ${empresas.length} hospitais`
                  : `Encontrados ${empresasFiltradas.length} de ${empresas.length} hospitais`
                }
              </p>
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
            <CardEmpresa key={empresa.id_empresa} empresa={empresa} />
          ))}

          {/* Paginação simples */}
          {!loading && !error && empresasFiltradas.length > 0 && (
            <div className="paginacao">
              <button disabled>{"< Anterior"}</button>
              <span className="pagina-atual">Página 1</span>
              <button disabled>{"Próxima >"}</button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default EmpresaPage;