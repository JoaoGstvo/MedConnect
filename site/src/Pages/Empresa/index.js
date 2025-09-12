import "./index.scss";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import CardVaga from "../../Components/CardVaga";
import CardProfissional from "../../Components/CardProfissional";
function EmpresaPage() {
  return (
    <main className="empresa-page">
      {" "}
      <Header /> {/* Seção principal da empresa */}{" "}
      <section className="empresa-header">
        {" "}
        <div className="empresa-info">
          {" "}
          <h1>Hospital Vida Saudável</h1>{" "}
          <p>
            Conectando profissionais de saúde a oportunidades de crescimento.
          </p>{" "}
          <div className="acoes">
            {" "}
            <button>Seguir Empresa</button> <button>Visitar Site</button>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Sobre a empresa */}{" "}
      <section className="empresa-sobre">
        {" "}
        <h2>Sobre a Empresa</h2>{" "}
        <div className="sobre-container">
          {" "}
          <p>
            {" "}
            O Hospital Vida Saudável é referência em atendimento humanizado, com
            foco em medicina preventiva e inovação tecnológica.{" "}
          </p>{" "}
          <ul>
            {" "}
            <li>
              <strong>Missão:</strong> Oferecer cuidados de saúde de alta
              qualidade.
            </li>{" "}
            <li>
              <strong>Visão:</strong> Ser referência nacional em excelência no
              cuidado à saúde.
            </li>{" "}
            <li>
              <strong>Valores:</strong> Humanização, Ética, Inovação,
              Colaboração.
            </li>{" "}
          </ul>{" "}
        </div>{" "}
      </section>{" "}
      {/* Vagas abertas */}{" "}
      <section className="empresa-vagas">
        {" "}
        <h2>Vagas Abertas</h2>{" "}
        <div className="filtros">
          {" "}
          <select>
            {" "}
            <option>Especialidade</option> <option>Enfermagem</option>{" "}
            <option>Medicina</option> <option>Fisioterapia</option>{" "}
          </select>{" "}
          <select>
            {" "}
            <option>Tipo de Contrato</option> <option>CLT</option>{" "}
            <option>Freelancer</option> <option>Estágio</option>{" "}
          </select>{" "}
        </div>{" "}
        <div className="cards-container">
          {" "}
          <CardVaga /> <CardVaga /> <CardVaga />{" "}
        </div>{" "}
      </section>{" "}
      {/* Profissionais */}{" "}
      <section className="empresa-profissionais">
        {" "}
        <h2>Profissionais da Empresa</h2>{" "}
        <div className="cards-container">
          {" "}
          <CardProfissional /> <CardProfissional /> <CardProfissional />{" "}
        </div>{" "}
      </section>{" "}
      {/* Contato */}{" "}
      <section className="empresa-contato">
        {" "}
        <h2>Contato e Localização</h2>{" "}
        <div className="contato-info">
          {" "}
          <p>
            <strong>Endereço:</strong> Rua Saúde, 123 - São Paulo, SP
          </p>{" "}
          <p>
            <strong>Telefone:</strong> (11) 98765-4321
          </p>{" "}
          <p>
            <strong>Email:</strong> contato@hospitalvidasaudavel.com.br
          </p>{" "}
        </div>{" "}
      </section>{" "}
      <Footer />{" "}
    </main>
  );
}
export default EmpresaPage;
