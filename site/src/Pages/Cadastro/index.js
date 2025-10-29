// Pages/Signup/index.js - VERSÃO ATUALIZADA
import './index.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Signup() {
  const [accountType, setAccountType] = useState('profissional');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para profissional
  const [profissionalData, setProfissionalData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    tipo_usuario: "candidato"
  });

  // Estados para empresa
  const [empresaData, setEmpresaData] = useState({
    nome: "",
    cnpj: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    endereco: "",
    descricao: "",
    telefone: "",
    cidade: "",
    estado: "",
    logo: ""
  });

  const navigate = useNavigate();

  const handleProfissionalChange = (e) => {
    const { name, value } = e.target;
    setProfissionalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (accountType === 'profissional') {
      await handleProfissionalSubmit();
    } else {
      await handleEmpresaSubmit();
    }
    setLoading(false);
  };

  const handleProfissionalSubmit = async () => {
    const { nome, email, senha, confirmaSenha } = profissionalData;

    if (senha !== confirmaSenha) {
      toast.error("As senhas não conferem!", {
      });
      return;
    }

    if (!nome || !email || !senha) {
      toast.error("Preencha todos os campos obrigatórios!", {
      });
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres", {
      });
      return;
    }

    try {
      const body = {
        nome: nome.trim(),
        email: email.trim(),
        senha: senha,
        tipo_usuario: "candidato"
      };

      console.log("Enviando dados do profissional:", body);

      const response = await fetch("http://localhost:5000/api/profissionais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      if (response.ok) {
        toast.success("Cadastro realizado com sucesso! Redirecionando para login...", {
        });

        setProfissionalData({
          nome: "", email: "", senha: "", confirmaSenha: "", tipo_usuario: "candidato"
        });

        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.error || "Erro ao cadastrar", {
          position: "top-right",
          autoClose: 4000
        });
      }
    } catch (err) {
      console.error("Erro no servidor:", err);
      toast.error("Erro de conexão com o servidor", {
        position: "top-right",
        autoClose: 4000
      });
    }
  };

  const handleEmpresaSubmit = async () => {
    const { nome, cnpj, email, senha, confirmaSenha, endereco, descricao, telefone, cidade, estado } = empresaData;

    if (senha !== confirmaSenha) {
      toast.error("As senhas não conferem!", {
        position: "top-right",
        autoClose: 4000
      });
      return;
    }

    if (!nome || !cnpj || !email || !senha) {
      toast.error("Preencha todos os campos obrigatórios!", {
        position: "top-right",
        autoClose: 4000
      });
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres", {
        position: "top-right",
        autoClose: 4000
      });
      return;
    }

    try {
      const body = {
        nome: nome.trim(),
        cnpj: cnpj.trim(),
        email: email.trim(),
        senha: senha,
        endereco: endereco?.trim() || "",
        descricao: descricao?.trim() || "",
        telefone: telefone?.trim() || "",
        cidade: cidade?.trim() || "",
        estado: estado?.trim() || ""
      };

      console.log("Enviando dados da empresa:", body);

      const response = await fetch("http://localhost:5000/api/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      if (response.ok) {
        toast.success("🏢 Empresa cadastrada com sucesso! Redirecionando para login...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });

        setEmpresaData({
          nome: "", cnpj: "", email: "", senha: "", confirmaSenha: "",
          endereco: "", descricao: "", telefone: "", cidade: "", estado: "", logo: ""
        });

        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.error || "Erro ao cadastrar empresa", {
          position: "top-right",
          autoClose: 4000
        });
      }
    } catch (err) {
      console.error("Erro no servidor:", err);
      toast.error("Erro de conexão com o servidor", {
        position: "top-right",
        autoClose: 4000
      });
    }
  };

  return (
    <main className="signup-page">
      <section className="form-container">
        <div className="header">
          <img src="/Images/Logo.png" alt="Logo MedConnect" className="logo" />
        </div>

        <div className="divider"></div>

        <div className="form-content">
          <h2>Criar Conta</h2>
          <p className="form-description">Selecione o tipo de conta que deseja criar</p>

          <div className="account-type-options">
            <div
              className={`account-type-card ${accountType === 'profissional' ? 'selected' : ''}`}
              onClick={() => setAccountType('profissional')}
            >
              <div className="card-icon professional-icon"></div>
              <h3>Profissional</h3>
              <p>Busco oportunidades de emprego</p>
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

          <form onSubmit={handleSubmit} className="form-grid">
            {accountType === 'profissional' && (
              <>
                <div className='form-group full-width'>
                  <label className='input-field'>
                    <span>Nome Completo *</span>
                    <input
                      type="text"
                      name="nome"
                      value={profissionalData.nome}
                      onChange={handleProfissionalChange}
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </label>
                </div>

                <div className='form-group full-width'>
                  <label className='input-field'>
                    <span>E-mail *</span>
                    <input
                      type="email"
                      name="email"
                      value={profissionalData.email}
                      onChange={handleProfissionalChange}
                      placeholder="seu@email.com"
                      required
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field password-field'>
                    <span>Senha *</span>
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="senha"
                        value={profissionalData.senha}
                        onChange={handleProfissionalChange}
                        placeholder="Crie uma senha segura"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('password')}
                      >
                        {showPassword ? '👀' : '👁'}
                      </button>
                    </div>
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field password-field'>
                    <span>Confirmar Senha *</span>
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmaSenha"
                        value={profissionalData.confirmaSenha}
                        onChange={handleProfissionalChange}
                        placeholder="Digite a senha novamente"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showConfirmPassword ? '👀' : '👁'}
                      </button>
                    </div>
                  </label>
                </div>

                <div className='form-group full-width'>
                  <button
                    className={`signup-button ${loading ? 'loading' : ''}`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Cadastrando...' : 'Criar Conta Profissional'}
                  </button>
                </div>
              </>
            )}

            {accountType === 'empresa' && (
              <>
                <div className='form-group full-width'>
                  <label className='input-field'>
                    <span>Nome da Empresa *</span>
                    <input
                      type="text"
                      name="nome"
                      value={empresaData.nome}
                      onChange={handleEmpresaChange}
                      placeholder="Razão social da empresa"
                      required
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>CNPJ *</span>
                    <input
                      type="text"
                      name="cnpj"
                      value={empresaData.cnpj}
                      onChange={handleEmpresaChange}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>E-mail *</span>
                    <input
                      type="email"
                      name="email"
                      value={empresaData.email}
                      onChange={handleEmpresaChange}
                      placeholder="empresa@email.com"
                      required
                    />
                  </label>
                </div>

                <div className='form-group full-width'>
                  <label className='input-field'>
                    <span>Endereço</span>
                    <input
                      type="text"
                      name="endereco"
                      value={empresaData.endereco}
                      onChange={handleEmpresaChange}
                      placeholder="Endereço completo da empresa"
                    />
                  </label>
                </div>

                <div className='form-group full-width'>
                  <label className='input-field'>
                    <span>Descrição da Empresa</span>
                    <textarea
                      name="descricao"
                      value={empresaData.descricao}
                      onChange={handleEmpresaChange}
                      placeholder="Descreva os serviços e especialidades da empresa..."
                      rows="3"
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field password-field'>
                    <span>Senha *</span>
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="senha"
                        value={empresaData.senha}
                        onChange={handleEmpresaChange}
                        placeholder="Crie uma senha segura"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('password')}
                      >
                        {showPassword ? '👀' : '👁︎'}
                      </button>
                    </div>
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field password-field'>
                    <span>Confirmar Senha *</span>
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmaSenha"
                        value={empresaData.confirmaSenha}
                        onChange={handleEmpresaChange}
                        placeholder="Digite a senha novamente"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showConfirmPassword ? '👀' : '👁︎'}
                      </button>
                    </div>
                  </label>
                </div>

                <div className='form-group full-width'>
                  <button
                    className={`signup-button ${loading ? 'loading' : ''}`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Cadastrando...' : 'Criar Conta Empresa'}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="login-link">
            <p>Já tem uma conta? <a href="/login">Faça login aqui</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Signup;