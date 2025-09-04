import './index.scss';
import { useState } from 'react';
// import BiometricLogin from '../../Components/Biometria';

function Login() {
  const [userType, setUserType] = useState('profissional'); // 'profissional' ou 'empresa'

  return (
    <main className="login-page">
      <section className='form-container'>
        <div className='header'>
          <img src="/Images/Logo.png" alt="" />
        </div>
        
        {/* Seletor de tipo de usuário */}
        <div className='user-type-selector'>
          <button 
            className={userType === 'profissional' ? 'active' : ''}
            onClick={() => setUserType('profissional')}
          >
            Profissional
          </button>
          <button 
            className={userType === 'empresa' ? 'active' : ''}
            onClick={() => setUserType('empresa')}
          >
            Empresa
          </button>
        </div>

        {/* <BiometricLogin /> */}
        <div className='divider'></div>

        <div className='form'>
          <h2>Fazer Login como {userType === 'profissional' ? 'Profissional' : 'Empresa'}</h2>
          <p className='form-description'>Digite suas credenciais para acessar sua conta</p>

          <label className='input-field'>
            <span>E-mail</span>
            <input type="email" placeholder='seu@email.com' />
          </label>

          <label className='input-field'>
            <span>Senha</span>
            <input type="password" placeholder='Sua senha' />
          </label>

          {/* Campo adicional para empresas */}
          {userType === 'empresa' && (
            <label className='input-field'>
              <span>CNPJ</span>
              <input type="text" placeholder='00.000.000/0000-00' />
            </label>
          )}

          <div className='remember-me'>
            <label>
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>
            <a href="/" className='forgot-password'>Esqueceu a senha?</a>
          </div>

          <button className='login-button'>Entrar</button>

          <div className="signup-redirect">
            Não tem uma conta? <a href="/">Cadastre-se como {userType === 'profissional' ? 'Profissional' : 'Empresa'}</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;