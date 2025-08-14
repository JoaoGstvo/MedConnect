import './index.scss';

function Login() {
    return (
        <main className="login-page">
            <section className='form-container'>
                <div className='header'>
                    <img src="/Images/Logo.png" alt="" />
                    <p>Conectando Profissionais da Saúde.</p>
                </div>

                <div className='form'>
                    <label>
                        <span>Email</span>
                        <input type="text" placeholder='Digite seu usuário' />
                    </label>
                    <label>
                        <span>Senha</span>
                        <input type="password" placeholder='Digite sua senha' />
                    </label>
                </div>
            </section>
        </main>
    );
}

export default Login;