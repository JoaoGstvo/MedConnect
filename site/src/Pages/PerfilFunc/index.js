import React, { useState } from "react";
import "./index.scss";

export default function Perfil() {
  const [form, setForm] = useState({
    nome: "",
    nascimento: "",
    cpf: "",
    email: "",
    telefone: "",
    cidade: "",
    profissao: "",
    registro: "",
    especializacoes: "",
  });

  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  return (
    <main className="perfil-page">
      <section className="form-container">
        <div className="header" style={{ position: "relative" }}>
          <h2>Meu Perfil</h2>
        </div>

        <div className="divider"></div>

        <div className="form-content">
          <h3>Informações Pessoais</h3>
          <p className="form-description">Atualize suas informações abaixo</p>

          <div className="form-grid">
            <div className="form-group">
              <label className="input-field">
                <span>Nome Completo</span>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>Data de Nascimento</span>
                <input
                  type="date"
                  name="nascimento"
                  value={form.nascimento}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>CPF</span>
                <input
                  type="text"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
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
                  placeholder="seu@email.com"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>Telefone</span>
                <input
                  type="tel"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>Cidade</span>
                <input
                  type="text"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  placeholder="Sua cidade"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>Profissão</span>
                <select
                  name="profissao"
                  value={form.profissao}
                  onChange={handleChange}
                >
                  <option value="" disabled>Selecione a profissão</option>
                  <option value="Médico">Médico</option>
                  <option value="Enfermeiro">Enfermeiro</option>
                  <option value="Fisioterapeuta">Fisioterapeuta</option>
                  <option value="Nutricionista">Nutricionista</option>
                  <option value="Psicólogo">Psicólogo</option>
                  <option value="Outro">Outro</option>
                </select>
              </label>
            </div>

            <div className="form-group">
              <label className="input-field">
                <span>Registro Profissional</span>
                <input
                  type="text"
                  name="registro"
                  value={form.registro}
                  onChange={handleChange}
                  placeholder="Ex: CRM, COREN..."
                />
              </label>
            </div>


            {/* Upload de Foto */}
            <div className="photo-upload">
              <label htmlFor="photoInput">
                {photo ? (
                  <img src={photo} alt="Foto do usuário" className="user-photo" />
                ) : (
                  <div className="photo-placeholder">+</div>
                )}
              </label>
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>
            <div className="form-group double-width">
              <label className="input-field">
                <span>Especializações</span>
                <textarea
                  name="especializacoes"
                  value={form.especializacoes}
                  onChange={handleChange}
                  placeholder="Ex: Cardiologia, UTI, Emergência..."
                  rows="2"
                />
              </label>
            </div>
          </div>

          <div className="buttons">
            <button type="button" className="cancel-button">Cancelar</button>
            <button type="submit" className="save-button">Salvar</button>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="acoes">
              <h4>Ações Rápidas</h4>
              <button>Buscar vagas</button>
              <button>Ver artigos</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
