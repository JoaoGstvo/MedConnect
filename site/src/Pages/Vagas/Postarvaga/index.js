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

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Limpar feedback quando o usuário começar a digitar
        if (feedback.message) {
            setFeedback({ type: '', message: '' });
        }
    };

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validação básica
        if (!form.titulo.trim() || !form.descricao.trim() || !form.area || !form.contrato || !form.modelo || !form.local || !form.dataLimite) {
            showFeedback('error', 'Por favor, preencha todos os campos obrigatórios.');
            setLoading(false);
            return;
        }

        // Preparar body para o backend
        const body = {
            titulo: form.titulo.trim(),
            descricao: form.descricao.trim(),
            tipo_contrato: form.contrato,
            requisitos: form.descricao.trim(), // Usando a descrição como requisitos
            salario: null,
            area: form.area,
            modelo: form.modelo,
            local: form.local,
            beneficios: form.beneficios || "A combinar",
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
                showFeedback('success', '🎉 Vaga postada com sucesso!');
                // Resetar formulário
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
                showFeedback('error', `❌ Erro ao postar vaga: ${data.msg || 'Tente novamente'}`);
            }
        } catch (err) {
            console.error("Erro no fetch:", err);
            showFeedback('error', '❌ Erro ao conectar com o servidor. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="postarvaga-page">
            <Header />

            <section className="principal-container">
                <div className="title">
                    <h1>Postar Nova Vaga</h1>
                    <p>Divulgue suas oportunidades para profissionais da saúde qualificados.</p>
                </div>
            </section>

            <section className="form-section">
                <form onSubmit={handleSubmit} className="vaga-form">
                    {/* Feedback Message */}
                    {feedback.message && (
                        <div className={`form-feedback ${feedback.type}`}>
                            {feedback.message}
                        </div>
                    )}

                    {/* Título da Vaga */}
                    <div className="form-group">
                        <label>Título da vaga</label>
                        <input 
                            type="text" 
                            name="titulo" 
                            value={form.titulo} 
                            onChange={handleChange} 
                            placeholder="Ex: Enfermeiro(a) Plantonista - UTI" 
                            required 
                        />
                    </div>

                    {/* Descrição */}
                    <div className="form-group">
                        <label>Descrição da Vaga</label>
                        <textarea 
                            name="descricao" 
                            value={form.descricao} 
                            onChange={handleChange} 
                            placeholder="Descreva as responsabilidades, requisitos e atividades da vaga..."
                            required
                        ></textarea>
                    </div>

                    {/* Área da Saúde */}
                    <div className="form-group">
                        <label>Área da Saúde</label>
                        <select name="area" value={form.area} onChange={handleChange} required>
                            <option value="">Selecione uma área</option>
                            <option value="enfermagem">Enfermagem</option>
                            <option value="medicina">Medicina</option>
                            <option value="fisioterapia">Fisioterapia</option>
                            <option value="odontologia">Odontologia</option>
                            <option value="psicologia">Psicologia</option>
                            <option value="nutricao">Nutrição</option>
                            <option value="farmácia">Farmácia</option>
                            <option value="biomedicina">Biomedicina</option>
                        </select>
                    </div>

                    {/* Contrato e Modelo */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label>Tipo de Contrato</label>
                            <select name="contrato" value={form.contrato} onChange={handleChange} required>
                                <option value="">Selecione o contrato</option>
                                <option value="CLT">CLT</option>
                                <option value="PJ">PJ</option>
                                <option value="Estágio">Estágio</option>
                                <option value="Temporário">Temporário</option>
                                <option value="Autônomo">Autônomo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Modelo de Trabalho</label>
                            <select name="modelo" value={form.modelo} onChange={handleChange} required>
                                <option value="">Selecione o modelo</option>
                                <option value="Presencial">Presencial</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="Remoto">Remoto</option>
                            </select>
                        </div>
                    </div>

                    {/* Localidade */}
                    <div className="form-group">
                        <label>Localidade</label>
                        <input 
                            type="text" 
                            name="local" 
                            value={form.local} 
                            onChange={handleChange} 
                            placeholder="Ex: São Paulo - SP, Brasil" 
                            required 
                        />
                    </div>

                    {/* Benefícios */}
                    <div className="form-group">
                        <label>Benefícios</label>
                        <input 
                            type="text" 
                            name="beneficios" 
                            value={form.beneficios} 
                            onChange={handleChange} 
                            placeholder="Ex: Vale-transporte, Plano de saúde, VR/VA" 
                        />
                    </div>

                    {/* Data Limite */}
                    <div className="form-group">
                        <label>📅 Data limite para candidatura</label>
                        <input 
                            type="date" 
                            name="dataLimite" 
                            value={form.dataLimite} 
                            onChange={handleChange} 
                            min={new Date().toISOString().split('T')[0]}
                            required 
                        />
                    </div>

                    {/* Botão de Envio */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={loading ? 'loading' : ''}
                        >
                            {loading ? 'Publicando...' : '🚀 Publicar Vaga'}
                        </button>
                    </div>
                </form>
            </section>

            <Footer />
        </main>
    );
}

export default PostarVaga;