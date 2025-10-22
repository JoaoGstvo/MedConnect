import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/index.js';
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
    logo_url: '',
    telefone: '',
    cidade: '',
    estado: ''
  });

  // Dados do formulário de nova vaga
  const [novaVaga, setNovaVaga] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    localizacao: '',
    salario: '',
    modalidade: 'presencial'
  });

  const navigate = useNavigate();

  useEffect(() => {
    verificarAutenticacao();
  }, []);

  useEffect(() => {
    calcularEstatisticas();
  }, [vagas, candidaturas]);

  const verificarAutenticacao = () => {
    const empresaLogada = localStorage.getItem('empresaLogada');
    const userData = localStorage.getItem('user');
    
    console.log('🔍 Verificando autenticação...');
    console.log('🏢 Empresa logada no localStorage:', empresaLogada);
    
    if (empresaLogada) {
      try {
        const empresaData = JSON.parse(empresaLogada);
        console.log('✅ Dados completos da empresa:', empresaData);
        
        // CORREÇÃO: Acessar empresa.empresa.id_empresa
        const empresaInfo = empresaData.empresa || empresaData;
        const empresaId = empresaInfo.id_empresa;
        
        console.log('🏢 Informações da empresa:', empresaInfo);
        console.log('🆔 ID da empresa:', empresaId);
        
        if (!empresaId) {
          console.error('❌ ID da empresa não encontrado nos dados');
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
        console.error('❌ Erro ao parsear dados da empresa:', error);
        navigate('/login');
      }
    } else if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('👤 Usuário encontrado:', user);
        
        // CORREÇÃO: Verificar estrutura do usuário empresa
        const empresaId = user.id_empresa || (user.empresa && user.empresa.id_empresa);
        
        if (user.tipo_usuario === 'empresa' && empresaId) {
          console.log('✅ Usuário empresa encontrado:', user.nome);
          console.log('🆔 ID da empresa do usuário:', empresaId);
          
          const empresaInfo = user.empresa || user;
          setEmpresa(empresaInfo);
          carregarVagas(empresaId);
        } else {
          console.log('❌ Usuário não é empresa ou não tem ID');
          navigate('/login');
        }
      } catch (error) {
        console.error('❌ Erro ao parsear dados do usuário:', error);
        navigate('/login');
      }
    } else {
      console.log('❌ Nenhuma autenticação encontrada');
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
      setError('');
      console.log(`🔄 Carregando vagas para empresa ID: ${idEmpresa}`);
      
      if (!idEmpresa || idEmpresa === 'undefined') {
        throw new Error('ID da empresa inválido');
      }
      
      const response = await fetch(`http://localhost:5000/api/vagas/empresa/${idEmpresa}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const vagasData = await response.json();
      console.log(`✅ ${vagasData.length} vagas carregadas`);
      setVagas(vagasData);
    } catch (error) {
      console.error('❌ Erro ao carregar vagas:', error);
      setError('Erro ao carregar vagas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarCandidaturas = async (idVaga = null) => {
    try {
      setLoading(true);
      setError('');
      
      if (idVaga) {
        // Carrega candidaturas de uma vaga específica
        const response = await fetch(`http://localhost:5000/api/inscricoes/vaga/${idVaga}`);
        if (!response.ok) throw new Error('Erro ao carregar candidaturas');
        const candidaturasData = await response.json();
        setCandidaturas(candidaturasData);
      } else {
        // Carrega todas as candidaturas da empresa
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
      console.error('❌ Erro ao carregar candidaturas:', error);
      setError('Erro ao carregar candidaturas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarCurriculo = async (idUsuario) => {
    try {
      setLoadingCurriculo(true);
      setError('');
      
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
      console.error('❌ Erro ao carregar currículo:', error);
      setError('Erro ao carregar currículo: ' + error.message);
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
      setError('');
      
      // Validação dos campos obrigatórios
      if (!novaVaga.titulo || !novaVaga.descricao || !novaVaga.localizacao) {
        throw new Error('Título, descrição e localização são obrigatórios');
      }

      // CORREÇÃO: Acessar empresa.id_empresa corretamente
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
        modalidade: novaVaga.modalidade
      };

      console.log('📤 Enviando dados da vaga:', vagaData);

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
      
      console.log('✅ Vaga criada com sucesso:', vagaCriada.titulo);
    } catch (error) {
      console.error('❌ Erro ao criar vaga:', error);
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
      
      const vagaData = {
        titulo: novaVaga.titulo.trim(),
        descricao: novaVaga.descricao.trim(),
        requisitos: novaVaga.requisitos?.trim() || '',
        localizacao: novaVaga.localizacao.trim(),
        salario: novaVaga.salario?.trim() || null,
        modalidade: novaVaga.modalidade
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
      
      console.log('✅ Vaga atualizada com sucesso:', vagaAtualizada.titulo);
    } catch (error) {
      console.error('❌ Erro ao editar vaga:', error);
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
      console.log('🗑️ Vaga excluída com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao excluir vaga:', error);
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
      
      console.log(`✅ Status da candidatura atualizado para: ${novoStatus}`);
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
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

  const salvarPerfil = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // CORREÇÃO: Acessar empresa.id_empresa corretamente
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

      console.log('📤 Atualizando perfil:', perfilData);

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
      
      // CORREÇÃO: Atualizar localStorage com estrutura correta
      const empresaCompleta = {
        success: true,
        empresa: empresaAtualizada,
        message: 'Perfil atualizado com sucesso',
        tipo_usuario: 'empresa'
      };
      
      localStorage.setItem('empresaLogada', JSON.stringify(empresaCompleta));
      setEditandoPerfil(false);
      
      console.log('✅ Perfil atualizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil: ' + error.message);
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
      
      <header className="dashboard-header">
        <div className="header-content">
          <div className="empresa-info">
            <h1>Dashboard - {empresa.nome}</h1>
            <p>{empresa.descricao || 'Bem-vindo ao seu dashboard'}</p>
          </div>
          <div className="header-actions">
            <span className="empresa-status">👑 Conta Empresa</span>
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
            onClick={() => carregarCandidaturas()}
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
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError('')} style={{marginLeft: '10px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer'}}>
                ×
              </button>
            </div>
          )}
          
          {loading && <div className="loading">Carregando...</div>}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"></div>
              <div className="stat-info">
                <h3>{stats.totalVagas}</h3>
                <p>Vagas Ativas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"></div>
              <div className="stat-info">
                <h3>{stats.totalCandidaturas}</h3>
                <p>Total Candidaturas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"></div>
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
                  + Nova Vaga
                </button>
              </div>

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
                          placeholder="Título da vaga *"
                          value={novaVaga.titulo}
                          onChange={(e) => setNovaVaga({...novaVaga, titulo: e.target.value})}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="form-group">
                        <textarea
                          placeholder="Descrição da vaga *"
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
                            placeholder="Localização *"
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

              <div className="vagas-grid">
                {vagas.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon"></div>
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
                        <span className="detalhe modalidade">🏢 {vaga.modalidade}</span>
                        {vaga.salario && <span className="detalhe salario">💰 {vaga.salario}</span>}
                      </div>
                      
                      <div className="vaga-footer">
                        <div className="vaga-info">
                          <span className="vaga-data">Publicada em {new Date(vaga.data_publicacao).toLocaleDateString('pt-BR')}</span>
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
                    <div className="empty-icon"></div>
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
                          📄 Ver Currículo
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
                    <div className="detalhe-item full-width">
                      <strong>Descrição:</strong>
                      <span>{empresa.descricao}</span>
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

                    <div className="form-row">
                      <div className="form-group">
                        <label>Telefone</label>
                        <input
                          type="text"
                          value={dadosPerfil.telefone}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, telefone: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Cidade</label>
                        <input
                          type="text"
                          value={dadosPerfil.cidade}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, cidade: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Estado</label>
                      <input
                        type="text"
                        value={dadosPerfil.estado}
                        onChange={(e) => setDadosPerfil({...dadosPerfil, estado: e.target.value})}
                        maxLength="2"
                        placeholder="Ex: SP"
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
                  <div className="curriculo-section">
                    <h4>👤 Informações Pessoais</h4>
                    <div className="curriculo-grid">
                      <div className="info-item">
                        <strong>Nome Completo</strong>
                        <span>{curriculoCandidato.nome_completo}</span>
                      </div>
                      <div className="info-item">
                        <strong>Email</strong>
                        <span>{curriculoCandidato.email}</span>
                      </div>
                      <div className="info-item">
                        <strong>Telefone</strong>
                        <span>{curriculoCandidato.telefone}</span>
                      </div>
                      <div className="info-item">
                        <strong>Endereço</strong>
                        <span>{curriculoCandidato.endereco}</span>
                      </div>
                    </div>
                  </div>

                  <div className="curriculo-section">
                    <h4>🎯 Objetivo Profissional</h4>
                    <div className="text-content">
                      <p>{curriculoCandidato.objetivo}</p>
                    </div>
                  </div>

                  {curriculoCandidato.formacao && (
                    <div className="curriculo-section">
                      <h4>🎓 Formação Acadêmica</h4>
                      <div className="text-content">
                        <p>{curriculoCandidato.formacao}</p>
                      </div>
                    </div>
                  )}

                  {curriculoCandidato.experiencia && (
                    <div className="curriculo-section">
                      <h4>💼 Experiência Profissional</h4>
                      <div className="text-content">
                        <p>{curriculoCandidato.experiencia}</p>
                      </div>
                    </div>
                  )}

                  {curriculoCandidato.habilidades && (
                    <div className="curriculo-section">
                      <h4>🛠️ Habilidades</h4>
                      <div className="skills-grid">
                        {curriculoCandidato.habilidades.split(',').map((skill, index) => (
                          <span key={index} className="skill-tag">{skill.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
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