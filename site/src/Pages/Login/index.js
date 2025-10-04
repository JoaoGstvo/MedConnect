import './index.scss';
import { useState } from 'react';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !senha) {
      setMsg('Por favor, preencha todos os campos');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMsg('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/profissional/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login realizado com sucesso!', { 
          autoClose: 2000, 
          hideProgressBar: true 
        });
        
        // Salvar dados do usuário no localStorage se "Lembrar de mim" estiver marcado
        if (rememberMe) {
          localStorage.setItem('userData', JSON.stringify(data));
        } else {
          sessionStorage.setItem('userData', JSON.stringify(data));
        }
        
        // Redirecionar após sucesso
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setMsg(data.msg || 'Erro ao fazer login');
        toast.error('Credenciais inválidas', { 
          autoClose: 3000, 
          hideProgressBar: true 
        });
      }
    } catch (err) {
      setMsg('Erro de conexão com o servidor');
      toast.error('Erro de conexão', { 
        autoClose: 3000, 
        hideProgressBar: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className='form-container'>
        <div className='header'>
          <img src="/Images/Logo.png" alt="Logo" />
        </div>

        <form className='form' onSubmit={handleLogin}>
          <h2>Fazer Login como Profissional</h2>
          <p className='form-description'>Digite suas credenciais para acessar sua conta</p>

          <div className='input-field'>
            <span>E-mail</span>
            <input 
              type="email" 
              placeholder='seu@email.com' 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className='input-field'>
            <span>Senha</span>
            <input 
              type="password" 
              placeholder='Sua senha' 
              value={senha} 
              onChange={e => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className='remember-me'>
            <label>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Lembrar de mim</span>
            </label>
            <a href="/senha" className='forgot-password'>Esqueceu a senha?</a>
          </div>

          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? '' : 'Entrar'}
          </button>

          {msg && (
            <p className={`login-msg ${msg.includes('Erro') ? 'error' : 'success'}`}>
              {msg}
            </p>
          )}

          <div className="signup-redirect">
            Não tem uma conta? <a href="/cadastro">Cadastre-se como Profissional</a>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;