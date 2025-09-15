import './index.scss';
import Header from "../../Components/Header/index.js";
import Footer from "../../Components/Footer/index.js";
import CardProfissional from '../../Components/CardProfissional/index.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ContatoProfissionalPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulação de envio (API ou backend)
        setTimeout(() => {
            // Redireciona automaticamente para a tela de sucesso
            navigate("/mensagemenviadaprofissional");
        }, 1500); // 1,5s de delay para efeito visual
    }

    return (
        <main className='contatoprofissionalpage'>
            <Header />

            {/* Hero Section */}
            <section className='principal-container'>
                <div className='title'>
                    <h1>Entre em Contato com o Profissional</h1>
                    <p>
                        Preencha o formulário abaixo para enviar uma mensagem diretamente ao profissional da saúde.
                        Certifique-se de fornecer informações claras para facilitar o contato.
                    </p>
                </div>
            </section>

            {/* Formulário de Contato */}
            <section className='section'>
                <div className='container'>
                    <form className='form-container' onSubmit={handleSubmit}>
                        <label>
                            Seu Nome:
                            <input type="text" placeholder="Digite seu nome" required disabled={isSubmitting} />
                        </label>

                        <label>
                            Seu E-mail:
                            <input type="email" placeholder="Digite seu e-mail" required disabled={isSubmitting} />
                        </label>

                        <label>
                            Mensagem:
                            <textarea placeholder="Escreva sua mensagem" rows="6" required disabled={isSubmitting}></textarea>
                        </label>

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                        </button>
                    </form>
                </div>
            </section>

            {/* Profissionais em Destaque */}
            <section className='section'>
                <div className='title'>
                    <h1>Profissionais Disponíveis</h1>
                </div>
                <div className='container'>
                    <div className='wrapper'>
                        <CardProfissional />
                        <CardProfissional />
                        <CardProfissional />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default ContatoProfissionalPage;
