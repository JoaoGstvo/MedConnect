import './index.scss';

function Login() {
    return (
        <main className="login-page">
            <section className='form-container'>
                <div className='header'>
                    <img src="/Images/Logo.png" alt="" />
                </div>

                <div className='divider'></div>

                <div className='form'>
                    <h2>Fazer Login</h2>
                    <p className='form-description'>Digite suas credenciais para acessar sua conta</p>

                    <label className='input-field'>
                        <span>E-mail</span>
                        <input type="email" placeholder='seu@email.com' />
                    </label>

                    <label className='input-field'>
                        <span>Senha</span>
                        <input type="password" placeholder='Sua senha' />
                    </label>

                    <div className='remember-me'>
                        <label>
                            <input type="checkbox" />
                            <span>Lembrar de mim</span>
                        </label>
                        <a href="/" className='forgot-password'>Esqueceu a senha?</a>
                    </div>

                    <button className='login-button'>Entrar</button>

                    <div className="signup-redirect">
                        Não tem uma conta? <a href="/">Cadastre-se</a>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;