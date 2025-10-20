import './index.scss';
import Header from "../../../Components/Header/index.js";
import Footer from "../../../Components/Footer/index.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    const usuarioId = 1;

    useEffect(() => {
        carregarCurriculo();
    }, []);

    const carregarCurriculo = async () => {
        try {
            console.log('Carregando currículo...');
            const response = await fetch(`http://localhost:5000/api/curriculos/usuario/${usuarioId}`);
            
            console.log('Status da resposta:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Dados do currículo:', data);
                
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
                    
                    // Se existir URL do PDF, carregar
                    if (data.arquivo_url) {
                        setPdfUrl(data.arquivo_url);
                    }
                    
                    calcularProgresso(data);
                }
            } else {
                console.log('Nenhum currículo encontrado ou erro na resposta');
            }
        } catch (error) {
            console.error('Erro ao carregar currículo:', error);
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
        
        const novoData = { ...curriculoData, [name]: value };
        calcularProgresso(novoData);
    };

    const handleSalvarCurriculo = async () => {
        setSalvando(true);
        try {
            console.log('Salvando currículo...', curriculoData);
            
            let response;
            
            if (curriculoExistente && curriculoExistente.id_curriculo) {
                response = await fetch(`http://localhost:5000/api/curriculos/${curriculoExistente.id_curriculo}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(curriculoData)
                });
            } else {
                response = await fetch('http://localhost:5000/api/curriculos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_usuario: usuarioId,
                        ...curriculoData
                    })
                });
            }

            console.log('Status da resposta:', response.status);
            
            if (response.ok) {
                const resultado = await response.json();
                console.log('Currículo salvo com sucesso:', resultado);
                alert('Currículo salvo com sucesso!');
                
                await carregarCurriculo();
            } else {
                const errorText = await response.text();
                console.error('Resposta de erro:', errorText);
                
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.error || `Erro ${response.status}`);
                } catch (e) {
                    throw new Error(`Erro ${response.status}: ${errorText}`);
                }
            }
        } catch (error) {
            console.error('Erro ao salvar currículo:', error);
            alert(`Erro ao salvar currículo: ${error.message}`);
        } finally {
            setSalvando(false);
        }
    };

    // FUNÇÃO DE UPLOAD DE PDF
    const handleUploadPDF = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Verificar se é PDF
        if (file.type !== 'application/pdf') {
            alert('Por favor, selecione um arquivo PDF.');
            return;
        }

        // Verificar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('O arquivo deve ter no máximo 5MB.');
            return;
        }

        setCurriculoPDF(file);
        setUploadingPDF(true);

        try {
            const formData = new FormData();
            formData.append('curriculo_pdf', file);
            formData.append('id_usuario', usuarioId);

            console.log('Enviando PDF...', file.name);

            // Tenta diferentes endpoints para upload
            let response = await fetch('http://localhost:5000/api/curriculos', {
                method: 'POST',
                body: formData
            });

            // Se o endpoint não existir, tenta um alternativo
            if (!response.ok) {
                console.log('Tentando endpoint alternativo...');
                response = await fetch('http://localhost:5000/api/curriculos', {
                    method: 'POST',
                    body: formData
                });
            }

            if (response.ok) {
                const resultado = await response.json();
                console.log('PDF enviado com sucesso:', resultado);
                
                // Atualiza a URL do PDF
                if (resultado.arquivo_url) {
                    setPdfUrl(resultado.arquivo_url);
                }
                
                alert('Currículo PDF enviado com sucesso!');
                
                // Recarrega os dados
                await carregarCurriculo();
            } else {
                const errorText = await response.text();
                console.error('Erro no upload:', errorText);
                throw new Error('Erro ao enviar PDF. Verifique o console.');
            }
        } catch (error) {
            console.error('Erro ao enviar PDF:', error);
            alert(`Erro ao enviar PDF: ${error.message}`);
        } finally {
            setUploadingPDF(false);
        }
    };

    // FUNÇÃO PARA VISUALIZAR PDF
    const handleVisualizarPDF = () => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
        } else if (curriculoPDF) {
            // Se ainda não foi enviado, cria URL local
            const url = URL.createObjectURL(curriculoPDF);
            window.open(url, '_blank');
        } else {
            alert('Nenhum PDF disponível para visualização.');
        }
    };

    // FUNÇÃO PARA EXCLUIR PDF
    const handleExcluirPDF = async () => {
        if (!pdfUrl && !curriculoPDF) return;

        if (!window.confirm('Tem certeza que deseja excluir o currículo PDF?')) {
            return;
        }

        try {
            // Se temos um currículo existente, tenta excluir via API
            if (curriculoExistente && curriculoExistente.id_curriculo) {
                const response = await fetch(`http://localhost:5000/api/curriculos/${curriculoExistente.id_curriculo}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    console.log('PDF excluído com sucesso');
                }
            }

            // Limpa os estados locais
            setCurriculoPDF(null);
            setPdfUrl(null);
            
            // Reseta o input de arquivo
            const fileInput = document.getElementById('uploadPDF');
            if (fileInput) {
                fileInput.value = '';
            }
            
            alert('Currículo PDF excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir PDF:', error);
            // Fallback: apenas limpa o estado local
            setCurriculoPDF(null);
            setPdfUrl(null);
            alert('PDF removido localmente.');
        }
    };

    // FUNÇÃO PARA DOWNLOAD DO PDF
    const handleDownloadPDF = () => {
        if (pdfUrl) {
            // Cria um link temporário para download
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'curriculo.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (curriculoPDF) {
            // Download do arquivo local
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

    if (carregando) {
        return (
            <main className="meucurriculo">
                <Header />
                <div className="loading">Carregando currículo...</div>
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
            </section>

            <div className="curriculo-container">
                <div className="curriculo-content">
                    {/* SEÇÃO DE UPLOAD DE PDF */}
                    <div className="section pdf-section">
                        <div className="section-header">
                            <h2>Currículo em PDF</h2>
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
                            ></textarea>
                        </div>
                    </div>

                    {/* Formação */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Formação Acadêmica</h2>
                        </div>
                        <div className="section-body">
                            <textarea 
                                name="formacao"
                                placeholder="Graduação, instituição, ano de conclusão..."
                                value={curriculoData.formacao}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>

                    {/* Experiência */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Experiência Profissional</h2>
                        </div>
                        <div className="section-body">
                            <textarea 
                                name="experiencia"
                                placeholder="Empresa, cargo, período, atividades..."
                                value={curriculoData.experiencia}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>

                    {/* Habilidades */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Habilidades e Competências</h2>
                        </div>
                        <div className="section-body">
                            <textarea 
                                name="habilidades"
                                placeholder="Habilidades técnicas, soft skills..."
                                value={curriculoData.habilidades}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>

                    {/* Idiomas */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Idiomas</h2>
                        </div>
                        <div className="section-body">
                            <textarea 
                                name="idiomas"
                                placeholder="Idiomas e níveis de proficiência..."
                                value={curriculoData.idiomas}
                                onChange={handleInputChange}
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
                                {salvando ? 'Salvando...' : '💾 Salvar Currículo'}
                            </button>
                            {curriculoExistente && (
                                <p style={{textAlign: 'center', marginTop: '10px', color: '#666'}}>
                                    Currículo ID: {curriculoExistente.id_curriculo}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="curriculo-sidebar">
                    <h3>Preenchimento do currículo</h3>
                    <p>Falta pouco para completar seu currículo!</p>
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${progresso}%` }}></div>
                        </div>
                        <span>{progresso}%</span>
                    </div>

                    <div className="sidebar-links">
                        <a href="#" onClick={() => navigate('/minhasvagas')}>📋 Minhas Candidaturas</a>
                        <a href="#" onClick={() => navigate('/candidato')}>📊 Dashboard</a>
                    </div>
                </aside>
            </div>

            <Footer />
        </main>
    );
}

export default MeuCurriculo;