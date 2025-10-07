import React, { useState, useEffect } from 'react';
import './index.scss';

const DashboardEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [activeTab, setActiveTab] = useState('vagas');
  const [showFormVaga, setShowFormVaga] = useState(false);

  // Dados do formulário de nova vaga
  const [novaVaga, setNovaVaga] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    localizacao: '',
    salario: '',
    modalidade: 'presencial'
  });

  useEffect(() => {
    // Verificar se a empresa está logada
    const empresaLogada = localStorage.getItem('empresaLogada');
    if (empresaLogada) {
      const empresaData = JSON.parse(empresaLogada);
      setEmpresa(empresaData);
      carregarVagas(empresaData.id_empresa);
    }
  }, []);

  const carregarVagas = async (idEmpresa) => {
    try {
      // Buscar vagas da empresa (você precisará criar esta rota)
      const response = await fetch(`/api/vagas/empresa/${idEmpresa}`);
      const vagasData = await response.json();
      setVagas(vagasData);
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
    }
  };

  const carregarCandidaturas = async (idVaga) => {
    try {
      const response = await fetch(`/api/inscricoes/vaga/${idVaga}`);
      const candidaturasData = await response.json();
      setCandidaturas(candidaturasData);
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
    }
  };

  const criarVaga = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...novaVaga,
          id_empresa: empresa.id_empresa
        }),
      });

      if (response.ok) {
        const vagaCriada = await response.json();
        setVagas([...vagas, vagaCriada]);
        setShowFormVaga(false);
        setNovaVaga({
          titulo: '',
          descricao: '',
          requisitos: '',
          localizacao: '',
          salario: '',
          modalidade: 'presencial'
        });
      }
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
    }
  };

  const atualizarStatusCandidatura = async (idCandidatura, novoStatus) => {
    try {
      const response = await fetch(`/api/inscricoes/${idCandidatura}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (response.ok) {
        // Atualizar lista de candidaturas
        carregarCandidaturas(candidaturas[0]?.id_vaga);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (!empresa) {
    return (
      <div className="dashboard-empresa">
        <div className="login-empresa">
          <h2>Login da Empresa</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const senha = formData.get('senha');

            try {
              const response = await fetch('/api/empresas/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
              });

              if (response.ok) {
                const data = await response.json();
                setEmpresa(data.empresa);
                localStorage.setItem('empresaLogada', JSON.stringify(data.empresa));
                carregarVagas(data.empresa.id_empresa);
              } else {
                alert('Credenciais inválidas');
              }
            } catch (error) {
              console.error('Erro no login:', error);
            }
          }}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="senha" placeholder="Senha" required />
            <button type="submit">Entrar</button>
            
            {/* Dados de demo para teste */}
            <div className="demo-credentials">
              <p><strong>Demo:</strong> empresa@demo.com / demo123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-empresa">
      <header className="dashboard-header">
        <div className="empresa-info">
          <h1>Dashboard - {empresa.nome}</h1>
          <p>{empresa.descricao}</p>
        </div>
        <button 
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('empresaLogada');
            setEmpresa(null);
          }}
        >
          Sair
        </button>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'vagas' ? 'active' : ''}
          onClick={() => setActiveTab('vagas')}
        >
          Minhas Vagas
        </button>
        <button 
          className={activeTab === 'candidaturas' ? 'active' : ''}
          onClick={() => setActiveTab('candidaturas')}
        >
          Candidaturas
        </button>
        <button 
          className={activeTab === 'perfil' ? 'active' : ''}
          onClick={() => setActiveTab('perfil')}
        >
          Perfil da Empresa
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'vagas' && (
          <div className="vagas-section">
            <div className="section-header">
              <h2>Minhas Vagas</h2>
              <button 
                className="btn-primary"
                onClick={() => setShowFormVaga(true)}
              >
                + Nova Vaga
              </button>
            </div>

            {showFormVaga && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Criar Nova Vaga</h3>
                  <form onSubmit={criarVaga}>
                    <input
                      type="text"
                      placeholder="Título da vaga"
                      value={novaVaga.titulo}
                      onChange={(e) => setNovaVaga({...novaVaga, titulo: e.target.value})}
                      required
                    />
                    <textarea
                      placeholder="Descrição da vaga"
                      value={novaVaga.descricao}
                      onChange={(e) => setNovaVaga({...novaVaga, descricao: e.target.value})}
                      required
                    />
                    <textarea
                      placeholder="Requisitos"
                      value={novaVaga.requisitos}
                      onChange={(e) => setNovaVaga({...novaVaga, requisitos: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Localização"
                      value={novaVaga.localizacao}
                      onChange={(e) => setNovaVaga({...novaVaga, localizacao: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Salário"
                      value={novaVaga.salario}
                      onChange={(e) => setNovaVaga({...novaVaga, salario: e.target.value})}
                    />
                    <select
                      value={novaVaga.modalidade}
                      onChange={(e) => setNovaVaga({...novaVaga, modalidade: e.target.value})}
                    >
                      <option value="presencial">Presencial</option>
                      <option value="remoto">Remoto</option>
                      <option value="hibrido">Híbrido</option>
                    </select>
                    <div className="modal-actions">
                      <button type="submit">Criar Vaga</button>
                      <button type="button" onClick={() => setShowFormVaga(false)}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="vagas-list">
              {vagas.map(vaga => (
                <div key={vaga.id_vaga} className="vaga-card">
                  <h3>{vaga.titulo}</h3>
                  <p>{vaga.descricao}</p>
                  <div className="vaga-info">
                    <span>📍 {vaga.localizacao}</span>
                    <span>💼 {vaga.modalidade}</span>
                    {vaga.salario && <span>💰 {vaga.salario}</span>}
                  </div>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setActiveTab('candidaturas');
                      carregarCandidaturas(vaga.id_vaga);
                    }}
                  >
                    Ver Candidaturas
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'candidaturas' && (
          <div className="candidaturas-section">
            <h2>Candidaturas Recebidas</h2>
            <div className="candidaturas-list">
              {candidaturas.map(candidatura => (
                <div key={candidatura.id_candidatura} className="candidatura-card">
                  <div className="candidato-info">
                    <h4>{candidatura.candidato_nome}</h4>
                    <p>{candidatura.candidato_email}</p>
                    <span className={`status ${candidatura.status}`}>
                      {candidatura.status}
                    </span>
                  </div>
                  <div className="candidatura-actions">
                    <select
                      value={candidatura.status}
                      onChange={(e) => atualizarStatusCandidatura(candidatura.id_candidatura, e.target.value)}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="recusado">Recusado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'perfil' && (
          <div className="perfil-section">
            <h2>Perfil da Empresa</h2>
            <div className="empresa-profile">
              <div className="profile-info">
                <h3>{empresa.nome}</h3>
                <p><strong>CNPJ:</strong> {empresa.cnpj}</p>
                <p><strong>Email:</strong> {empresa.email}</p>
                <p><strong>Endereço:</strong> {empresa.endereco}</p>
                <p><strong>Descrição:</strong> {empresa.descricao}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardEmpresa;