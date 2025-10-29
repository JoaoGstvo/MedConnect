// Pages/Login/index.js - VERSÃO ATUALIZADA
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
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      toast.error('Por favor, preencha todos os campos', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Por favor, insira um email válido', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      console.log(' Iniciando processo de login...');
      
      const result = await login(email, senha, accountType);

      if (result.success) {
        console.log('✅ Login bem-sucedido!');
        toast.success(`Login realizado com sucesso! Bem-vindo(a) de volta!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });

        // Redirecionar após sucesso
        setTimeout(() => {
          if (accountType === 'empresa') {
            navigate('/dashboardempresa');
          } else {
            navigate('/vagas');
          }
        }, 1500);
      } else {
        console.error('❌ Erro no login:', result.error);
        toast.error(result.error || 'Credenciais inválidas', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false
        });
      }
    } catch (err) {
      console.error('💥 Erro crítico no login:', err);
      toast.error('Erro de conexão com o servidor', {
        position: "top-right",
        autoClose: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountTypeChange = (type) => {
    console.log(' Alterando tipo de conta para:', type);
    setAccountType(type);
    setEmail('');
    setSenha('');
    setMsg('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="login-page">
      <section className='form-container'>
        <div className='header'>
          <img src="/Images/Logo.png" alt="Logo MedConnect" className="logo" />
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
              onClick={() => handleAccountTypeChange('profissional')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleAccountTypeChange('profissional')}
            >
              <div className="card-icon professional-icon"></div>
              <h3>Profissional</h3>
              <p>Busco oportunidades</p>
            </div>

            <div
              className={`account-type-card ${accountType === 'empresa' ? 'selected' : ''}`}
              onClick={() => handleAccountTypeChange('empresa')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleAccountTypeChange('empresa')}
            >
              <div className="card-icon company-icon"></div>
              <h3>Empresa</h3>
              <p>Contrato profissionais</p>
            </div>
          </div>

          <form className='form' onSubmit={handleLogin}>
            <div className='input-field'>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder='seu@email.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
                autoComplete="email"
              />
            </div>

            <div className='input-field password-field'>
              <label htmlFor="senha">Senha</label>
              <div className="password-input-container">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder='Sua senha'
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? ' 👀 ' : ' 👁︎ '}
                </button>
              </div>
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