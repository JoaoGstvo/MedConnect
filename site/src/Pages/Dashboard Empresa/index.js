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
    telefone: '',
    cidade: '',
    estado: '',
    descricao: '',
    logo_url: '' // Alterado para logo_url
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
      // Preencher dados do perfil com a estrutura correta
      setDadosPerfil({
        nome: empresaData.nome || '',
        cnpj: empresaData.cnpj || '',
        email: empresaData.email || '',
        endereco: empresaData.endereco || '',
        telefone: empresaData.telefone || '',
        cidade: empresaData.cidade || '',
        estado: empresaData.estado || '',
        descricao: empresaData.descricao || '',
        logo_url: empresaData.logo_url || '' // Alterado para logo_url
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
              logo_url: base64String // Alterado para logo_url
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
            logo_url: base64String // Alterado para logo_url
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

  // ... (mantenha as outras funções como criarVaga, editarVaga, excluirVaga, etc.)

  // No retorno do componente, atualize a parte do perfil para mostrar todos os campos:
  return (
    <div className="dashboard-empresa">
      {/* ... (header, navigation, main content, etc.) ... */}

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
                  <strong>Telefone:</strong>
                  <span>{empresa.telefone || 'Não informado'}</span>
                </div>
                <div className="detalhe-item">
                  <strong>Endereço:</strong>
                  <span>{empresa.endereco}</span>
                </div>
                <div className="detalhe-item">
                  <strong>Cidade:</strong>
                  <span>{empresa.cidade || 'Não informado'}</span>
                </div>
                <div className="detalhe-item">
                  <strong>Estado:</strong>
                  <span>{empresa.estado || 'Não informado'}</span>
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
                      {dadosPerfil.logo_url ? (
                        <img src={dadosPerfil.logo_url} alt="Preview logo" />
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

                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="text"
                      value={dadosPerfil.telefone}
                      onChange={(e) => setDadosPerfil({...dadosPerfil, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select
                      value={dadosPerfil.estado}
                      onChange={(e) => setDadosPerfil({...dadosPerfil, estado: e.target.value})}
                    >
                      <option value="">Selecione</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Cidade</label>
                  <input
                    type="text"
                    value={dadosPerfil.cidade}
                    onChange={(e) => setDadosPerfil({...dadosPerfil, cidade: e.target.value})}
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

      {/* ... (resto do componente) ... */}
    </div>
  );
};

export default DashboardEmpresa;