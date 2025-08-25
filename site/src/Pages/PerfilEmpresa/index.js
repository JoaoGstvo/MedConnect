import React, { useState } from "react";
import "./index.scss";

export default function PerfilEmpresa() {
  const [form, setForm] = useState({
    razao_social: "MedConect",
    nome_fantasia: "",
    cnpj: "12.345.678/0001-90",
    email: "",
    telefone: "",
    cidade: "São Paulo",
    estado: "SP",
    segmento: "",
    descricao: "",
    site: "",
  });

  const [logo, setLogo] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  return (
    <main className="perfil-page">
      <section className="form-container">
        <div className="header">
          <h2>Perfil da Empresa</h2>
        </div>

        <div className="divider"></div>

        <div className="form-content">
          <h3>Informações da Empresa</h3>
          <p className="form-description">
            Mantenha os dados da sua empresa atualizados
          </p>

          <div className="form-grid">
            <div className="form-group">
              <label className="fixed-field">
                <span>Razão Social</span>
                <input
                  type="text"
                  name="razao_social"
                  value={form.razao_social}
                  readOnly
                  placeholder="Nome registrado da empresa"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>Nome Fantasia</span>
                <input
                  type="text"
                  name="nome_fantasia"
                  value={form.nome_fantasia}
                  onChange={handleChange}
                  placeholder="Nome público da empresa"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="fixed-field">
                <span>CNPJ</span>
                <input
                  type="text"
                  name="cnpj"
                  value={form.cnpj}
                  readOnly
                  className="fixed-field"
                  title={form.cnpj}
                  
                />
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>E-mail</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contato@empresa.com"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>Telefone</span>
                <input
                  type="number"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(11) 0000-0000"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="fixed-field">
                <span>Cidade</span>
                <input
                  type="text"
                  name="cidade"
                  value={form.cidade}
                  readOnly
                  title={form.cidade}
                  
                />
              </label>
            </div>

            <div className="form-group">
              <label className="fixed-field">
                <span>Estado</span>
                <input
                  type="text"
                  name="estado"
                  value={form.estado}
                  readOnly
                  title={form.estado}
                  placeholder="Ex: SP"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>Segmento</span>
                <input
                  type="text"
                  name="segmento"
                  value={form.segmento}
                  onChange={handleChange}
                  placeholder="Ex: Saúde, Tecnologia..."
                />
              </label>
            </div>

            {/* Upload de logo */}
          

            <div className="form-group double-width">
              <label className="input-field">
                <span>Descrição da Empresa</span>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Breve descrição da empresa, missão, valores..."
                  rows="3"
                />
              </label>
            </div>

            <div className="form-group full-width">
              <label className="input-field">
                <span>Site</span>
                <input
                  type="text"
                  name="site"
                  value={form.site}
                  onChange={handleChange}
                  placeholder="https://www.empresa.com.br"
                />
              </label>
            </div>
          </div>

          <div className="buttons">
            <button type="button" className="cancel-button">Cancelar</button>
            <button type="submit" className="save-button">Salvar</button>
          </div>
        </div>
      </section>
    </main>
  );
}
