import './index.scss';
import { useState } from 'react';

function EsqueceuSenha() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode chamar sua API para enviar o link de recuperação
    console.log("Solicitação de recuperação enviada para:", email);
  };

  return (
    <main className="login-page">
      <section className='form-container'>
        <div className='header'>
          <img src="/Images/Logo.png" alt="Logo" />
        </div>

        <div className='divider'></div>

        <div className='form'>
          <h2>Recuperar Senha</h2>
          <p className='form-description'>
            Digite seu e-mail cadastrado e enviaremos instruções para redefinir sua senha.
          </p>

          <form onSubmit={handleSubmit}>
            <label className='input-field'>
              <span>E-mail</span>
              <input 
                type="email" 
                placeholder='seu@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </label>

            <button type="submit" className='login-button'>
              Enviar Instruções
            </button>
          </form>

          <div className="signup-redirect">
            Lembrou sua senha? <a href="/login">Voltar ao Login</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EsqueceuSenha;
