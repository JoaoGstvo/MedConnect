// Pages/Vagas/inscrição/index.js - VERSÃO FINAL
import './index.scss';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useAuth } from '../../../Components/Hooks/useAuth';

function InscricaoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vaga, setVaga] = useState(null);
    const [curriculo, setCurriculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [etapa, setEtapa] = useState(1);
    const [usarCurriculoSalvo, setUsarCurriculoSalvo] = useState(true);
    const [curriculoPDF, setCurriculoPDF] = useState(null);
    
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Buscar dados da vaga
                const responseVaga = await fetch(`http://localhost:5000/api/vagas/${id}`);
                if (responseVaga.ok) {
                    const dataVaga = await responseVaga.json();
                    setVaga(dataVaga);
                } else {
                    console.error('Vaga não encontrada');
                }

                // Buscar currículo do usuário
                if (user?.id_usuario) {
                    const responseCurriculo = await fetch(`http://localhost:5000/api/curriculos/usuario/${user.id_usuario}`);
                    if (responseCurriculo.ok) {
                        const dataCurriculo = await responseCurriculo.json();
                        setCurriculo(dataCurriculo);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user]);

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
        
        if (!isAuthenticated || !user) {
            alert('Você precisa estar logado para se inscrever em vagas.');
            navigate('/login');
            return;
        }

        setEnviando(true);

        try {
            // Fazer inscrição
            const inscricaoResponse = await fetch('http://localhost:5000/api/inscricoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_vaga: parseInt(id),
                    id_usuario: user.id_usuario,
                    usar_curriculo_salvo: usarCurriculoSalvo
                })
            });

            if (!inscricaoResponse.ok) {
                const error = await inscricaoResponse.json();
                throw new Error(error.error || 'Erro ao realizar inscrição');
            }

            const resultado = await inscricaoResponse.json();
            
            if (resultado.dados_curriculo_incluidos) {
                navigate('/inscricaovagasucesso');
            }
        
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

    if (loading) {
        return (
            <main className='inscricaopage'>
                <Header />
                <div className="loading-page">Carregando...</div>
                <Footer />
            </main>
        );
    }

    if (!vaga) {
        return (
            <main className='inscricaopage'>
                <Header />
                <div className="error-page">Vaga não encontrada</div>
                <Footer />
            </main>
        );
    }

    return (
        <main className='inscricaopage'>
            <Header />

            <section className='hero-section'>
                <div className='container'>
                    <div className='hero-content'>
                        <h1>Inscreva-se na Vaga</h1>
                        <p>Revise seus dados e confirme sua candidatura</p>
                        
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
                        {/* Sidebar com detalhes da vaga */}
                        <div className='vaga-sidebar'>
                            <div className='vaga-card'>
                                <h3> Detalhes da Vaga</h3>
                                <div className='vaga-info'>
                                    <h2>{vaga.titulo}</h2>
                                    <p className='empresa'>{vaga.empresa_nome}</p>
                                    
                                    <div className='vaga-details'>
                                        <div className='detail-item'>
                                            <span>{vaga.localizacao}</span>
                                        </div>
                                        <div className='detail-item'>
                                            <span>{vaga.modalidade}</span>
                                        </div>
                                        {vaga.salario && (
                                            <div className='detail-item'>
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

                        {/* Formulário de inscrição */}
                        <div className='form-container'>
                            {etapa === 1 ? (
                                <div className='etapa-revisao'>
                                    <h2>Seus Dados de Candidatura</h2>
                                    <p className='subtitulo'>
                                        Revise as informações que serão enviadas para a empresa
                                    </p>

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

                                    {usarCurriculoSalvo && curriculo && (
                                        <div className='dados-curriculo'>
                                            <h3> Dados do seu Currículo</h3>
                                            
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
                                            </div>

                                            <div className='editar-curriculo'>
                                                <button 
                                                    onClick={() => navigate('/meucurriculo')}
                                                    className='btn-link'
                                                >
                                                    Editar meu currículo
                                                </button>
                                            </div>
                                        </div>
                                    )}

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
                                <div className='etapa-confirmacao'>
                                    <h2> Confirmar Candidatura</h2>
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
                                    </div>

                                    <div className='confirmacao-aviso'>
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
                                                ' Confirmar e Enviar Candidatura'
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