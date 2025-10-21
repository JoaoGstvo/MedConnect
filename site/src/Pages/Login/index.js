import './index.scss';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../../Components/Hooks/useCurrentUser';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [accountType, setAccountType] = useState('profissional');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { loginUser } = useCurrentUser();
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
      const result = await loginUser(email, senha);

      if (result.success) {
        toast.success('Login realizado com sucesso!', {
          autoClose: 2000,
          hideProgressBar: true
        });

        // Redirecionar após sucesso
        setTimeout(() => {
          // Redirecionar baseado no tipo de usuário
          if (result.data.tipo_usuario === 'empresa') {
            navigate('/dashboardempresa');
          } else {
            navigate('/meucurriculo');
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

  return (
    <main className="login-page">
      <section className='form-container'>
        <div className='header'>
          <img src="/Images/Logo.png" alt="Logo" />
        </div>

        <div className="divider"></div>

        <div className="form-content">
          <h2>Fazer Login</h2>
          <p className='form-description'>Selecione o tipo de conta e digite suas credenciais</p>

          <div className="account-type-options">
            <div
              className={`account-type-card ${accountType === 'profissional' ? 'selected' : ''}`}
              onClick={() => setAccountType('profissional')}
            >
              <div className="card-icon professional-icon"></div>
              <h3>Profissional</h3>
              <p>Busco oportunidades</p>
            </div>

            <div
              className={`account-type-card ${accountType === 'empresa' ? 'selected' : ''}`}
              onClick={() => setAccountType('empresa')}
            >
              <div className="card-icon company-icon"></div>
              <h3>Empresa</h3>
              <p>Contrato profissionais</p>
            </div>
          </div>

          <form className='form' onSubmit={handleLogin}>
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
              {loading ? '' : `Entrar como ${accountType === 'profissional' ? 'Profissional' : 'Empresa'}`}
            </button>

            {msg && (
              <p className={`login-msg ${msg.includes('Erro') ? 'error' : 'success'}`}>
                {msg}
              </p>
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