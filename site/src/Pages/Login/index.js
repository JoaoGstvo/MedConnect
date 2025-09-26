import './index.scss';
import { useState } from 'react';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/profissional/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.dark('Usuário logado', { autoClose: 400, hideProgressBar: true });

      } else {
        alert(data.msg);
        console.log('Dados do usuário:', data);
      }
    } catch (err) {
      setMsg('Erro no servidor');
    }
  };

  return (
    <main className="login-page">
      <section className='form-container'>
        <div className='header'>
          <img src="/Images/Logo.png" alt="Logo" />
        </div>

        <div className='form'>
          <h2>Fazer Login como Profissional</h2>
          <p className='form-description'>Digite suas credenciais para acessar sua conta</p>

          <label className='input-field'>
            <span>E-mail</span>
            <input 
              type="email" 
              placeholder='seu@email.com' 
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
          </label>

          <label className='input-field'>
            <span>Senha</span>
            <input 
              type="password" 
              placeholder='Sua senha' 
              value={senha} 
              onChange={e => setSenha(e.target.value)}
            />
          </label>

          <div className='remember-me'>
            <label>
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>
            <a href="/senha" className='forgot-password'>Esqueceu a senha?</a>
          </div>

          <a href='/' style={{ textDecoration: 'none' }}>
          <button className='login-button' onClick={handleLogin}> Entrar</button>
          </a>

          {msg && <p className="login-msg">{msg}</p>}

          <div className="signup-redirect">
            Não tem uma conta? <a href="/">Cadastre-se como Profissional</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
