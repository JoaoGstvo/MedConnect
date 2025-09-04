import './criar.scss';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useState } from 'react';

function CriarArtigoPage() {
    const [form, setForm] = useState({
        titulo: '',
        autor: '',
        data: '',
        imagem: '',
        categoria: '',
        resumo: '',
        conteudo: '',
        arquivo: null
    });

    const [enviado, setEnviado] = useState(false);

    function handleChange(e) {
        const { name, value, files } = e.target;

        if (name === 'arquivo') {
            setForm({ ...form, arquivo: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Simulação de envio
        console.log("Artigo enviado:", form);
        setEnviado(true);

        setTimeout(() => {
            setEnviado(false);
        }, 3000);

        // Aqui você pode enviar para uma API (ex: via fetch ou axios)
    }

    function handleReset() {
        setForm({
            titulo: '',
            autor: '',
            data: '',
            imagem: '',
            categoria: '',
            resumo: '',
            conteudo: '',
            arquivo: null
        });
        setEnviado(false);
    }

    return (
        <main className='criar-artigo-page'>
            <Header />

            <section className='formulario'>
                <h1>Publicar Novo Artigo</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grupo">
                        <label>Título do Artigo</label>
                        <input type="text" name="titulo" placeholder="Ex: Impacto da IA na Saúde" required value={form.titulo} onChange={handleChange} />
                    </div>

                    <div className="grupo">
                        <label>Autor (Profissional ou Empresa)</label>
                        <input type="text" name="autor" placeholder="Ex: Dr. João Silva / Clínica Vida" required value={form.autor} onChange={handleChange} />
                    </div>

                    <div className="grupo-row">
                        <div className="grupo">
                            <label>Data de Publicação</label>
                            <input type="date" name="data" required value={form.data} onChange={handleChange} />
                        </div>

                        <div className="grupo">
                            <label>Categoria</label>
                            <select name="categoria" required value={form.categoria} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="Tecnologia Médica">Tecnologia Médica</option>
                                <option value="Cuidados com Pacientes">Cuidados com Pacientes</option>
                                <option value="Pesquisa Clínica">Pesquisa Clínica</option>
                                <option value="Educação em Saúde">Educação em Saúde</option>
                            </select>
                        </div>
                    </div>

                    <div className="grupo">
                        <label>Imagem de Capa (URL)</label>
                        <input type="url" name="imagem" placeholder="https://..." value={form.imagem} onChange={handleChange} />
                    </div>

                    <div className="grupo">
                        <label>Resumo</label>
                        <textarea name="resumo" rows="4" placeholder="Resumo breve do artigo..." required value={form.resumo} onChange={handleChange}></textarea>
                    </div>

                    <div className="grupo">
                        <label>Conteúdo Completo</label>
                        <textarea name="conteudo" rows="8" placeholder="Conteúdo detalhado do artigo..." required value={form.conteudo} onChange={handleChange}></textarea>
                    </div>

                    <div className="grupo">
                        <label>Upload de PDF (opcional)</label>
                        <input type="file" name="arquivo" accept=".pdf" onChange={handleChange} />
                    </div>

                    <div className="botoes">
                        <button type="submit" className='publicar'>Publicar Artigo</button>
                        <button type="button" className='limpar' onClick={handleReset}>Limpar</button>
                    </div>

                    {enviado && <p className='mensagem-sucesso'>✅ Artigo enviado com sucesso!</p>}
                </form>
            </section>

            <Footer />
        </main>
    );
}

export default CriarArtigoPage;
