import './index.scss';
import Header from "../../Components/Header/index.js";
import Footer from "../../Components/Footer/index.js";
import { useState } from "react";

function MeuCurriculo() {
    const [progress] = useState(89); // porcentagem exemplo

    return (
        <main className="meucurriculo">
            <Header />

            {/* Aviso */}
            <section className="curriculo-header">
                <h1>Currículo</h1>
                <p>
                    <strong>Atenção:</strong> quando você se candidata a uma vaga, a empresa recebe um link para visualizar o seu currículo online. 
                    Tenha cuidado ao realizar modificações, pois todas as empresas terão acesso às alterações realizadas.
                </p>
            </section>

            <div className="curriculo-container">
                {/* Lado Esquerdo - Informações */}
                <div className="curriculo-content">
                    {/* Exemplo de seção */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Dados Pessoais</h2>
                            <button className="edit-btn">Editar</button>
                        </div>
                        <div className="section-body">
                            <input type="text" placeholder="Nome completo" />
                            <input type="email" placeholder="E-mail" />
                            <input type="text" placeholder="Idade" />
                            <input type="text" placeholder="Nacionalidade" />
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>Endereço</h2>
                            <button className="edit-btn">Editar</button>
                        </div>
                        <div className="section-body">
                            <input type="text" placeholder="Cidade, Estado - Brasil" />
                            <input type="text" placeholder="Rua, número, bairro, CEP" />
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>Objetivos</h2>
                            <button className="edit-btn">Editar</button>
                        </div>
                        <div className="section-body">
                            <input type="text" placeholder="Cargo desejado" />
                            <textarea placeholder="Áreas de interesse"></textarea>
                            <input type="text" placeholder="Pretensão salarial" />
                            <input type="text" placeholder="Região de interesse" />
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>Resumo Profissional</h2>
                            <button className="edit-btn">Editar</button>
                        </div>
                        <div className="section-body">
                            <textarea placeholder="Escreva um breve resumo profissional"></textarea>
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>Formação Acadêmica</h2>
                            <button className="edit-btn">Editar</button>
                        </div>
                        <div className="section-body">
                            <input type="text" placeholder="Nível de escolaridade" />
                            <input type="text" placeholder="Graduação (curso, instituição, ano)" />
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>Idiomas</h2>
                            <button className="edit-btn">Editar</button>
                        </div>
                        <div className="section-body">
                            <input type="text" placeholder="Idioma" />
                            <input type="text" placeholder="Nível de leitura" />
                            <input type="text" placeholder="Nível de escrita" />
                            <input type="text" placeholder="Nível de conversação" />
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>Histórico Profissional</h2>
                            <button className="edit-btn">Editar</button>
                        </div>
                        <div className="section-body">
                            <input type="text" placeholder="Último salário" />
                            <input type="text" placeholder="Empresa" />
                            <input type="text" placeholder="Cargo" />
                            <textarea placeholder="Descrição das atividades"></textarea>
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>Informações Complementares</h2>
                            <button className="edit-btn">Editar</button>
                        </div>
                        <div className="section-body">
                            <textarea placeholder="Ex: trabalho voluntário, cursos extras..."></textarea>
                        </div>
                    </div>
                </div>

                {/* Lado Direito - Barra de Progresso */}
                <aside className="curriculo-sidebar">
                    <h3>Preenchimento do currículo</h3>
                    <p>Falta pouco para completar seu currículo!</p>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span>{progress}%</span>

                    <div className="sidebar-links">
                        <a href="#">Visualizar currículo aberto</a>
                        <a href="#">Visualizar adendos</a>
                        <a href="#">Configurações de privacidade</a>
                        <a href="#">Download do currículo em PDF</a>
                    </div>
                </aside>
            </div>

            <Footer />
        </main>
    );
}

export default MeuCurriculo;
