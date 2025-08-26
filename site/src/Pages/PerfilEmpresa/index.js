
import './index.scss';

function BusnessProfile() {
    return (
        <main className="busnessprofile-page">
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
                                    value="MedConect"
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
                                    placeholder="Nome público da empresa"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="fixed-field">
                                <span>CNPJ</span>
                                <input
                                    type="text"
                                    value="12.345.678/0001-90"
                                    readOnly
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="input-field">
                                <span>E-mail</span>
                                <input
                                    type="email"
                                    placeholder="contato@empresa.com"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="input-field">
                                <span>Telefone</span>
                                <input
                                    type="tel"
                                    placeholder="(11) 0000-0000"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="fixed-field">
                                <span>Cidade</span>
                                <input
                                    type="text"
                                    value="São Paulo"
                                    readOnly
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="fixed-field">
                                <span>Estado</span>
                                <input
                                    type="text"
                                    value="SP"
                                    readOnly
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="input-field">
                                <span>Segmento</span>
                                <input
                                    type="text"
                                    placeholder="Ex: Saúde, Tecnologia..."
                                />
                            </label>
                        </div>

                        <div className="form-group double-width">
                            <label className="input-field">
                                <span>Descrição da Empresa</span>
                                <textarea
                                    placeholder="Breve descrição da empresa, missão, valores..."
                                    rows="3"
                                />
                            </label>
                        </div>

                        <div className="form-group full-width">
                            <label className="input-field">
                                <span>Site</span>
                                <input
                                    type="url"
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

export default BusnessProfile;