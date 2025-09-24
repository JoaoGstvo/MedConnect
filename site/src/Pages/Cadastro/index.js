import './index.scss';
import { useState } from 'react';

function Signup() {
  const [accountType, setAccountType] = useState('profissional'); // 'profissional' ou 'empresa'

  // Estados dos inputs do profissional
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [profissao, setProfissao] = useState("");
  const [crm, setCrm] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [especializacoes, setEspecializacoes] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmaSenha) {
      setMensagem("As senhas não conferem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/profissional/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_completo: nome,
          cpf,
          email,
          telefone,
          crm,
          especializacoes,
          senha
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMensagem("Cadastro realizado com sucesso!");
        // Limpar campos
        setNome(""); setCpf(""); setEmail(""); setTelefone("");
        setProfissao(""); setCrm(""); setEstado(""); setCidade("");
        setEspecializacoes(""); setSenha(""); setConfirmaSenha("");
      } else {
        setMensagem(data.erro || "Erro ao cadastrar");
      }
    } catch (err) {
      console.log(err);
      setMensagem("Erro no servidor");
    }
  };

  return (
    <main className="signup-page">
      <section className='form-container'>
        <div className='header'>
          <img src="/Images/Logo.png" alt="Logo" className="logo" />
        </div>

        <div className='divider'></div>

        <div className='form-content'>
          <h2>Tipo de Conta</h2>
          <p className='form-description'>Selecione o tipo de conta que deseja criar</p>

          <div className='account-type-options'>
            <div 
              className={`account-type-card ${accountType === 'profissional' ? 'selected' : ''}`}
              onClick={() => setAccountType('profissional')}
            >
              <h3>Profissional</h3>
              <p>Busco oportunidades</p>
            </div>

            <div 
              className={`account-type-card ${accountType === 'empresa' ? 'selected' : ''}`}
              onClick={() => setAccountType('empresa')}
            >
              <h3>Empresa</h3>
              <p>Presto serviços</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='form-grid'>
            {accountType === 'profissional' && (
              <>
                <div className='form-group'>
                  <label className='input-field'>
                    <span>Nome Completo</span>
                    <input type="text" placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>CPF</span>
                    <input type="text" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>E-mail</span>
                    <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Telefone</span>
                    <input type="tel" placeholder="(11) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Profissão</span>
                    <input type="text" placeholder="Sua profissão" value={profissao} onChange={(e) => setProfissao(e.target.value)} />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>CRM</span>
                    <input type="text" placeholder="123456" value={crm} onChange={(e) => setCrm(e.target.value)} />
                  </label>
                </div>

                <div className='form-group double-width'>
                  <label className='input-field'>
                    <span>Especializações</span>
                    <textarea placeholder="Descreva suas especializações..." rows="2" value={especializacoes} onChange={(e) => setEspecializacoes(e.target.value)} />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Senha</span>
                    <input type="password" placeholder="Crie uma senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Confirmar Senha</span>
                    <input type="password" placeholder="Repita a senha" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} required />
                  </label>
                </div>

                <div className='form-group full-width'>
                  <div className='terms-checkbox'>
                    <label>
                      <input type="checkbox" />
                      <span>Aceito os termos de uso e política de privacidade</span>
                    </label>
                  </div>
                </div>

                <button className='signup-button' type="submit">
                  Criar Conta Profissional
                </button>
                {mensagem && <p>{mensagem}</p>}
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

export default Signup;
