import './index.scss';
import Header from "../../../Components/Header/index.js";
import Footer from "../../../Components/Footer/index.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from '../../../Components/Hooks/useCurrentUser.js';

function MeuCurriculo() {
    const [curriculoData, setCurriculoData] = useState({
        nome_completo: '',
        email: '',
        telefone: '',
        endereco: '',
        cidade: '',
        objetivo: '',
        resumo: '',
        formacao: '',
        experiencia: '',
        habilidades: '',
        idiomas: ''
    });
    const [curriculoExistente, setCurriculoExistente] = useState(null);
    const [curriculoPDF, setCurriculoPDF] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [progresso, setProgresso] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [uploadingPDF, setUploadingPDF] = useState(false);
    const navigate = useNavigate();
    const { currentUser, loading: userLoading } = useCurrentUser();

    console.log('🔍 Estado do currentUser:', currentUser);
    console.log('🔍 Estado do userLoading:', userLoading);

    // Redirecionar se não estiver logado
    useEffect(() => {
        console.log('🔄 Verificando autenticação...');
        if (!userLoading && !currentUser) {
            console.log('❌ Usuário não logado, redirecionando para login');
            navigate('/login');
            return;
        }
        if (currentUser) {
            console.log('✅ Usuário logado:', currentUser);
        }
    }, [currentUser, userLoading, navigate]);

    useEffect(() => {
        if (currentUser && currentUser.id_usuario) {
            console.log('📥 Carregando currículo para usuário:', currentUser.id_usuario);
            carregarCurriculo();
        }
    }, [currentUser]);

    const carregarCurriculo = async () => {
        if (!currentUser || !currentUser.id_usuario) {
            console.log('⚠️ Não há usuário para carregar currículo');
            setCarregando(false);
            return;
        }
        
        try {
            console.log('🌐 Buscando currículo na API...');
            const response = await fetch(`http://localhost:5000/api/curriculos/usuario/${currentUser.id_usuario}`);
            
            console.log('📊 Status da resposta:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Dados do currículo carregados:', data);
                
                if (data && Object.keys(data).length > 0) {
                    setCurriculoExistente(data);
                    setCurriculoData({
                        nome_completo: data.nome_completo || '',
                        email: data.email || '',
                        telefone: data.telefone || '',
                        endereco: data.endereco || '',
                        cidade: data.cidade || '',
                        objetivo: data.objetivo || '',
                        resumo: data.resumo || '',
                        formacao: data.formacao || '',
                        experiencia: data.experiencia || '',
                        habilidades: data.habilidades || '',
                        idiomas: data.idiomas || ''
                    });
                    
                    if (data.arquivo_url) {
                        setPdfUrl(data.arquivo_url);
                    }
                    
                    calcularProgresso(data);
                } else {
                    console.log('ℹ️ Nenhum currículo encontrado, usando dados do usuário');
                    // Preencher com dados básicos do usuário
                    setCurriculoData(prev => ({
                        ...prev,
                        nome_completo: currentUser.nome || '',
                        email: currentUser.email || ''
                    }));
                }
            } else if (response.status === 404) {
                console.log('ℹ️ Nenhum currículo encontrado (404)');
                setCurriculoData(prev => ({
                    ...prev,
                    nome_completo: currentUser.nome || '',
                    email: currentUser.email || ''
                }));
            } else {
                console.log('❌ Erro ao buscar currículo:', response.status);
            }
        } catch (error) {
            console.error('💥 Erro ao carregar currículo:', error);
        } finally {
            setCarregando(false);
        }
    };

    const calcularProgresso = (data) => {
        const campos = [
            'nome_completo', 'email', 'telefone', 'objetivo', 
            'resumo', 'formacao', 'experiencia', 'habilidades'
        ];
        const preenchidos = campos.filter(campo => data[campo] && data[campo].trim() !== '').length;
        const progresso = Math.round((preenchidos / campos.length) * 100);
        setProgresso(progresso);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurriculoData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Calcular progresso em tempo real
        setTimeout(() => {
            calcularProgresso({...curriculoData, [name]: value});
        }, 100);
    };

    const handleSalvarCurriculo = async () => {
        if (!currentUser) {
            alert('Você precisa estar logado para salvar o currículo');
            navigate('/login');
            return;
        }

        setSalvando(true);
        try {
            console.log('💾 Salvando currículo...', curriculoData);
            
            let response;
            let resultado;
            
            if (curriculoExistente && curriculoExistente.id_curriculo) {
                // Atualizar currículo existente
                console.log('🔄 Atualizando currículo existente:', curriculoExistente.id_curriculo);
                response = await fetch(`http://localhost:5000/api/curriculos/${curriculoExistente.id_curriculo}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(curriculoData)
                });
            } else {
                // Criar novo currículo
                console.log('🆕 Criando novo currículo');
                response = await fetch('http://localhost:5000/api/curriculos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_usuario: currentUser.id_usuario,
                        ...curriculoData
                    })
                });
            }

            console.log('📊 Status da resposta do salvamento:', response.status);
            
            if (response.ok) {
                resultado = await response.json();
                console.log('✅ Currículo salvo com sucesso:', resultado);
                
                // Atualizar estado com o currículo salvo
                setCurriculoExistente(resultado);
                
                alert('✅ Currículo salvo com sucesso!');
                
                // Recarregar dados para garantir sincronização
                await carregarCurriculo();
            } else {
                const errorText = await response.text();
                console.error('❌ Resposta de erro:', errorText);
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('💥 Erro ao salvar currículo:', error);
            alert(`❌ Erro ao salvar currículo: ${error.message}`);
        } finally {
            setSalvando(false);
        }
    };

    // Restante das funções (upload PDF, visualizar, etc.) permanecem iguais
    const handleUploadPDF = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Por favor, selecione um arquivo PDF.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('O arquivo deve ter no máximo 5MB.');
            return;
        }

        setUploadingPDF(true);

        try {
            const formData = new FormData();
            formData.append('curriculo_pdf', file);
            formData.append('id_usuario', currentUser.id_usuario);

            console.log('📤 Enviando PDF...', file.name);

            const response = await fetch('http://localhost:5000/api/curriculos/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const resultado = await response.json();
                console.log('✅ PDF enviado com sucesso:', resultado);
                
                if (resultado.arquivo_url) {
                    setPdfUrl(resultado.arquivo_url);
                }
                
                alert('✅ Currículo PDF enviado com sucesso!');
                await carregarCurriculo();
            } else {
                const errorText = await response.text();
                console.error('❌ Erro no upload:', errorText);
                throw new Error('Erro ao enviar PDF');
            }
        } catch (error) {
            console.error('💥 Erro ao enviar PDF:', error);
            alert(`❌ Erro ao enviar PDF: ${error.message}`);
        } finally {
            setUploadingPDF(false);
        }
    };

    const handleVisualizarPDF = () => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
        } else if (curriculoPDF) {
            const url = URL.createObjectURL(curriculoPDF);
            window.open(url, '_blank');
        } else {
            alert('Nenhum PDF disponível para visualização.');
        }
    };

    const handleExcluirPDF = async () => {
        if (!pdfUrl && !curriculoPDF) return;

        if (!window.confirm('Tem certeza que deseja excluir o currículo PDF?')) {
            return;
        }

        try {
            if (curriculoExistente && curriculoExistente.id_curriculo) {
                const response = await fetch(`http://localhost:5000/api/curriculos/${curriculoExistente.id_curriculo}/pdf`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    console.log('✅ PDF excluído com sucesso');
                }
            }

            setCurriculoPDF(null);
            setPdfUrl(null);
            
            const fileInput = document.getElementById('uploadPDF');
            if (fileInput) {
                fileInput.value = '';
            }
            
            alert('✅ Currículo PDF excluído com sucesso!');
        } catch (error) {
            console.error('💥 Erro ao excluir PDF:', error);
            setCurriculoPDF(null);
            setPdfUrl(null);
            alert('PDF removido localmente.');
        }
    };

    const handleDownloadPDF = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'curriculo.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (curriculoPDF) {
            const url = URL.createObjectURL(curriculoPDF);
            const link = document.createElement('a');
            link.href = url;
            link.download = curriculoPDF.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            alert('Nenhum PDF disponível para download.');
        }
    };

    // Se estiver carregando o usuário OU o currículo
    if (userLoading || carregando) {
        return (
            <main className="meucurriculo">
                <Header />
                <div className="loading">
                    <div className="spinner"></div>
                    <p>{userLoading ? 'Verificando autenticação...' : 'Carregando seu currículo...'}</p>
                </div>
                <Footer />
            </main>
        );
    }

    // Se não há usuário logado (mesmo após o loading)
    if (!currentUser) {
        return (
            <main className="meucurriculo">
                <Header />
                <div className="loading">
                    <p>Redirecionando para login...</p>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="meucurriculo">
            <Header />

            <section className="curriculo-header">
                <h1>Meu Currículo</h1>
                <p>
                    <strong>Atenção:</strong> quando você se candidata a uma vaga, a empresa recebe um link para visualizar o seu currículo online. 
                    Tenha cuidado ao realizar modificações, pois todas as empresas terão acesso às alterações realizadas.
                </p>
                <div className="user-info-badge">
                    👤 Logado como: <strong>{currentUser.nome}</strong> ({currentUser.email}) | 
                    ID: {currentUser.id_usuario} | 
                    Tipo: {currentUser.tipo_usuario || 'candidato'}
                </div>
            </section>

            <div className="curriculo-container">
                <div className="curriculo-content">
                    {/* SEÇÃO DE UPLOAD DE PDF */}
                    <div className="section pdf-section">
                        <div className="section-header">
                            <h2>Currículo em PDF</h2>
                            <span className="section-badge optional">Opcional</span>
                        </div>
                        <div className="section-body">
                            {(pdfUrl || curriculoPDF) ? (
                                <div className="pdf-uploaded">
                                    <div className="pdf-info">
                                        <div className="pdf-icon">📄</div>
                                        <div className="pdf-details">
                                            <strong>Currículo PDF Carregado</strong>
                                            <span>
                                                {curriculoPDF ? curriculoPDF.name : 'Arquivo do servidor'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pdf-actions">
                                        <button 
                                            className="btn-pdf visualizar"
                                            onClick={handleVisualizarPDF}
                                        >
                                            👁️ Visualizar
                                        </button>
                                        <button 
                                            className="btn-pdf download"
                                            onClick={handleDownloadPDF}
                                        >
                                            📥 Download
                                        </button>
                                        <button 
                                            className="btn-pdf excluir"
                                            onClick={handleExcluirPDF}
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pdf-upload-area">
                                    <div className="upload-placeholder">
                                        <div className="upload-icon">📤</div>
                                        <div className="upload-text">
                                            <strong>Enviar Currículo em PDF</strong>
                                            <span>Arraste ou clique para enviar um arquivo PDF</span>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        id="uploadPDF"
                                        accept=".pdf"
                                        onChange={handleUploadPDF}
                                        className="file-input"
                                        disabled={uploadingPDF}
                                    />
                                    <label htmlFor="uploadPDF" className="upload-label">
                                        {uploadingPDF ? 'Enviando PDF...' : 'Selecionar Arquivo PDF'}
                                    </label>
                                    <div className="upload-info">
                                        <small>Tamanho máximo: 5MB • Formato: PDF</small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dados Pessoais */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Dados Pessoais</h2>
                            <span className="section-badge">Obrigatório</span>
                        </div>
                        <div className="section-body">
                            <input 
                                type="text" 
                                name="nome_completo"
                                placeholder="Nome completo" 
                                value={curriculoData.nome_completo}
                                onChange={handleInputChange}
                            />
                            <input 
                                type="email" 
                                name="email"
                                placeholder="E-mail" 
                                value={curriculoData.email}
                                onChange={handleInputChange}
                            />
                            <input 
                                type="tel" 
                                name="telefone"
                                placeholder="Telefone" 
                                value={curriculoData.telefone}
                                onChange={handleInputChange}
                            />
                            <input 
                                type="text" 
                                name="endereco"
                                placeholder="Endereço completo" 
                                value={curriculoData.endereco}
                                onChange={handleInputChange}
                            />
                            <input 
                                type="text" 
                                name="cidade"
                                placeholder="Cidade - Estado" 
                                value={curriculoData.cidade}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Objetivo */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Objetivo Profissional</h2>
                            <span className="section-badge">Obrigatório</span>
                        </div>
                        <div className="section-body">
                            <input 
                                type="text" 
                                name="objetivo"
                                placeholder="Cargo desejado" 
                                value={curriculoData.objetivo}
                                onChange={handleInputChange}
                            />
                            <textarea 
                                name="resumo"
                                placeholder="Resumo profissional e objetivos..."
                                value={curriculoData.resumo}
                                onChange={handleInputChange}
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    {/* Formação */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Formação Acadêmica</h2>
                            <span className="section-badge">Obrigatório</span>
                        </div>
                        <div className="section-body">
                            <textarea 
                                name="formacao"
                                placeholder="Graduação, instituição, ano de conclusão..."
                                value={curriculoData.formacao}
                                onChange={handleInputChange}
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    {/* Experiência */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Experiência Profissional</h2>
                            <span className="section-badge">Obrigatório</span>
                        </div>
                        <div className="section-body">
                            <textarea 
                                name="experiencia"
                                placeholder="Empresa, cargo, período, atividades..."
                                value={curriculoData.experiencia}
                                onChange={handleInputChange}
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    {/* Habilidades */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Habilidades e Competências</h2>
                            <span className="section-badge">Obrigatório</span>
                        </div>
                        <div className="section-body">
                            <textarea 
                                name="habilidades"
                                placeholder="Habilidades técnicas, soft skills..."
                                value={curriculoData.habilidades}
                                onChange={handleInputChange}
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    {/* Idiomas */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Idiomas</h2>
                            <span className="section-badge optional">Opcional</span>
                        </div>
                        <div className="section-body">
                            <textarea 
                                name="idiomas"
                                placeholder="Idiomas e níveis de proficiência..."
                                value={curriculoData.idiomas}
                                onChange={handleInputChange}
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    {/* Botão Salvar */}
                    <div className="section">
                        <div className="section-body">
                            <button 
                                className="edit-btn save-full"
                                onClick={handleSalvarCurriculo}
                                disabled={salvando}
                            >
                                {salvando ? '⏳ Salvando...' : '💾 Salvar Currículo'}
                            </button>
                            {curriculoExistente && (
                                <div className="curriculo-info">
                                    <p>📋 Currículo ID: {curriculoExistente.id_curriculo}</p>
                                    <p>🕒 Última atualização: {new Date(curriculoExistente.data_atualizacao).toLocaleDateString('pt-BR')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="curriculo-sidebar">
                    <div className="sidebar-card">
                        <h3>📊 Preenchimento do currículo</h3>
                        <p>Complete seu currículo para aumentar suas chances!</p>
                        <div className="progress-container">
                            <div className="progress-bar">
                                <div 
                                    className="progress" 
                                    style={{ width: `${progresso}%` }}
                                ></div>
                            </div>
                            <span className="progress-text">{progresso}% completo</span>
                        </div>

                        <div className="progress-tips">
                            <h4>💡 Dicas:</h4>
                            <ul>
                                <li>✅ Preencha todos os campos obrigatórios</li>
                                <li>📝 Seja específico em experiências</li>
                                <li>🎯 Destaque suas principais habilidades</li>
                                <li>📄 Adicione um PDF para impressionar</li>
                            </ul>
                        </div>
                    </div>

                    <div className="sidebar-links">
                        <h4>🚀 Ações Rápidas</h4>
                        <a href="#" onClick={() => navigate('/minhasvagas')}>
                            📋 Minhas Candidaturas
                        </a>
                        <a href="#" onClick={() => navigate('/vagas')}>
                            🔍 Buscar Vagas
                        </a>
                        <a href="#" onClick={() => navigate('/profissionalprofile')}>
                            👤 Meu Perfil
                        </a>
                        {currentUser?.tipo_usuario === 'empresa' && (
                            <a href="#" onClick={() => navigate('/dashboardempresa')}>
                                🏢 Dashboard Empresa
                            </a>
                        )}
                    </div>
                </aside>
            </div>

            <Footer />
        </main>
    );
}

export default MeuCurriculo;