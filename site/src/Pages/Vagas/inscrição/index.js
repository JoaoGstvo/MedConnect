import './index.scss';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useState } from 'react';

function InscricaoPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        curriculo: null,
        mensagem: ''
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de envio do formulário aqui
        console.log('Dados do formulário:', formData);
    };

    return (
        <main className='inscricaopage'>
            <Header />

            {/* Seção de Introdução */}
            <section className='principal-container'>
                <div className='title'>
                    <h1>Inscreva-se na Vaga</h1>
                    <p>Preencha seus dados abaixo para se candidatar à oportunidade selecionada.</p>
                </div>
            </section>

            {/* Formulário de Inscrição */}
            <section className='section'>
                <form className='form-container' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Nome Completo</label>
                        <input 
                            type="text" 
                            name="nome"
                            placeholder="Digite seu nome completo" 
                            value={formData.nome}
                            onChange={handleInputChange}
                            required 
                        />
                    </div>

                    <div className='form-group'>
                        <label>E-mail</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="seu@email.com" 
                            value={formData.email}
                            onChange={handleInputChange}
                            required 
                        />
                    </div>

                    <div className='form-group'>
                        <label>Telefone</label>
                        <input 
                            type="tel" 
                            name="telefone"
                            placeholder="(XX) XXXXX-XXXX" 
                            value={formData.telefone}
                            onChange={handleInputChange}
                            required 
                        />
                    </div>

                    <div className='form-group'>
                        <label>Currículo (PDF)</label>
                        <input 
                            type="file" 
                            name="curriculo"
                            accept=".pdf" 
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Mensagem</label>
                        <textarea 
                            name="mensagem"
                            placeholder="Escreva uma breve mensagem para o recrutador..." 
                            rows="4"
                            value={formData.mensagem}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <div className='actions'>
                        <button type="submit" className='btn-submit'>
                             Enviar Inscrição
                        </button>
                        <a href="/">        
                            <button type="button" className='btn-back'>← Voltar</button>
                        </a>
                    </div>
                </form>
            </section>

            <Footer />
        </main>
    );
}

export default InscricaoPage;