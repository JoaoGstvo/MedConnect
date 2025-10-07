import './index.scss';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";

function InscricaoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vaga, setVaga] = useState(null);
    const [curriculo, setCurriculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [etapa, setEtapa] = useState(1); // 1: Revisão, 2: Confirmação
    const [usarCurriculoSalvo, setUsarCurriculoSalvo] = useState(true);
    const [curriculoPDF, setCurriculoPDF] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Buscar vaga
                const responseVaga = await fetch(`http://localhost:5000/api/vagas/${id}`);
                if (responseVaga.ok) {
                    const dataVaga = await responseVaga.json();
                    setVaga(dataVaga);
                }

                // Buscar currículo do usuário
                const responseCurriculo = await fetch(`http://localhost:5000/api/curriculos/usuario/1`);
                if (responseCurriculo.ok) {
                    const dataCurriculo = await responseCurriculo.json();
                    setCurriculo(dataCurriculo);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setCurriculoPDF(file);
        } else {
            alert('Por favor, selecione um arquivo PDF.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);

        try {
            let curriculoPdfUrl = null;

            // Se o usuário enviou um novo PDF, faz o upload
            if (curriculoPDF) {
                const formData = new FormData();
                formData.append('curriculo_pdf', curriculoPDF);
                formData.append('id_usuario', 1);

                const uploadResponse = await fetch('http://localhost:5000/api/curriculos/upload', {
                    method: 'POST',
                    body: formData
                });

                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    curriculoPdfUrl = uploadResult.arquivo_url;
                }
            }

            // Fazer a inscrição
            const inscricaoResponse = await fetch('http://localhost:5000/api/inscricoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_vaga: parseInt(id),
                    id_usuario: 1,
                    usar_curriculo_salvo: usarCurriculoSalvo
                })
            });

            if (!inscricaoResponse.ok) {
                const error = await inscricaoResponse.json();
                throw new Error(error.error || 'Erro ao realizar inscrição');
            }

            const resultado = await inscricaoResponse.json();
            
            let mensagemSucesso = '🎉 Inscrição realizada com sucesso!';
            if (resultado.dados_curriculo_incluidos) {
                mensagemSucesso += '\n📄 Seus dados do currículo foram incluídos automaticamente!';
            }
            if (curriculoPdfUrl) {
                mensagemSucesso += '\n📎 Currículo em PDF anexado com sucesso!';
            }

            alert(mensagemSucesso);
            navigate('/minhas-vagas');
            
        } catch (error) {
            console.error('Erro:', error);
            alert(`Erro: ${error.message}`);
        } finally {
            setEnviando(false);
        }
    };

    const avancarEtapa = () => {
        setEtapa(2);
    };

    const voltarEtapa = () => {
        setEtapa(1);
    };

    if (loading) return <div className="loading-page">Carregando...</div>;
    if (!vaga) return <div className="error-page">Vaga não encontrada</div>;

    return (
        <main className='inscricaopage'>
            <Header />

            {/* Cabeçalho */}
            <section className='hero-section'>
                <div className='container'>
                    <div className='hero-content'>
                        <h1>Inscreva-se na Vaga</h1>
                        <p>Revise seus dados e confirme sua candidatura</p>
                        
                        {/* Progresso */}
                        <div className='progress-steps'>
                            <div className={`step ${etapa >= 1 ? 'active' : ''}`}>
                                <div className='step-number'>1</div>
                                <span>Revisar Dados</span>
                            </div>
                            <div className='step-line'></div>
                            <div className={`step ${etapa >= 2 ? 'active' : ''}`}>
                                <div className='step-number'>2</div>
                                <span>Confirmar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='section'>
                <div className='container'>
                    <div className='inscricao-grid'>
                        {/* Coluna da Esquerda - Informações da Vaga */}
                        <div className='vaga-sidebar'>
                            <div className='vaga-card'>
                                <h3>📋 Detalhes da Vaga</h3>
                                <div className='vaga-info'>
                                    <h2>{vaga.titulo}</h2>
                                    <p className='empresa'>{vaga.empresa_nome}</p>
                                    
                                    <div className='vaga-details'>
                                        <div className='detail-item'>
                                            <span className='icon'>📍</span>
                                            <span>{vaga.localizacao}</span>
                                        </div>
                                        <div className='detail-item'>
                                            <span className='icon'>💼</span>
                                            <span>{vaga.modalidade}</span>
                                        </div>
                                        {vaga.salario && (
                                            <div className='detail-item'>
                                                <span className='icon'>💰</span>
                                                <span>{vaga.salario}</span>
                                            </div>
                                        )}
                                    </div>

                                    {vaga.descricao && (
                                        <div className='vaga-descricao'>
                                            <h4>Sobre a vaga:</h4>
                                            <p>{vaga.descricao}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Coluna da Direita - Formulário */}
                        <div className='form-container'>
                            {etapa === 1 ? (
                                /* ETAPA 1: REVISÃO DE DADOS */
                                <div className='etapa-revisao'>
                                    <h2>📄 Seus Dados de Candidatura</h2>
                                    <p className='subtitulo'>
                                        Revise as informações que serão enviadas para a empresa
                                    </p>

                                    {/* Opção de usar currículo salvo */}
                                    <div className='opcao-curriculo'>
                                        <label className='checkbox-container'>
                                            <input
                                                type="checkbox"
                                                checked={usarCurriculoSalvo}
                                                onChange={(e) => setUsarCurriculoSalvo(e.target.checked)}
                                            />
                                            <span className='checkmark'></span>
                                            Usar dados do meu currículo salvo
                                        </label>
                                        <small>
                                            {usarCurriculoSalvo 
                                                ? 'Seus dados do currículo serão enviados automaticamente'
                                                : 'Apenas informações básicas serão enviadas'
                                            }
                                        </small>
                                    </div>

                                    {/* Dados do Currículo (se disponível e selecionado) */}
                                    {usarCurriculoSalvo && curriculo && (
                                        <div className='dados-curriculo'>
                                            <h3>📋 Dados do seu Currículo</h3>
                                            
                                            <div className='info-grid'>
                                                <div className='info-group'>
                                                    <label>Nome Completo</label>
                                                    <div className='info-value'>{curriculo.nome_completo || 'Não informado'}</div>
                                                </div>
                                                
                                                <div className='info-group'>
                                                    <label>E-mail</label>
                                                    <div className='info-value'>{curriculo.email || 'Não informado'}</div>
                                                </div>
                                                
                                                <div className='info-group'>
                                                    <label>Telefone</label>
                                                    <div className='info-value'>{curriculo.telefone || 'Não informado'}</div>
                                                </div>
                                                
                                                <div className='info-group'>
                                                    <label>Cidade</label>
                                                    <div className='info-value'>{curriculo.cidade || 'Não informado'}</div>
                                                </div>

                                                {curriculo.objetivo && (
                                                    <div className='info-group full-width'>
                                                        <label>Objetivo Profissional</label>
                                                        <div className='info-value'>{curriculo.objetivo}</div>
                                                    </div>
                                                )}

                                                {curriculo.resumo && (
                                                    <div className='info-group full-width'>
                                                        <label>Resumo Profissional</label>
                                                        <div className='info-value'>{curriculo.resumo}</div>
                                                    </div>
                                                )}

                                                {curriculo.formacao && (
                                                    <div className='info-group full-width'>
                                                        <label>Formação Acadêmica</label>
                                                        <div className='info-value'>{curriculo.formacao}</div>
                                                    </div>
                                                )}

                                                {curriculo.experiencia && (
                                                    <div className='info-group full-width'>
                                                        <label>Experiência Profissional</label>
                                                        <div className='info-value'>{curriculo.experiencia}</div>
                                                    </div>
                                                )}

                                                {curriculo.habilidades && (
                                                    <div className='info-group full-width'>
                                                        <label>Habilidades</label>
                                                        <div className='info-value'>{curriculo.habilidades}</div>
                                                    </div>
                                                )}

                                                {curriculo.idiomas && (
                                                    <div className='info-group full-width'>
                                                        <label>Idiomas</label>
                                                        <div className='info-value'>{curriculo.idiomas}</div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className='editar-curriculo'>
                                                <a href="/meucurriculo" className='btn-link'>
                                                     Editar meu currículo
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload de PDF adicional */}
                                    <div className='upload-section'>
                                        <h3>📎 Anexar Currículo em PDF (Opcional)</h3>
                                        <p>
                                            Você pode enviar um currículo em PDF para complementar sua candidatura. 
                                            Este arquivo será enviado junto com seus dados.
                                        </p>
                                        
                                        <div className='upload-area'>
                                            {curriculoPDF ? (
                                                <div className='file-selected'>
                                                    <div className='file-info'>
                                                        <span className='file-icon'>📄</span>
                                                        <div className='file-details'>
                                                            <strong>{curriculoPDF.name}</strong>
                                                            <span>{(curriculoPDF.size / 1024 / 1024).toFixed(2)} MB</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        type='button' 
                                                        className='btn-remove'
                                                        onClick={() => setCurriculoPDF(null)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='upload-placeholder'>
                                                    <input
                                                        type="file"
                                                        id="curriculoPDF"
                                                        accept=".pdf"
                                                        onChange={handleFileChange}
                                                        className='file-input'
                                                    />
                                                    <label htmlFor="curriculoPDF" className='upload-label'>
                                                        <div className='upload-icon'>📤</div>
                                                        <div className='upload-text'>
                                                            <strong>Clique para selecionar um arquivo PDF</strong>
                                                            <span>ou arraste e solte aqui</span>
                                                        </div>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        <small>Tamanho máximo: 5MB • Formato: PDF</small>
                                    </div>

                                    {/* Ações */}
                                    <div className='actions'>
                                        <button 
                                            type="button" 
                                            className='btn-secondary'
                                            onClick={() => navigate(-1)}
                                        >
                                            ← Voltar
                                        </button>
                                        <button 
                                            type="button" 
                                            className='btn-primary'
                                            onClick={avancarEtapa}
                                        >
                                            Continuar para Confirmação →
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* ETAPA 2: CONFIRMAÇÃO */
                                <div className='etapa-confirmacao'>
                                    <h2>✅ Confirmar Candidatura</h2>
                                    <p className='subtitulo'>
                                        Revise todas as informações antes de confirmar sua inscrição
                                    </p>

                                    <div className='resumo-candidatura'>
                                        <div className='resumo-item'>
                                            <strong>Vaga:</strong> {vaga.titulo}
                                        </div>
                                        <div className='resumo-item'>
                                            <strong>Empresa:</strong> {vaga.empresa_nome}
                                        </div>
                                        <div className='resumo-item'>
                                            <strong>Dados enviados:</strong> 
                                            {usarCurriculoSalvo && curriculo 
                                                ? ' Currículo completo + informações básicas'
                                                : ' Apenas informações básicas'
                                            }
                                        </div>
                                        {curriculoPDF && (
                                            <div className='resumo-item'>
                                                <strong>Arquivo anexado:</strong> {curriculoPDF.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className='confirmacao-aviso'>
                                        <div className='aviso-icon'>💡</div>
                                        <div className='aviso-text'>
                                            <strong>Importante:</strong> Após a confirmação, sua candidatura será enviada 
                                            e você poderá acompanhar o status na página "Minhas Candidaturas".
                                        </div>
                                    </div>

                                    <div className='actions'>
                                        <button 
                                            type="button" 
                                            className='btn-secondary'
                                            onClick={voltarEtapa}
                                        >
                                            ← Voltar para Revisão
                                        </button>
                                        <button 
                                            type="button" 
                                            className='btn-primary'
                                            onClick={handleSubmit}
                                            disabled={enviando}
                                        >
                                            {enviando ? (
                                                <>
                                                    <div className='spinner'></div>
                                                    Enviando...
                                                </>
                                            ) : (
                                                '✅ Confirmar e Enviar Candidatura'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default InscricaoPage;