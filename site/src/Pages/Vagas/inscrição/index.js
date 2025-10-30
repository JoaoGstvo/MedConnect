// Pages/Vagas/inscrição/index.js - VERSÃO CORRIGIDA
import './index.scss';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useAuth } from '../../../Components/Hooks/useAuth';
import { toast } from 'react-toastify';

function InscricaoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isEmpresa, user, isAuthenticated } = useAuth();

    const [vaga, setVaga] = useState(null);
    const [curriculo, setCurriculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [etapa, setEtapa] = useState(1);
    const [usarCurriculoSalvo, setUsarCurriculoSalvo] = useState(true);
    const [inscricaoExistente, setInscricaoExistente] = useState(null);

    // Memoriza um flag de empresa para evitar depender da função isEmpresa diretamente no useEffect
    const isEmpresaFlag = useMemo(() => {
        try {
            // preferir checar pelo hook se disponível, senão checar pelo user
            if (typeof isEmpresa === 'function') return isEmpresa();
            return user?.tipo_usuario === 'empresa';
        } catch {
            return user?.tipo_usuario === 'empresa';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.tipo_usuario]); // apenas depende do tipo do usuário

    // BLOQUEAR acesso direto à página de inscrição para empresas (um useEffect leve)
    useEffect(() => {
        if (isEmpresaFlag) {
            toast.warning('Empresas não podem se candidatar a vagas.');
            navigate('/vagas');
        }
    }, [isEmpresaFlag, navigate]);

    // Extrai userId para dependência estável
    const userId = user?.id_usuario;

    useEffect(() => {
        // Guarda para cancelar requisições antigas
        const controller = new AbortController();
        const signal = controller.signal;

        // Se é empresa ou não tem id da vaga ainda, evita buscar
        if (isEmpresaFlag) {
            setLoading(false);
            return () => controller.abort();
        }
        if (!id) {
            setLoading(false);
            return () => controller.abort();
        }

        // Função que busca dados: vaga sempre, currículo e inscrições só se userId existir
        const fetchData = async () => {
            setLoading(true);
            try {
                // Buscar vaga
                const vagaResp = await fetch(`http://localhost:5000/api/vagas/${id}`, { signal });
                if (vagaResp.ok) {
                    const vagaData = await vagaResp.json();
                    if (!signal.aborted) setVaga(vagaData);
                } else {
                    console.error('Vaga não encontrada', vagaResp.status);
                    if (!signal.aborted) setVaga(null);
                }

                // Se não houver usuário logado ainda, não tenta pegar currículo/inscrições
                if (!userId) return;

                // Buscar currículo do usuário
                const currResp = await fetch(`http://localhost:5000/api/curriculos/usuario/${userId}`, { signal });
                if (currResp.ok) {
                    const currData = await currResp.json();
                    if (!signal.aborted) setCurriculo(currData);
                } else {
                    // limpa caso não tenha
                    if (!signal.aborted) setCurriculo(null);
                }

                // Buscar inscrições do usuário e verificar se já existe inscrição para essa vaga
                const inscResp = await fetch(`http://localhost:5000/api/inscricoes/usuario/${userId}`, { signal });
                if (inscResp.ok) {
                    const inscricoes = await inscResp.json();
                    const inscricaoAtual = inscricoes.find(i => i.id_vaga === parseInt(id, 10));
                    if (!signal.aborted) setInscricaoExistente(inscricaoAtual || null);
                } else {
                    if (!signal.aborted) setInscricaoExistente(null);
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    // fetch foi cancelado — não faz nada
                    return;
                }
                console.error('Erro ao buscar dados:', error);
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        };

        fetchData();

        // cleanup: cancela fetchs pendentes
        return () => {
            controller.abort();
        };
    }, [id, userId, isEmpresaFlag]); // dependências estáveis: id, userId e flag memorizada

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Proteção extra
        if (isEmpresaFlag) {
            toast.warning('Empresas não podem se candidatar a vagas.');
            return;
        }

        if (!isAuthenticated || !user) {
            toast.warning('Você precisa estar logado para se inscrever em vagas.');
            navigate('/login');
            return;
        }

        if (inscricaoExistente && inscricaoExistente.status !== 'cancelado') {
            toast.info('Você já possui uma candidatura ativa para esta vaga!');
            navigate(`/vaga/${id}`);
            return;
        }

        setEnviando(true);

        try {
            let inscricaoResponse;

            if (inscricaoExistente && inscricaoExistente.status === 'cancelado') {
                // Reativar inscrição (PUT para rota de status)
                inscricaoResponse = await fetch(`http://localhost:5000/api/inscricoes/${inscricaoExistente.id_candidatura}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'pendente' })
                });
            } else {
                // Criar inscrição nova
                inscricaoResponse = await fetch('http://localhost:5000/api/inscricoes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_vaga: parseInt(id, 10),
                        id_usuario: user.id_usuario,
                        usar_curriculo_salvo: usarCurriculoSalvo
                    })
                });
            }

            if (!inscricaoResponse.ok) {
                const errorData = await inscricaoResponse.json().catch(() => ({}));
                throw new Error(errorData.error || `Erro ${inscricaoResponse.status} ao realizar inscrição`);
            }

            // const resultado = await inscricaoResponse.json();
            navigate('/inscricaovagasucesso');
        } catch (error) {
            console.error('Erro:', error);
            if (error.message.includes('404')) {
                alert('Erro: Rota não encontrada. Entre em contato com o suporte.');
            } else if (error.message.includes('500')) {
                alert('Erro interno do servidor. Tente novamente mais tarde.');
            } else {
                alert(`Erro: ${error.message}`);
            }
        } finally {
            setEnviando(false);
        }
    };

    const avancarEtapa = () => {
        if (inscricaoExistente && inscricaoExistente.status !== 'cancelado') {
            toast.info('Você já possui uma candidatura ativa para esta vaga!');
            navigate(`/vaga/${id}`);
            return;
        }
        setEtapa(2);
    };

    const voltarEtapa = () => setEtapa(1);

    // Renderizações condicionais (mantive sua lógica)
    if (isEmpresaFlag) {
        return (
            <main className='inscricaopage'>
                <Header />
                <div className="error-page">
                    <div className="error-icon">🚫</div>
                    <h2>Acesso Restrito</h2>
                    <p>Empresas não podem se candidatar a vagas.</p>
                    <button className='btn-primary' onClick={() => navigate('/vagas')}>Voltar para Vagas</button>
                </div>
                <Footer />
            </main>
        );
    }

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

    const temInscricaoAtiva = inscricaoExistente && inscricaoExistente.status !== 'cancelado';
    const temInscricaoCancelada = inscricaoExistente && inscricaoExistente.status === 'cancelado';

    if (temInscricaoAtiva) {
        return (
            <main className='inscricaopage'>
                <Header />
                <div className="error-page">
                    <h2>Já Inscrito</h2>
                    <p>Você já possui uma candidatura ativa para esta vaga.</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button className='btn-primary' onClick={() => navigate(`/vaga/${id}`)}>Ver Detalhes da Vaga</button>
                        <button className='btn-secondary' onClick={() => navigate('/minhascandidaturas')}>Minhas Candidaturas</button>
                    </div>
                </div>
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
                        <h1>{temInscricaoCancelada ? 'Reinscrever-se na Vaga' : 'Inscreva-se na Vaga'}</h1>
                        <p>{temInscricaoCancelada ? 'Reative sua candidatura anteriormente cancelada' : 'Revise seus dados e confirme sua candidatura'}</p>
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
                        <div className='vaga-sidebar'>
                            <div className='vaga-card'>
                                <h3>Detalhes da Vaga</h3>
                                <div className='vaga-info'>
                                    <h2>{vaga.titulo}</h2>
                                    <p className='empresa'>{vaga.empresa_nome}</p>
                                    <div className='vaga-details'>
                                        <div className='detail-item'><span> {vaga.localizacao}</span></div>
                                        <div className='detail-item'><span> {vaga.modalidade}</span></div>
                                        {vaga.salario && <div className='detail-item'><span>R$ {vaga.salario}</span></div>}
                                    </div>
                                    {vaga.descricao && (
                                        <div className='vaga-descricao'>
                                            <h4>Sobre a vaga:</h4>
                                            <p>{vaga.descricao}</p>
                                        </div>
                                    )}
                                    {temInscricaoCancelada && (
                                        <div className="reinscricao-aviso">
                                            <p><strong>Candidatura anterior cancelada</strong></p>
                                            <small>Você está reativando sua candidatura nesta vaga</small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='form-container'>
                            {etapa === 1 ? (
                                <div className='etapa-revisao'>
                                    <h2>{temInscricaoCancelada ? 'Revisar Dados da Reinscrição' : 'Seus Dados de Candidatura'}</h2>
                                    <p className='subtitulo'>
                                        {temInscricaoCancelada ? 'Revise as informações que serão reenviadas para a empresa' : 'Revise as informações que serão enviadas para a empresa'}
                                    </p>

                                    {temInscricaoCancelada && (
                                        <div className='reinscricao-info'>
                                            <div className="info-message">
                                                <strong>Reinscrição</strong>
                                                <p>Sua candidatura anterior foi cancelada. Você está reativando sua candidatura.</p>
                                            </div>
                                        </div>
                                    )}

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
                                            {usarCurriculoSalvo ? 'Seus dados do currículo serão enviados automaticamente' : 'Apenas informações básicas serão enviadas'}
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
                                                <button onClick={() => navigate('/meucurriculo')} className='btn-link'>Editar meu currículo</button>
                                            </div>
                                        </div>
                                    )}

                                    <div className='actions'>
                                        <button type="button" className='btn-secondary' onClick={() => navigate(-1)}>← Voltar</button>
                                        <button type="button" className='btn-primary' onClick={avancarEtapa}>
                                            {temInscricaoCancelada ? 'Continuar para Reativação →' : 'Continuar para Confirmação →'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className='etapa-confirmacao'>
                                    <h2>{temInscricaoCancelada ? 'Confirmar Reinscrição' : 'Confirmar Candidatura'}</h2>
                                    <p className='subtitulo'>
                                        {temInscricaoCancelada ? 'Revise todas as informações antes de reativar sua candidatura' : 'Revise todas as informações antes de confirmar sua inscrição'}
                                    </p>

                                    <div className='resumo-candidatura'>
                                        <div className='resumo-item'><strong>Vaga:</strong> {vaga.titulo}</div>
                                        <div className='resumo-item'><strong>Empresa:</strong> {vaga.empresa_nome}</div>
                                        <div className='resumo-item'>
                                            <strong>Dados enviados:</strong>
                                            {usarCurriculoSalvo && curriculo ? ' Currículo completo + informações básicas' : ' Apenas informações básicas'}
                                        </div>
                                        {temInscricaoCancelada && (
                                            <div className='resumo-item'><strong>Tipo:</strong> Reinscrição (candidatura reativada)</div>
                                        )}
                                    </div>

                                    <div className='confirmacao-aviso'>
                                        <div className='aviso-text'>
                                            <strong>Importante:</strong>
                                            {temInscricaoCancelada
                                                ? ' Sua candidatura será reativada e voltará ao status "Pendente". Você poderá acompanhar o status na página "Minhas Candidaturas".'
                                                : ' Após a confirmação, sua candidatura será enviada e você poderá acompanhar o status na página "Minhas Candidaturas".'
                                            }
                                        </div>
                                    </div>

                                    <div className='actions'>
                                        <button type="button" className='btn-secondary' onClick={voltarEtapa}>← Voltar para Revisão</button>
                                        <button type="button" className='btn-primary' onClick={handleSubmit} disabled={enviando}>
                                            {enviando ? (
                                                <>
                                                    <div className='spinner'></div>
                                                    {temInscricaoCancelada ? 'Reativando...' : 'Enviando...'}
                                                </>
                                            ) : (
                                                temInscricaoCancelada ? ' Confirmar Reinscrição' : ' Confirmar e Enviar Candidatura'
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
