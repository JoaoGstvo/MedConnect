import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/index.js';
import './index.scss';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getTitle = () => {
    switch (type) {
      case 'success': return 'Sucesso!';
      case 'error': return 'Erro!';
      case 'warning': return 'Atenção!';
      default: return 'Informação';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <div className="toast-title">{getTitle()}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

const DashboardEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [activeTab, setActiveTab] = useState('vagas');
  const [showFormVaga, setShowFormVaga] = useState(false);
  const [editingVaga, setEditingVaga] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalVagas: 0,
    totalCandidaturas: 0,
    candidaturasPendentes: 0
  });

  const [showCurriculoModal, setShowCurriculoModal] = useState(false);
  const [curriculoCandidato, setCurriculoCandidato] = useState(null);
  const [loadingCurriculo, setLoadingCurriculo] = useState(false);

  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [dadosPerfil, setDadosPerfil] = useState({
    nome: '',
    cnpj: '',
    email: '',
    endereco: '',
    descricao: '',
    logo_url: '',
    telefone: '',
    cidade: '',
    estado: ''
  });

  const [novaVaga, setNovaVaga] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    localizacao: '',
    salario: '',
    modalidade: 'presencial',
    status: 'aberta'
  });

  const [toasts, setToasts] = useState([]);

  const navigate = useNavigate();

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message) => addToast(message, 'success', 4000);
  const showError = (message) => addToast(message, 'error', 6000);

  useEffect(() => {
    verificarAutenticacao();
  }, []);

  useEffect(() => {
    calcularEstatisticas();
  }, [vagas, candidaturas]);

  const verificarAutenticacao = () => {
    const empresaLogada = localStorage.getItem('empresaLogada');
    const userData = localStorage.getItem('user');

    if (empresaLogada) {
      try {
        const empresaData = JSON.parse(empresaLogada);
        const empresaInfo = empresaData.empresa || empresaData;
        const empresaId = empresaInfo.id_empresa;

        if (!empresaId) {
          navigate('/login');
          return;
        }

        setEmpresa(empresaInfo);
        carregarVagas(empresaId);
        setDadosPerfil({
          nome: empresaInfo.nome || '',
          cnpj: empresaInfo.cnpj || '',
          email: empresaInfo.email || '',
          endereco: empresaInfo.endereco || '',
          descricao: empresaInfo.descricao || '',
          logo_url: empresaInfo.logo_url || '',
          telefone: empresaInfo.telefone || '',
          cidade: empresaInfo.cidade || '',
          estado: empresaInfo.estado || ''
        });
      } catch (error) {
        console.error('Erro ao parsear dados da empresa:', error);
        navigate('/login');
      }
    } else if (userData) {
      try {
        const user = JSON.parse(userData);
        const empresaId = user.id_empresa || (user.empresa && user.empresa.id_empresa);

        if (user.tipo_usuario === 'empresa' && empresaId) {
          const empresaInfo = user.empresa || user;
          setEmpresa(empresaInfo);
          carregarVagas(empresaId);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

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
      if (!idEmpresa || idEmpresa === 'undefined') {
        throw new Error('ID da empresa inválido');
      }

      const response = await fetch(`http://localhost:5000/api/vagas/empresa/${idEmpresa}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const vagasData = await response.json();
      setVagas(vagasData);
      showSuccess(`${vagasData.length} vagas carregadas com sucesso`);
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      showError('Erro ao carregar vagas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarCandidaturas = async (idVaga = null) => {
    try {
      setLoading(true);
      if (idVaga) {
        const response = await fetch(`http://localhost:5000/api/inscricoes/vaga/${idVaga}`);
        if (!response.ok) throw new Error('Erro ao carregar candidaturas');
        const candidaturasData = await response.json();
        setCandidaturas(candidaturasData);
      } else {
        const todasCandidaturas = [];
        for (const vaga of vagas) {
          const response = await fetch(`http://localhost:5000/api/inscricoes/vaga/${vaga.id_vaga}`);
          if (response.ok) {
            const candidaturasVaga = await response.json();
            todasCandidaturas.push(...candidaturasVaga.map(c => ({
              ...c,
              vaga_titulo: vaga.titulo
            })));
          }
        }
        setCandidaturas(todasCandidaturas);
      }
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
      showError('Erro ao carregar candidaturas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarCurriculo = async (idUsuario) => {
    try {
      setLoadingCurriculo(true);
      const response = await fetch(`http://localhost:5000/api/curriculos/usuario/${idUsuario}`);

      if (!response.ok) {
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
      showError('Erro ao carregar currículo: ' + error.message);
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

  const criarVaga = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!novaVaga.titulo || !novaVaga.descricao || !novaVaga.localizacao) {
        throw new Error('Título, descrição e localização são obrigatórios');
      }

      const empresaId = empresa.id_empresa;
      if (!empresaId) {
        throw new Error('ID da empresa não encontrado');
      }

      const vagaData = {
        id_empresa: empresaId,
        titulo: novaVaga.titulo.trim(),
        descricao: novaVaga.descricao.trim(),
        requisitos: novaVaga.requisitos?.trim() || '',
        localizacao: novaVaga.localizacao.trim(),
        salario: novaVaga.salario?.trim() || null,
        modalidade: novaVaga.modalidade,
        status: novaVaga.status
      };

      const response = await fetch('http://localhost:5000/api/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vagaData),
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
      showSuccess(`Vaga "${vagaCriada.titulo}" criada com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      showError('Erro ao criar vaga: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const editarVaga = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const vagaData = {
        titulo: novaVaga.titulo.trim(),
        descricao: novaVaga.descricao.trim(),
        requisitos: novaVaga.requisitos?.trim() || '',
        localizacao: novaVaga.localizacao.trim(),
        salario: novaVaga.salario?.trim() || null,
        modalidade: novaVaga.modalidade,
        status: novaVaga.status
      };

      const response = await fetch(`http://localhost:5000/api/vagas/${editingVaga.id_vaga}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vagaData),
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
      showSuccess(`Vaga "${vagaAtualizada.titulo}" atualizada com sucesso!`);
    } catch (error) {
      console.error('Erro ao editar vaga:', error);
      showError('Erro ao editar vaga: ' + error.message);
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
      const vagaParaExcluir = vagas.find(v => v.id_vaga === idVaga);
      const response = await fetch(`http://localhost:5000/api/vagas/${idVaga}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      setVagas(vagas.filter(v => v.id_vaga !== idVaga));
      showSuccess(`Vaga "${vagaParaExcluir?.titulo}" excluída com sucesso!`);
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
      showError('Erro ao excluir vaga: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatusCandidatura = async (idCandidatura, novoStatus) => {
    try {
      const candidatura = candidaturas.find(c => c.id_candidatura === idCandidatura);
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
      showSuccess(`Status da candidatura de ${candidatura?.candidato_nome} atualizado para ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showError('Erro ao atualizar status: ' + error.message);
    }
  };

  const abrirFormEdicao = (vaga) => {
    setEditingVaga(vaga);
    setNovaVaga({
      titulo: vaga.titulo || '',
      descricao: vaga.descricao || '',
      requisitos: vaga.requisitos || '',
      localizacao: vaga.localizacao || '',
      salario: vaga.salario || '',
      modalidade: vaga.modalidade || 'presencial',
      status: vaga.status || 'aberta'
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
      modalidade: 'presencial',
      status: 'aberta'
    });
  };

  const salvarPerfil = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const empresaId = empresa.id_empresa;
      if (!empresaId) {
        throw new Error('ID da empresa não encontrado');
      }

      const perfilData = {
        nome: dadosPerfil.nome.trim(),
        cnpj: dadosPerfil.cnpj.trim(),
        email: dadosPerfil.email.trim(),
        endereco: dadosPerfil.endereco.trim(),
        descricao: dadosPerfil.descricao.trim(),
        telefone: dadosPerfil.telefone?.trim() || '',
        cidade: dadosPerfil.cidade?.trim() || '',
        estado: dadosPerfil.estado?.trim() || '',
        logo_url: dadosPerfil.logo_url?.trim() || ''
      };

      const response = await fetch(`http://localhost:5000/api/empresas/${empresaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perfilData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const empresaAtualizada = await response.json();
      setEmpresa(empresaAtualizada);

      const empresaCompleta = {
        success: true,
        empresa: empresaAtualizada,
        message: 'Perfil atualizado com sucesso',
        tipo_usuario: 'empresa'
      };

      localStorage.setItem('empresaLogada', JSON.stringify(empresaCompleta));
      setEditandoPerfil(false);
      showSuccess('Perfil da empresa atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showError('Erro ao atualizar perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!empresa) {
    return (
      <div className="dashboard-empresa">
        <div className="loading-container">
          <div className="loading">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-empresa">
      <Header />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <header className="dashboard-header">
        <div className="header-content">
          <div className="empresa-info">
            <h1>Dashboard - {empresa.nome}</h1>
            <p>{empresa.descricao || 'Bem-vindo ao seu dashboard'}</p>
          </div>
        </div>
      </header>

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

      <main className="dashboard-main">
        <div className="container">
          {loading && <div className="loading">Carregando...</div>}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <h3>{stats.totalVagas}</h3>
                <p>Vagas Ativas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h3>{stats.totalCandidaturas}</h3>
                <p>Total Candidaturas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h3>{stats.candidaturasPendentes}</h3>
                <p>Candidaturas Pendentes</p>
              </div>
            </div>
          </div>

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
                  Nova Vaga
                </button>
              </div>

              {showFormVaga && (
                <div className="modal-overlay">
                  <div className="modal modal-large modal-vaga">
                    <div className="modal-header">
                      <h3>{editingVaga ? 'Editar Vaga' : 'Criar Nova Vaga'}</h3>
                      <button
                        className="close-btn"
                        onClick={() => {
                          setShowFormVaga(false);
                          setEditingVaga(null);
                          resetFormVaga();
                        }}
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>

                    <div className="modal-content">
                      <form onSubmit={editingVaga ? editarVaga : criarVaga} className="vaga-form">
                        <div className="form-body">
                          <div className="form-section">
                            <h4>Informações Básicas</h4>
                            <div className="form-grid-full">
                              <div className="form-group full-width">
                                <label>Título da Vaga *</label>
                                <input
                                  type="text"
                                  placeholder="Ex: Desenvolvedor Front-end Pleno"
                                  value={novaVaga.titulo}
                                  onChange={(e) => setNovaVaga({ ...novaVaga, titulo: e.target.value })}
                                  required
                                  disabled={loading}
                                  maxLength={100}
                                  className="full-width-input"
                                />
                              </div>

                              <div className="form-group full-width">
                                <label>Status da Vaga</label>
                                <select
                                  value={novaVaga.status}
                                  onChange={(e) => setNovaVaga({ ...novaVaga, status: e.target.value })}
                                  disabled={loading}
                                  className="full-width-input"
                                >
                                  <option value="aberta">Aberta</option>
                                  <option value="pausada">Pausada</option>
                                  <option value="fechada">Fechada</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="form-section">
                            <h4>Descrição da Vaga</h4>
                            <div className="form-group full-width">
                              <label>Descrição Detalhada *</label>
                              <textarea
                                placeholder="Descreva as responsabilidades, atividades, benefícios..."
                                value={novaVaga.descricao}
                                onChange={(e) => setNovaVaga({ ...novaVaga, descricao: e.target.value })}
                                required
                                disabled={loading}
                                maxLength={1000}
                                className="full-width-input"
                                rows="6"
                              />
                            </div>
                          </div>

                          <div className="form-section">
                            <h4>Requisitos e Qualificações</h4>
                            <div className="form-group full-width">
                              <label>Requisitos Técnicos</label>
                              <textarea
                                placeholder="Liste os requisitos técnicos, ferramentas, tecnologias..."
                                value={novaVaga.requisitos}
                                onChange={(e) => setNovaVaga({ ...novaVaga, requisitos: e.target.value })}
                                disabled={loading}
                                rows="4"
                                maxLength={500}
                                className="full-width-input"
                              />
                            </div>
                          </div>

                          <div className="form-section">
                            <h4>Localização e Condições</h4>
                            <div className="form-grid-full">
                              <div className="form-group full-width">
                                <label>Localização *</label>
                                <input
                                  type="text"
                                  placeholder="Ex: São Paulo, SP"
                                  value={novaVaga.localizacao}
                                  onChange={(e) => setNovaVaga({ ...novaVaga, localizacao: e.target.value })}
                                  required
                                  disabled={loading}
                                  className="full-width-input"
                                />
                              </div>

                              <div className="form-group full-width">
                                <label>Modalidade de Trabalho</label>
                                <select
                                  value={novaVaga.modalidade}
                                  onChange={(e) => setNovaVaga({ ...novaVaga, modalidade: e.target.value })}
                                  disabled={loading}
                                  className="full-width-input"
                                >
                                  <option value="presencial">Presencial</option>
                                  <option value="remoto">Remoto</option>
                                  <option value="hibrido">Híbrido</option>
                                </select>
                              </div>

                              <div className="form-group full-width">
                                <label>Salário</label>
                                <input
                                  type="text"
                                  placeholder="5.000,00"
                                  value={novaVaga.salario}
                                  onChange={(e) => setNovaVaga({ ...novaVaga, salario: e.target.value })}
                                  disabled={loading}
                                  className="full-width-input"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="modal-actions">
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
                          <button
                            type="submit"
                            disabled={loading || !novaVaga.titulo || !novaVaga.descricao || !novaVaga.localizacao}
                            className="btn-primary"
                          >
                            {loading ? 'Salvando...' : editingVaga ? 'Salvar Alterações' : 'Criar Vaga'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              <div className="vagas-grid">
                {vagas.length === 0 ? (
                  <div className="empty-state">
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
                        <span className="detalhe localizacao">{vaga.localizacao}</span>
                        <span className="detalhe modalidade">{vaga.modalidade}</span>
                        {vaga.salario && <span className="detalhe salario">{vaga.salario}</span>}
                      </div>

                      <div className="vaga-footer">
                        <div className="vaga-info">
                          <span className="vaga-data">Publicada em {new Date(vaga.data_publicacao).toLocaleDateString('pt-BR')}</span>
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

          {activeTab === 'candidaturas' && (
            <section className="section candidaturas-section">
              <div className="section-header">
                <h2>Candidaturas Recebidas</h2>
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
              </div>

              <div className="candidaturas-list">
                {candidaturas.length === 0 ? (
                  <div className="empty-state">
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
                          <h4>{candidatura.candidato_nome || 'Candidato'}</h4>
                          <p>{candidatura.candidato_email || 'Email não disponível'}</p>
                          <div className="candidatura-meta">
                            <span className="vaga-titulo">Vaga: {candidatura.vaga_titulo || 'Vaga não encontrada'}</span>
                            <span className="candidatura-data">
                              Candidatou-se em {new Date(candidatura.data_candidatura).toLocaleDateString('pt-BR')}
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
                          Ver Currículo
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

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
                <div className="empresa-profile">
                  <div className="profile-header">
                    <div className="empresa-avatar">
                      {empresa.logo_url ? (
                        <img src={empresa.logo_url} alt={`Logo ${empresa.nome}`} className="logo-empresa" />
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
                    <div className="detalhe-item">
                      <strong>Telefone:</strong>
                      <span>{empresa.telefone || 'Não informado'}</span>
                    </div>
                    <div className="detalhe-item">
                      <strong>Cidade/Estado:</strong>
                      <span>{empresa.cidade && empresa.estado ? `${empresa.cidade}/${empresa.estado}` : 'Não informado'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empresa-profile">
                  <form onSubmit={salvarPerfil} className="perfil-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nome da Empresa *</label>
                        <input
                          type="text"
                          value={dadosPerfil.nome}
                          onChange={(e) => setDadosPerfil({ ...dadosPerfil, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CNPJ *</label>
                        <input
                          type="text"
                          value={dadosPerfil.cnpj}
                          onChange={(e) => setDadosPerfil({ ...dadosPerfil, cnpj: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={dadosPerfil.email}
                        onChange={(e) => setDadosPerfil({ ...dadosPerfil, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Endereço *</label>
                      <input
                        type="text"
                        value={dadosPerfil.endereco}
                        onChange={(e) => setDadosPerfil({ ...dadosPerfil, endereco: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Telefone</label>
                        <input
                          type="text"
                          value={dadosPerfil.telefone}
                          onChange={(e) => setDadosPerfil({ ...dadosPerfil, telefone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Cidade</label>
                        <input
                          type="text"
                          value={dadosPerfil.cidade}
                          onChange={(e) => setDadosPerfil({ ...dadosPerfil, cidade: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Estado</label>
                      <input
                        type="text"
                        value={dadosPerfil.estado}
                        onChange={(e) => setDadosPerfil({ ...dadosPerfil, estado: e.target.value })}
                        maxLength="2"
                        placeholder="Ex: SP"
                      />
                    </div>

                    <div className="form-group">
                      <label>Descrição *</label>
                      <textarea
                        value={dadosPerfil.descricao}
                        onChange={(e) => setDadosPerfil({ ...dadosPerfil, descricao: e.target.value })}
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

      {showCurriculoModal && (
        <div className="modal-overlay">
          <div className="modal modal-large modal-curriculo">
            <div className="modal-header">
              <h3>Currículo do Candidato</h3>
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

            <div className="curriculo-content">
              {loadingCurriculo ? (
                <div className="loading-container">
                  <p>Carregando currículo...</p>
                </div>
              ) : curriculoCandidato ? (
                <>
                  <div className="curriculo-header">
                    <div className="candidato-info">
                      <div className="candidato-avatar">
                        {curriculoCandidato.nome_completo?.charAt(0) || 'C'}
                      </div>
                      <div className="candidato-detalhes">
                        <h4>{curriculoCandidato.nome_completo}</h4>
                        <div className="candidato-contato">
                          <span>{curriculoCandidato.email}</span>
                          <span>{curriculoCandidato.telefone || 'Telefone não informado'}</span>
                          <span>{curriculoCandidato.endereco || 'Endereço não informado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="curriculo-body">
                    <div className="curriculo-section">
                      <h4>Objetivo Profissional</h4>
                      <div className="text-content">
                        <p>{curriculoCandidato.objetivo || 'Objetivo não informado.'}</p>
                      </div>
                    </div>

                    {curriculoCandidato.formacao && (
                      <div className="curriculo-section">
                        <h4>Formação Acadêmica</h4>
                        <div className="text-content">
                          <p>{curriculoCandidato.formacao}</p>
                        </div>
                      </div>
                    )}

                    {curriculoCandidato.experiencia && (
                      <div className="curriculo-section">
                        <h4>Experiência Profissional</h4>
                        <div className="text-content">
                          <p>{curriculoCandidato.experiencia}</p>
                        </div>
                      </div>
                    )}

                    {curriculoCandidato.habilidades && (
                      <div className="curriculo-section">
                        <h4>Habilidades</h4>
                        <div className="skills-grid">
                          {curriculoCandidato.habilidades.split(',').map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <h3>Currículo não encontrado</h3>
                  <p>O candidato ainda não preencheu seu currículo.</p>
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