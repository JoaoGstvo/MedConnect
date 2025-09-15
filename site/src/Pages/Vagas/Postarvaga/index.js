import './index.scss';
import Header from "../../../Components/Header/index.js";
import Footer from "../../../Components/Footer/index.js";
import { useState } from "react";

function PostarVaga() {
    const [form, setForm] = useState({
        titulo: "",
        descricao: "",
        area: "",
        contrato: "",
        modelo: "",
        local: "",
        beneficios: "",
        dataLimite: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Vaga enviada:", form);
        alert("Vaga postada com sucesso!");
        // aqui você pode integrar com o backend futuramente
    };

    return (
        <main className="postarvaga-page">
            <Header />

            <section className="principal-container">
                <div className="title">
                    <h1>Postar Nova Vaga</h1>
                    <p>Divulgue suas oportunidades para profissionais da saúde.</p>
                </div>
            </section>

            <section className="form-section">
                <form onSubmit={handleSubmit} className="vaga-form">
                    <div className="form-group">
                        <label>Título da vaga</label>
                        <input 
                            type="text" 
                            name="titulo" 
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Ex: Enfermeiro(a) Plantonista"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea 
                            name="descricao" 
                            value={form.descricao}
                            onChange={handleChange}
                            placeholder="Descreva as responsabilidades e requisitos da vaga"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Área da Saúde</label>
                        <select name="area" value={form.area} onChange={handleChange} required>
                            <option value="">Selecione</option>
                            <option value="enfermagem">Enfermagem</option>
                            <option value="medicina">Medicina</option>
                            <option value="fisioterapia">Fisioterapia</option>
                            <option value="odontologia">Odontologia</option>
                            <option value="psicologia">Psicologia</option>
                        </select>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label>Tipo de Contrato</label>
                            <select name="contrato" value={form.contrato} onChange={handleChange} required>
                                <option value="">Selecione</option>
                                <option value="clt">CLT</option>
                                <option value="estagio">Estágio</option>
                                <option value="temporario">Temporário</option>
                                <option value="autonomo">Autônomo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Modelo de Trabalho</label>
                            <select name="modelo" value={form.modelo} onChange={handleChange} required>
                                <option value="">Selecione</option>
                                <option value="presencial">Presencial</option>
                                <option value="hibrido">Híbrido</option>
                                <option value="remoto">Remoto</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Localidade</label>
                        <input 
                            type="text" 
                            name="local" 
                            value={form.local}
                            onChange={handleChange}
                            placeholder="Ex: São Paulo - SP"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Benefícios</label>
                        <input 
                            type="text" 
                            name="beneficios" 
                            value={form.beneficios}
                            onChange={handleChange}
                            placeholder="Ex: Vale-transporte, Plano de saúde"
                        />
                    </div>

                    <div className="form-group">
                        <label>Data limite para candidatura</label>
                        <input 
                            type="date" 
                            name="dataLimite" 
                            value={form.dataLimite}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit">Postar Vaga</button>
                    </div>
                </form>
            </section>

            <Footer />
        </main>
    );
}

export default PostarVaga;
