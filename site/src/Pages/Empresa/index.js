import "./index.scss";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardEmpresa from "../../Components/CardEmpresa";
import hospitais from "./hospitais";
import "./index.scss";

function EmpresaPage() {
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
      <section className="empresa-conteudo">
        {/* Filtros */}
        <aside className="empresa-filtros">
          <h3>Filtre os Hospitais</h3>
          <input type="text" placeholder="Nome do Hospital" />
          <input type="text" placeholder="Localização (cidade / estado)" />
          <select>
            <option>Especialidade</option>
            <option>Clínica Geral</option>
            <option>Pediatria</option>
            <option>Cardiologia</option>
            <option>Cirurgia</option>
          </select>
          <select>
            <option>Porte do Hospital</option>
            <option>Pequeno (até 50 leitos)</option>
            <option>Médio (51-200 leitos)</option>
            <option>Grande (200+ leitos)</option>
          </select>
          <h4>Classificação por categoria</h4>
          <div className="chips">
            <button className="chip">Estrutura hospitalar</button>
            <button className="chip">Equipe e gestão</button>
            <button className="chip">Remuneração</button>
            <button className="chip">Qualidade de vida</button>
          </div>
          <button className="limpar">Apagar filtros</button>
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
      <section className="empresa-ranking">
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

