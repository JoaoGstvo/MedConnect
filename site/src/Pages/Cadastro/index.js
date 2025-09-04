import './index.scss';
import { useState } from 'react';

function Signup() {
  const [accountType, setAccountType] = useState('profissional'); // 'profissional' ou 'empresa'

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

          <div className='form-grid'>
            {accountType === 'profissional' ? (
              <>
                <div className='form-group'>
                  <label className='input-field'>
                    <span>Nome Completo</span>
                    <input type="text" placeholder="Seu nome completo" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>CPF</span>
                    <input type="text" placeholder="000.000.000-00" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>E-mail</span>
                    <input type="email" placeholder="seu@email.com" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Telefone</span>
                    <input type="tel" placeholder="(11) 99999-9999" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Profissão</span>
                    <input type="text" placeholder="Sua profissão" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>CRM</span>
                    <input type="text" placeholder="123456" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Estado</span>
                    <select>
                      <option value="">Selecione...</option>
                    </select>
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Cidade</span>
                    <select>
                      <option value="">Selecione...</option>
                    </select>
                  </label>
                </div>

                <div className='form-group double-width'>
                  <label className='input-field'>
                    <span>Especializações</span>
                    <textarea placeholder="Descreva suas especializações..." rows="2"></textarea>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className='form-group'>
                  <label className='input-field'>
                    <span>Razão Social</span>
                    <input type="text" placeholder="Nome da empresa" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>CNPJ</span>
                    <input type="text" placeholder="00.000.000/0000-00" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>E-mail</span>
                    <input type="email" placeholder="empresa@email.com" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Telefone</span>
                    <input type="tel" placeholder="(11) 99999-9999" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Responsável</span>
                    <input type="text" placeholder="Nome do responsável" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>CPF do Responsável</span>
                    <input type="text" placeholder="000.000.000-00" />
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Estado</span>
                    <select>
                      <option value="">Selecione...</option>
                    </select>
                  </label>
                </div>

                <div className='form-group'>
                  <label className='input-field'>
                    <span>Cidade</span>
                    <select>
                      <option value="">Selecione...</option>
                    </select>
                  </label>
                </div>

                <div className='form-group double-width'>
                  <label className='input-field'>
                    <span>Área de Atuação</span>
                    <textarea placeholder="Descreva a área de atuação da empresa..." rows="2"></textarea>
                  </label>
                </div>
              </>
            )}

            <div className='form-group'>
              <label className='input-field'>
                <span>Senha</span>
                <input type="password" placeholder="Crie uma senha" />
              </label>
            </div>

            <div className='form-group'>
              <label className='input-field'>
                <span>Confirmar Senha</span>
                <input type="password" placeholder="Repita a senha" />
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
          </div>

          <button className='signup-button'>
            Criar Conta {accountType === 'profissional' ? 'Profissional' : 'Empresa'}
          </button>

          <div className="login-redirect">
            Já tem uma conta? <a href="/login">Faça login</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Signup;