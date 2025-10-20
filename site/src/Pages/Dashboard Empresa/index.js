import React, { useState, useEffect } from 'react';
import './index.scss';
const DashboardEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [activeTab, setActiveTab] = useState('vagas');
  const [showFormVaga, setShowFormVaga] = useState(false);
  const [editingVaga, setEditingVaga] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalVagas: 0,
    totalCandidaturas: 0,
    candidaturasPendentes: 0
  });

  // Estados para o modal de currículo
  const [showCurriculoModal, setShowCurriculoModal] = useState(false);
  const [curriculoCandidato, setCurriculoCandidato] = useState(null);
  const [loadingCurriculo, setLoadingCurriculo] = useState(false);

  // Estados para edição do perfil
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [dadosPerfil, setDadosPerfil] = useState({
    nome: '',
    cnpj: '',
    email: '',
    endereco: '',
    descricao: '',
    logo: ''
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

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
    const empresaLogada = localStorage.getItem('empresaLogada');
    if (empresaLogada) {
      const empresaData = JSON.parse(empresaLogada);
      setEmpresa(empresaData);
      carregarVagas(empresaData.id_empresa);
      // Preencher dados do perfil
      setDadosPerfil({
        nome: empresaData.nome || '',
        cnpj: empresaData.cnpj || '',
        email: empresaData.email || '',
        endereco: empresaData.endereco || '',
        descricao: empresaData.descricao || '',
        logo: empresaData.logo || ''
      });
    }
  }, []);

  useEffect(() => {
    if (vagas.length > 0) {
      calcularEstatisticas();
    }
  }, [vagas, candidaturas]);

  const calcularEstatisticas = () => {
    const totalVagas = vagas.length;
    const totalCandidaturas = candidaturas.length;
    const candidaturasPendentes = candidaturas.filter(c => c.status === 'pendente').length;
    
    setStats({
      totalVagas,
      totalCandidaturas,
      candidaturasPendentes
    });
  };

  const carregarVagas = async (idEmpresa) => {
    try {
      setLoading(true); 
      setError('');
      const response = await fetch(`http://localhost:5000/api/vagas/empresa/${idEmpresa}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const vagasData = await response.json();
      setVagas(vagasData);
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      setError('Erro ao carregar vagas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarCandidaturas = async (idVaga = null) => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/inscricoes/vaga/';
      
      if (idVaga) {
        url += idVaga;
      } else {
        // Carrega todas as candidaturas da empresa
        const todasCandidaturas = [];
        for (const vaga of vagas) {
          const response = await fetch(`http://localhost:5000/api/inscricoes/vaga/${vaga.id_vaga}`);
          if (response.ok) {
            const candidaturasVaga = await response.json();
            todasCandidaturas.push(...candidaturasVaga);
          }
        }
        setCandidaturas(todasCandidaturas);
        return;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const candidaturasData = await response.json();
      setCandidaturas(candidaturasData);
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
      setError('Erro ao carregar candidaturas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Nova função para carregar currículo do candidato
  const carregarCurriculo = async (idUsuario) => {
    try {
      setLoadingCurriculo(true);
      setError('');
      
      const response = await fetch(`http://localhost:5000/api/curriculos/usuario/${idUsuario}`);
      
      if (!response.ok) {
        // Se não encontrar currículo, criar um objeto vazio
        if (response.status === 404) {
          setCurriculoCandidato({
            nome_completo: 'Currículo não disponível',
            email: '',
            telefone: '',
            endereco: '',
            cidade: '',
            objetivo: 'O candidato ainda não preencheu seu currículo.',
            resumo: '',
            formacao: '',
            experiencia: '',
            habilidades: '',
            idiomas: ''
          });
          return;
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const curriculoData = await response.json();
      setCurriculoCandidato(curriculoData);
    } catch (error) {
      console.error('Erro ao carregar currículo:', error);
      setError('Erro ao carregar currículo: ' + error.message);
      
      // Currículo padrão em caso de erro
      setCurriculoCandidato({
        nome_completo: 'Erro ao carregar currículo',
        email: '',
        telefone: '',
        endereco: '',
        cidade: '',
        objetivo: 'Não foi possível carregar as informações do currículo.',
        resumo: '',
        formacao: '',
        experiencia: '',
        habilidades: '',
        idiomas: ''
      });
    } finally {
      setLoadingCurriculo(false);
    }
  };

  const verCurriculoCandidato = async (candidatura) => {
    setShowCurriculoModal(true);
    await carregarCurriculo(candidatura.id_usuario);
  };

  // Função para fazer upload da logo
  const handleUploadLogo = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    // Validar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB.');
      return;
    }

    try {
      setUploadingLogo(true);
      setError('');

      // Converter imagem para Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;

        try {
          const response = await fetch(`http://localhost:5000/api/empresas/${empresa.id_empresa}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...dadosPerfil,
              logo: base64String
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ${response.status}`);
          }

          const empresaAtualizada = await response.json();
          setEmpresa(empresaAtualizada);
          setDadosPerfil({
            ...dadosPerfil,
            logo: base64String
          });
          localStorage.setItem('empresaLogada', JSON.stringify(empresaAtualizada));
          
        } catch (error) {
          console.error('Erro ao atualizar logo:', error);
          setError('Erro ao atualizar logo: ' + error.message);
        } finally {
          setUploadingLogo(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro no upload da logo:', error);
      setError('Erro no upload da logo: ' + error.message);
      setUploadingLogo(false);
    }
  };

  // Função para salvar alterações do perfil
  const salvarPerfil = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:5000/api/empresas/${empresa.id_empresa}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosPerfil),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const empresaAtualizada = await response.json();
      setEmpresa(empresaAtualizada);
      localStorage.setItem('empresaLogada', JSON.stringify(empresaAtualizada));
      setEditandoPerfil(false);
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const criarVaga = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:5000/api/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...novaVaga,
          id_empresa: empresa.id_empresa
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const vagaCriada = await response.json();
      setVagas([...vagas, vagaCriada]);
      setShowFormVaga(false);
      setEditingVaga(null);
      resetFormVaga();
      
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      setError('Erro ao criar vaga: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const editarVaga = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:5000/api/vagas/${editingVaga.id_vaga}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaVaga),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const vagaAtualizada = await response.json();
      setVagas(vagas.map(v => v.id_vaga === editingVaga.id_vaga ? vagaAtualizada : v));
      setShowFormVaga(false);
      setEditingVaga(null);
      resetFormVaga();
      
    } catch (error) {
      console.error('Erro ao editar vaga:', error);
      setError('Erro ao editar vaga: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const excluirVaga = async (idVaga) => {
    if (!window.confirm('Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:5000/api/vagas/${idVaga}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      setVagas(vagas.filter(v => v.id_vaga !== idVaga));
      
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
      setError('Erro ao excluir vaga: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatusCandidatura = async (idCandidatura, novoStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/inscricoes/${idCandidatura}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const candidaturaAtualizada = await response.json();
      setCandidaturas(candidaturas.map(c => 
        c.id_candidatura === idCandidatura ? candidaturaAtualizada : c
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setError('Erro ao atualizar status: ' + error.message);
    }
  };

  const abrirFormEdicao = (vaga) => {
    setEditingVaga(vaga);
    setNovaVaga({
      titulo: vaga.titulo,
      descricao: vaga.descricao,
      requisitos: vaga.requisitos || '',
      localizacao: vaga.localizacao,
      salario: vaga.salario || '',
      modalidade: vaga.modalidade
    });
    setShowFormVaga(true);
  };

  const resetFormVaga = () => {
    setNovaVaga({
      titulo: '',
      descricao: '',
      requisitos: '',
      localizacao: '',
      salario: '',
      modalidade: 'presencial'
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const senha = formData.get('senha');

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:5000/api/empresas/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Credenciais inválidas');
      }

      const data = await response.json();
      setEmpresa(data.empresa);
      localStorage.setItem('empresaLogada', JSON.stringify(data.empresa));
      carregarVagas(data.empresa.id_empresa);
      
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!empresa) {
    return (
      <div className="dashboard-empresa login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2>Acesse sua Conta</h2>
              <p>Entre no dashboard da sua empresa</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading">Carregando...</div>}
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  required 
                  defaultValue="empresa@demo.com"
                />
              </div>
              
              <div className="input-group">
                <input 
                  type="password" 
                  name="senha" 
                  placeholder="Senha" 
                  required 
                  defaultValue="demo123"
                />
              </div>
              
              <button type="submit" disabled={loading} className="btn-login">
                {loading ? 'Entrando...' : 'Entrar na Conta'}
              </button>
              
              <div className="demo-credentials">
                <p><strong>Demo:</strong> empresa@demo.com / demo123</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-empresa">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="empresa-info">
            <h1>Dashboard - {empresa.nome}</h1>
            <p>{empresa.descricao}</p>
          </div>
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('empresaLogada');
              setEmpresa(null);
              setVagas([]);
              setCandidaturas([]);
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeTab === 'vagas' ? 'active' : ''}`}
            onClick={() => setActiveTab('vagas')}
          >
             Minhas Vagas
          </button>
          <button 
            className={`nav-tab ${activeTab === 'candidaturas' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('candidaturas');
              carregarCandidaturas();
            }}
          >
             Candidaturas
          </button>
          <button 
            className={`nav-tab ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
             Perfil da Empresa
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading">Carregando...</div>}

          {/* Estatísticas Rápidas */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>{stats.totalVagas}</h3>
                <p>Vagas Ativas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalCandidaturas}</h3>
                <p>Total de Candidaturas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.candidaturasPendentes}</h3>
                <p>Candidaturas Pendentes</p>
              </div>
            </div>
          </div>

          {/* Vagas Section */}
          {activeTab === 'vagas' && (
            <section className="section vagas-section">
              <div className="section-header">
                <h2>Minhas Vagas</h2>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setEditingVaga(null);
                    resetFormVaga();
                    setShowFormVaga(true);
                  }}
                  disabled={loading}
                >
                  + Nova Vaga
                </button>
              </div>

              {/* Modal Nova/Edição Vaga */}
              {showFormVaga && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div className="modal-header">
                      <h3>{editingVaga ? 'Editar Vaga' : 'Criar Nova Vaga'}</h3>
                      <button 
                        className="close-btn"
                        onClick={() => {
                          setShowFormVaga(false);
                          setEditingVaga(null);
                          resetFormVaga();
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={editingVaga ? editarVaga : criarVaga} className="modal-form">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Título da vaga"
                          value={novaVaga.titulo}
                          onChange={(e) => setNovaVaga({...novaVaga, titulo: e.target.value})}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="form-group">
                        <textarea
                          placeholder="Descrição da vaga"
                          value={novaVaga.descricao}
                          onChange={(e) => setNovaVaga({...novaVaga, descricao: e.target.value})}
                          required
                          disabled={loading}
                          rows="4"
                        />
                      </div>
                      
                      <div className="form-group">
                        <textarea
                          placeholder="Requisitos (opcional)"
                          value={novaVaga.requisitos}
                          onChange={(e) => setNovaVaga({...novaVaga, requisitos: e.target.value})}
                          disabled={loading}
                          rows="3"
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Localização"
                            value={novaVaga.localizacao}
                            onChange={(e) => setNovaVaga({...novaVaga, localizacao: e.target.value})}
                            required
                            disabled={loading}
                          />
                        </div>
                        
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Salário (ex: R$ 3.000,00)"
                            value={novaVaga.salario}
                            onChange={(e) => setNovaVaga({...novaVaga, salario: e.target.value})}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <select
                          value={novaVaga.modalidade}
                          onChange={(e) => setNovaVaga({...novaVaga, modalidade: e.target.value})}
                          disabled={loading}
                        >
                          <option value="presencial">Presencial</option>
                          <option value="remoto">Remoto</option>
                          <option value="hibrido">Híbrido</option>
                        </select>
                      </div>
                      
                      <div className="modal-actions">
                        <button type="submit" disabled={loading} className="btn-primary">
                          {loading ? (editingVaga ? 'Salvando...' : 'Criando...') : (editingVaga ? 'Salvar Alterações' : 'Criar Vaga')}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowFormVaga(false);
                            setEditingVaga(null);
                            resetFormVaga();
                          }}
                          disabled={loading}
                          className="btn-secondary"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Lista de Vagas */}
              <div className="vagas-grid">
                {vagas.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>Nenhuma vaga criada ainda</h3>
                    <p>Comece criando sua primeira oportunidade</p>
                    <button 
                      className="btn-primary"
                      onClick={() => setShowFormVaga(true)}
                    >
                      Criar Primeira Vaga
                    </button>
                  </div>
                ) : (
                  vagas.map(vaga => (
                    <div key={vaga.id_vaga} className="vaga-card">
                      <div className="vaga-header">
                        <h3>{vaga.titulo}</h3>
                        <div className="vaga-status">
                          <span className={`status status-${vaga.status || 'aberta'}`}>
                            {vaga.status || 'aberta'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="vaga-descricao">{vaga.descricao}</p>
                      
                      <div className="vaga-detalhes">
                        <span className="detalhe localizacao">📍 {vaga.localizacao}</span>
                        <span className="detalhe modalidade">💼 {vaga.modalidade}</span>
                        {vaga.salario && <span className="detalhe salario">💰 {vaga.salario}</span>}
                      </div>
                      
                      <div className="vaga-footer">
                        <div className="vaga-info">
                          <span className="vaga-data">Publicada em {new Date(vaga.data_publicacao).toLocaleDateString()}</span>
                          <span className="vaga-candidaturas">
                            {vaga.total_candidaturas || 0} candidatura(s)
                          </span>
                        </div>
                        <div className="vaga-actions">
                          <button 
                            className="btn-secondary"
                            onClick={() => {
                              setActiveTab('candidaturas');
                              carregarCandidaturas(vaga.id_vaga);
                            }}
                          >
                            Ver Candidaturas
                          </button>
                          <button 
                            className="btn-edit"
                            onClick={() => abrirFormEdicao(vaga)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => excluirVaga(vaga.id_vaga)}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Candidaturas Section */}
          {activeTab === 'candidaturas' && (
            <section className="section candidaturas-section">
              <div className="section-header">
                <h2>Candidaturas Recebidas</h2>
                <div className="section-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => carregarCandidaturas()}
                  >
                    Atualizar
                  </button>
                </div>
              </div>

              <div className="candidaturas-filters">
                <div className="filter-group">
                  <label>Filtrar por vaga:</label>
                  <select onChange={(e) => e.target.value ? carregarCandidaturas(e.target.value) : carregarCandidaturas()}>
                    <option value="">Todas as vagas</option>
                    {vagas.map(vaga => (
                      <option key={vaga.id_vaga} value={vaga.id_vaga}>
                        {vaga.titulo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Filtrar por status:</label>
                  <select onChange={(e) => {
                    const filtered = candidaturas.filter(c => 
                      e.target.value === '' || c.status === e.target.value
                    );
                    setCandidaturas(filtered);
                  }}>
                    <option value="">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="recusado">Recusado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="candidaturas-list">
                {candidaturas.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <h3>Nenhuma candidatura recebida</h3>
                    <p>As candidaturas aparecerão aqui quando os profissionais se candidatarem às suas vagas</p>
                  </div>
                ) : (
                  candidaturas.map(candidatura => (
                    <div key={candidatura.id_candidatura} className="candidatura-card">
                      <div className="candidato-info">
                        <div className="candidato-avatar">
                          {candidatura.candidato_nome?.charAt(0) || 'U'}
                        </div>
                        <div className="candidato-detalhes">
                          <h4>{candidatura.candidato_nome}</h4>
                          <p>{candidatura.candidato_email}</p>
                          <div className="candidatura-meta">
                            <span className="vaga-titulo">Vaga: {candidatura.vaga_titulo}</span>
                            <span className="candidatura-data">
                              Candidatou-se em {new Date(candidatura.data_candidatura).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="candidatura-actions">
                        <select
                          value={candidatura.status}
                          onChange={(e) => atualizarStatusCandidatura(candidatura.id_candidatura, e.target.value)}
                          className={`status-select status-${candidatura.status}`}
                        >
                          <option value="pendente">Pendente</option>
                          <option value="aprovado">Aprovado</option>
                          <option value="recusado">Recusado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                        <button 
                          className="btn-primary"
                          onClick={() => verCurriculoCandidato(candidatura)}
                        >
                          📄 Ver Currículo
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Perfil Section */}
          {activeTab === 'perfil' && (
            <section className="section perfil-section">
              <div className="section-header">
                <h2>Perfil da Empresa</h2>
                {!editandoPerfil ? (
                  <button 
                    className="btn-primary"
                    onClick={() => setEditandoPerfil(true)}
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <button 
                    className="btn-secondary"
                    onClick={() => setEditandoPerfil(false)}
                  >
                    Cancelar
                  </button>
                )}
              </div>

              {!editandoPerfil ? (
                // Visualização do Perfil
                <div className="empresa-profile">
                  <div className="profile-header">
                    <div className="empresa-avatar">
                      {empresa.logo ? (
                        <img src={empresa.logo} alt={`Logo ${empresa.nome}`} className="logo-empresa" />
                      ) : (
                        <div className="empresa-avatar-inicial">
                          {empresa.nome?.charAt(0) || 'E'}
                        </div>
                      )}
                    </div>
                    <div className="empresa-titulo">
                      <h3>{empresa.nome}</h3>
                      <p>{empresa.descricao}</p>
                    </div>
                  </div>
                  
                  <div className="profile-detalhes">
                    <div className="detalhe-item">
                      <strong>CNPJ:</strong>
                      <span>{empresa.cnpj}</span>
                    </div>
                    <div className="detalhe-item">
                      <strong>Email:</strong>
                      <span>{empresa.email}</span>
                    </div>
                    <div className="detalhe-item">
                      <strong>Endereço:</strong>
                      <span>{empresa.endereco}</span>
                    </div>
                    <div className="detalhe-item full-width">
                      <strong>Descrição:</strong>
                      <span>{empresa.descricao}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Edição do Perfil
                <div className="empresa-profile">
                  <form onSubmit={salvarPerfil} className="perfil-form">
                    <div className="form-group">
                      <label>Logo da Empresa</label>
                      <div className="logo-upload-container">
                        <div className="logo-preview">
                          {dadosPerfil.logo ? (
                            <img src={dadosPerfil.logo} alt="Preview logo" />
                          ) : (
                            <div className="logo-placeholder">
                              <span>📷</span>
                              <p>Nenhuma logo selecionada</p>
                            </div>
                          )}
                        </div>
                        <div className="upload-controls">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadLogo}
                            className="file-input"
                            id="logo-upload"
                          />
                          <label htmlFor="logo-upload" className="btn-upload">
                            {uploadingLogo ? '📤 Enviando...' : '📷 Escolher Logo'}
                          </label>
                          <p className="upload-hint">PNG, JPG até 5MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Nome da Empresa *</label>
                        <input
                          type="text"
                          value={dadosPerfil.nome}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, nome: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CNPJ *</label>
                        <input
                          type="text"
                          value={dadosPerfil.cnpj}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, cnpj: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={dadosPerfil.email}
                        onChange={(e) => setDadosPerfil({...dadosPerfil, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Endereço *</label>
                      <input
                        type="text"
                        value={dadosPerfil.endereco}
                        onChange={(e) => setDadosPerfil({...dadosPerfil, endereco: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Descrição *</label>
                      <textarea
                        value={dadosPerfil.descricao}
                        onChange={(e) => setDadosPerfil({...dadosPerfil, descricao: e.target.value})}
                        rows="4"
                        placeholder="Descreva sua empresa, missão, valores..."
                        required
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditandoPerfil(false)}
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Modal de Visualização de Currículo */}
      {showCurriculoModal && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3>📄 Currículo do Candidato</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowCurriculoModal(false);
                  setCurriculoCandidato(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-content curriculo-content">
              {loadingCurriculo ? (
                <div className="loading">Carregando currículo...</div>
              ) : curriculoCandidato ? (
                <div className="curriculo-detalhes">
                  {/* ... (código do modal de currículo permanece igual) ... */}
                </div>
              ) : (
                <div className="error-message">
                  Não foi possível carregar o currículo do candidato.
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowCurriculoModal(false);
                  setCurriculoCandidato(null);
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEmpresa;