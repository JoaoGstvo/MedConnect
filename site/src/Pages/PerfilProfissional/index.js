import './index.scss';

function ProfissionalProfile() {
    return (
        <main className="profissionalprofile-page">
            <section className="form-container">
                <div className="header">
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
                                    placeholder="Seu nome completo"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="input-field">
                                <span>Data de Nascimento</span>
                                <input
                                    type="date"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="input-field">
                                <span>CPF</span>
                                <input
                                    type="text"
                                    placeholder="000.000.000-00"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="input-field">
                                <span>E-mail</span>
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="input-field">
                                <span>Telefone</span>
                                <input
                                    type="tel"
                                    placeholder="(11) 99999-9999"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="input-field">
                                <span>Cidade</span>
                                <input
                                    type="text"
                                    placeholder="Sua cidade"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="input-field">
                                <span>Profissão</span>
                                <select>
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
                                    placeholder="Ex: CRM, COREN..."
                                />
                            </label>
                        </div>

                        <div className="photo-upload">
                            <label htmlFor="photoInput">
                                <div className="photo-placeholder">+</div>
                            </label>
                            <input
                                type="file"
                                id="photoInput"
                                accept="image/*"
                            />
                        </div>

                        <div className="form-group double-width">
                            <label className="input-field">
                                <span>Especializações</span>
                                <textarea
                                    placeholder="Ex: Cardiologia, UTI, Emergência..."
                                    rows="2"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="buttons">
                        <button type="button" className="cancel-button" >Cancelar</button>
                        <button type="submit" className="save-button">Salvar</button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ProfissionalProfile;