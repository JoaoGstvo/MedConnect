import './index.scss';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../Components/Hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [accountType, setAccountType] = useState('profissional');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

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
      const result = await login(email, senha, accountType);

      if (result.success) {
        toast.success('Login realizado com sucesso!', {
          autoClose: 2000,
          hideProgressBar: true
        });

        // Redirecionar após sucesso
        setTimeout(() => {
          // Redirecionar baseado no tipo de usuário
          if (accountType === 'empresa') {
            navigate('/dashboardempresa');
          } else {
            navigate('/vagas');
          }
        }, 2000);
      } else {
        setMsg(result.error);
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

  // Usuários demo para facilitar o login
  const demoUsers = {
    profissional: [
      { email: 'joao@demo.com', senha: '123456', nome: 'João Silva' },
      { email: 'maria@demo.com', senha: '123456', nome: 'Maria Santos' },
      { email: 'pedro@demo.com', senha: '123456', nome: 'Pedro Oliveira' }
    ],
    empresa: [
      { email: 'empresa@demo.com', senha: '123456', nome: 'HealthCorp' }
    ]
  };

  const handleDemoLogin = (demoUser) => {
    setEmail(demoUser.email);
    setSenha(demoUser.senha);
  };

  return (
    <main className="login-page">
      <section className='form-container'>
        <div className='header'>
          <img src="/Images/Logo.png" alt="Logo" className="logo" />
          <h1>Bem-vindo de volta!</h1>
          <p className="welcome-text">Entre na sua conta para continuar</p>
        </div>

        <div className="divider"></div>

        <div className="form-content">
          <h2>Fazer Login</h2>
          <p className='form-description'>Selecione o tipo de conta e digite suas credenciais</p>

          {/* Seletor de Tipo de Conta */}
          <div className="account-type-options">
            <div
              className={`account-type-card ${accountType === 'profissional' ? 'selected' : ''}`}
              onClick={() => setAccountType('profissional')}
            >
              <div className="card-icon professional-icon">👨‍⚕️</div>
              <h3>Profissional</h3>
              <p>Busco oportunidades</p>
            </div>

            <div
              className={`account-type-card ${accountType === 'empresa' ? 'selected' : ''}`}
              onClick={() => setAccountType('empresa')}
            >
              <div className="card-icon company-icon">🏢</div>
              <h3>Empresa</h3>
              <p>Contrato profissionais</p>
            </div>
          </div>

          {/* Acesso Rápido - Demo Users */}
          <div className="demo-access">
            <h4>Acesso Rápido (Demo)</h4>
            <div className="demo-users">
              {demoUsers[accountType].map((demoUser, index) => (
                <button
                  key={index}
                  className="demo-user-btn"
                  onClick={() => handleDemoLogin(demoUser)}
                  type="button"
                >
                  <span className="demo-avatar">
                    {demoUser.nome.charAt(0)}
                  </span>
                  <span className="demo-info">
                    <strong>{demoUser.nome}</strong>
                    <small>{demoUser.email}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form className='form' onSubmit={handleLogin}>
            <div className='input-field'>
              <label>E-mail</label>
              <input
                type="email"
                placeholder='seu@email.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className='input-field'>
              <label>Senha</label>
              <input
                type="password"
                placeholder='Sua senha'
                value={senha}
                onChange={e => setSenha(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className='form-options'>
              <label className="remember-me">
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
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Entrando...
                </>
              ) : (
                `Entrar como ${accountType === 'profissional' ? 'Profissional' : 'Empresa'}`
              )}
            </button>

            {msg && (
              <div className={`message ${msg.includes('Erro') ? 'error' : 'success'}`}>
                {msg}
              </div>
            )}

            <div className="signup-redirect">
              Não tem uma conta? <a href="/cadastro">Cadastre-se aqui</a>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;