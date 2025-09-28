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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Preparar body para o backend
        const body = {
            titulo: form.titulo.trim(),
            descricao: form.descricao.trim(),
            tipo_contrato: form.contrato,
            requisitos: null, // ou coloque form.beneficios se quiser
            salario: null,    // se tiver campo de salário, adicione aqui
            area: form.area,
            modelo: form.modelo,
            local: form.local,
            beneficios: form.beneficios,
            data_limite: form.dataLimite
        };

        console.log("Enviando pro backend:", body);

        try {
            const res = await fetch("http://localhost:5000/api/vaga", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            console.log("Resposta do backend:", data);

            if (res.ok) {
                alert("Vaga postada com sucesso!");
                setForm({
                    titulo: "",
                    descricao: "",
                    area: "",
                    contrato: "",
                    modelo: "",
                    local: "",
                    beneficios: "",
                    dataLimite: ""
                });
            } else {
                alert("Erro ao postar vaga: " + data.msg);
            }
        } catch (err) {
            console.error("Erro no fetch:", err);
            alert("Erro ao conectar com o servidor");
        }
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
                    {/* Campos do formulário */}
                    <div className="form-group">
                        <label>Título da vaga</label>
                        <input type="text" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ex: Enfermeiro(a) Plantonista" required />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descreva as responsabilidades e requisitos da vaga" required></textarea>
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
                                <option value="CLT">CLT</option>
                                <option value="Estágio">Estágio</option>
                                <option value="Temporário">Temporário</option>
                                <option value="Autônomo">Autônomo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Modelo de Trabalho</label>
                            <select name="modelo" value={form.modelo} onChange={handleChange} required>
                                <option value="">Selecione</option>
                                <option value="Presencial">Presencial</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="Remoto">Remoto</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Localidade</label>
                        <input type="text" name="local" value={form.local} onChange={handleChange} placeholder="Ex: São Paulo - SP" required />
                    </div>

                    <div className="form-group">
                        <label>Benefícios</label>
                        <input type="text" name="beneficios" value={form.beneficios} onChange={handleChange} placeholder="Ex: Vale-transporte, Plano de saúde" />
                    </div>

                    <div className="form-group">
                        <label>Data limite para candidatura</label>
                        <input type="date" name="dataLimite" value={form.dataLimite} onChange={handleChange} required />
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
