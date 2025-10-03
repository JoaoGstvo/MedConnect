import './index.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [accountType, setAccountType] = useState('profissional');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ type: '', text: '' });

  // Estados para profissional
  const [profissionalData, setProfissionalData] = useState({
    nome_completo: "",
    cpf: "",
    email: "",
    telefone: "",
    profissao: "",
    crm: "",
    especializacoes: "",
    senha: "",
    confirmaSenha: ""
  });

  // Estados para empresa
  const [empresaData, setEmpresaData] = useState({
    nome_empresa: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    descricao: "",
    senha: "",
    confirmaSenha: ""
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

  const showMensagem = (type, text) => {
    setMensagem({ type, text });
    setTimeout(() => setMensagem({ type: '', text: '' }), 5000);
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
    const { nome_completo, cpf, email, telefone, profissao, crm, especializacoes, senha, confirmaSenha } = profissionalData;

    if (senha !== confirmaSenha) {
      showMensagem('error', "❌ As senhas não conferem!");
      return;
    }

    if (!nome_completo || !cpf || !email || !senha) {
      showMensagem('error', "❌ Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const body = {
        nome_completo: nome_completo.trim(),
        cpf: cpf.trim(),
        email: email.trim(),
        telefone: telefone?.trim() || "",
        profissao: profissao?.trim() || "",
        crm: crm?.trim() || "",
        especializacoes: especializacoes?.trim() || "",
        senha: senha
      };

      console.log("📤 Enviando dados do profissional:", body);

      const response = await fetch("http://localhost:5000/api/profissional/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("📥 Resposta do servidor:", data);

      if (response.ok) {
        showMensagem('success', "🎉 Cadastro realizado com sucesso!");
        // Limpar formulário
        setProfissionalData({
          nome_completo: "", cpf: "", email: "", telefone: "",
          profissao: "", crm: "", especializacoes: "", senha: "", confirmaSenha: ""
        });
        // Redirecionar após sucesso
        setTimeout(() => navigate('/login'), 2000);
      } else {
        showMensagem('error', data.msg || data.erro || "❌ Erro ao cadastrar");
      }
    } catch (err) {
      console.error("❌ Erro no servidor:", err);
      showMensagem('error', "❌ Erro de conexão com o servidor");
    }
  };

  const handleEmpresaSubmit = async () => {
    const { nome_empresa, cnpj, email, telefone, endereco, descricao, senha, confirmaSenha } = empresaData;

    if (senha !== confirmaSenha) {
      showMensagem('error', "❌ As senhas não conferem!");
      return;
    }

    if (!nome_empresa || !cnpj || !email || !senha) {
      showMensagem('error', "❌ Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const body = {
        nome_empresa: nome_empresa.trim(),
        cnpj: cnpj.trim(),
        email: email.trim(),
        telefone: telefone?.trim() || "",
        endereco: endereco?.trim() || "",
        descricao: descricao?.trim() || "",
        senha: senha
      };

      console.log("📤 Enviando dados da empresa:", body);

      const response = await fetch("http://localhost:5000/api/empresa/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("📥 Resposta do servidor:", data);

      if (response.ok) {
        showMensagem('success', "🎉 Empresa cadastrada com sucesso!");
        // Limpar formulário
        setEmpresaData({
          nome_empresa: "", cnpj: "", email: "", telefone: "",
          endereco: "", descricao: "", senha: "", confirmaSenha: ""
        });
        // Redirecionar após sucesso
        setTimeout(() => navigate('/login'), 2000);
      } else {
        showMensagem('error', data.msg || data.erro || "❌ Erro ao cadastrar empresa");
      }
    } catch (err) {
      console.error("❌ Erro no servidor:", err);
      showMensagem('error', "❌ Erro de conexão com o servidor");
    }
  };

  return (
    <main className="signup-page">
      <section className="form-container">
        <div className="header">
          <img src="/Images/Logo.png" alt="Logo" className="logo" />
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
              <div className="card-icon">👨‍⚕️</div>
              <h3>Profissional</h3>
              <p>Busco oportunidades</p>
            </div>

            <div
              className={`account-type-card ${accountType === 'empresa' ? 'selected' : ''}`}
              onClick={() => setAccountType('empresa')}
            >
              <div className="card-icon">🏢</div>
              <h3>Empresa</h3>
              <p>Contrato profissionais</p>
            </div>
          </div>

          {/* Mensagem de Feedback */}
          {mensagem.text && (
            <div className={`mensagem-feedback ${mensagem.type}`}>
              {mensagem.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            {accountType === 'profissional' && (
              <>
                <div className='form-group'>
                  <label className='input-field'>
                    <span>👤 Nome Completo *</span>
                    <input 
                      type="text" 
                      name="nome_completo"
                      value={profissionalData.nome_completo}
                      onChange={handleProfissionalChange}
                      placeholder="Digite seu nome completo"
                      required 
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>🔢 CPF *</span>
                    <input 
                      type="text" 
                      name="cpf"
                      value={profissionalData.cpf}
                      onChange={handleProfissionalChange}
                      placeholder="000.000.000-00"
                      required 
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>📧 E-mail *</span>
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
                  <label className='input-field'>
                    <span>📞 Telefone</span>
                    <input 
                      type="tel" 
                      name="telefone"
                      value={profissionalData.telefone}
                      onChange={handleProfissionalChange}
                      placeholder="(11) 99999-9999"
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>💼 Profissão</span>
                    <input 
                      type="text" 
                      name="profissao"
                      value={profissionalData.profissao}
                      onChange={handleProfissionalChange}
                      placeholder="Sua profissão"
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>🏥 CRM/Registro</span>
                    <input 
                      type="text" 
                      name="crm"
                      value={profissionalData.crm}
                      onChange={handleProfissionalChange}
                      placeholder="Número do registro profissional"
                    />
                  </label>
                </div>

                <div className='form-group double-width'>
                  <label className='input-field'>
                    <span>🎯 Especializações</span>
                    <textarea 
                      name="especializacoes"
                      value={profissionalData.especializacoes}
                      onChange={handleProfissionalChange}
                      placeholder="Suas especializações e áreas de atuação..."
                      rows="3"
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>🔒 Senha *</span>
                    <input 
                      type="password" 
                      name="senha"
                      value={profissionalData.senha}
                      onChange={handleProfissionalChange}
                      placeholder="Crie uma senha segura"
                      required 
                      minLength={6}
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>🔒 Confirmar Senha *</span>
                    <input 
                      type="password" 
                      name="confirmaSenha"
                      value={profissionalData.confirmaSenha}
                      onChange={handleProfissionalChange}
                      placeholder="Digite a senha novamente"
                      required 
                    />
                  </label>
                </div>

                <div className='form-group full-width'>
                  <button 
                    className={`signup-button ${loading ? 'loading' : ''}`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? '⏳ Cadastrando...' : '🚀 Criar Conta Profissional'}
                  </button>
                </div>
              </>
            )}

            {accountType === 'empresa' && (
              <>
                <div className='form-group'>
                  <label className='input-field'>
                    <span>🏢 Nome da Empresa *</span>
                    <input 
                      type="text" 
                      name="nome_empresa"
                      value={empresaData.nome_empresa}
                      onChange={handleEmpresaChange}
                      placeholder="Razão social da empresa"
                      required 
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>🔢 CNPJ *</span>
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
                    <span>📧 E-mail *</span>
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

                <div className='form-group'>
                  <label className='input-field'>
                    <span>📞 Telefone</span>
                    <input 
                      type="tel" 
                      name="telefone"
                      value={empresaData.telefone}
                      onChange={handleEmpresaChange}
                      placeholder="(11) 99999-9999"
                    />
                  </label>
                </div>

                <div className='form-group double-width'>
                  <label className='input-field'>
                    <span>📍 Endereço</span>
                    <textarea 
                      name="endereco"
                      value={empresaData.endereco}
                      onChange={handleEmpresaChange}
                      placeholder="Endereço completo da empresa"
                      rows="2"
                    />
                  </label>
                </div>

                <div className='form-group double-width'>
                  <label className='input-field'>
                    <span>📝 Descrição da Empresa</span>
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
                  <label className='input-field'>
                    <span>🔒 Senha *</span>
                    <input 
                      type="password" 
                      name="senha"
                      value={empresaData.senha}
                      onChange={handleEmpresaChange}
                      placeholder="Crie uma senha segura"
                      required 
                      minLength={6}
                    />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>🔒 Confirmar Senha *</span>
                    <input 
                      type="password" 
                      name="confirmaSenha"
                      value={empresaData.confirmaSenha}
                      onChange={handleEmpresaChange}
                      placeholder="Digite a senha novamente"
                      required 
                    />
                  </label>
                </div>

                <div className='form-group full-width'>
                  <button 
                    className={`signup-button ${loading ? 'loading' : ''}`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? '⏳ Cadastrando...' : '🏢 Criar Conta Empresa'}
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