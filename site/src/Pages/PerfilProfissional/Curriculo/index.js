import './index.scss';
import Header from "../../../Components/Header/index.js";
import Footer from "../../../Components/Footer/index.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../Components/Hooks/useAuth.js';

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
    const [progresso, setProgresso] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const navigate = useNavigate();
    
    const { user: currentUser, isLoading: userLoading } = useAuth();

    console.log(' Estado do currentUser no MeuCurriculo:', currentUser);
    console.log(' Tipo do usuário:', currentUser?.tipo_usuario);

    useEffect(() => {
        console.log('Verificando autenticação no MeuCurriculo...');
        
        if (!userLoading) {
            if (!currentUser) {
                console.log('❌ Usuário não logado, redirecionando para login');
                navigate('/login');
                return;
            }
            
            if (currentUser.tipo_usuario === 'empresa') {
                console.log(' ACESSO NEGADO: Usuário é empresa, redirecionando para dashboard');
                setTimeout(() => {
                    navigate('/dashboardempresa', { replace: true });
                }, 100);
                return;
            }
            
            console.log('✅ Usuário candidato logado, pode acessar currículo');
        }
    }, [currentUser, userLoading, navigate]);

    useEffect(() => {
        if (currentUser && currentUser.id_usuario && currentUser.tipo_usuario !== 'empresa') {
            console.log(' Carregando currículo para usuário candidato:', currentUser.id_usuario);
            carregarCurriculo();
        }
    }, [currentUser]);

    const carregarCurriculo = async () => {
        if (!currentUser || !currentUser.id_usuario) {
            console.log(' Usuário não disponível para carregar currículo');
            setCarregando(false);
            return;
        }

        try {
            console.log(' Buscando currículo na API para usuário:', currentUser.id_usuario);
            const response = await fetch(`http://localhost:5000/api/curriculos/usuario/${currentUser.id_usuario}`);

            console.log(' Status da resposta:', response.status);

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

                    calcularProgresso(data);
                } else {
                    console.log(' Nenhum currículo encontrado, usando dados do usuário');
                    setCurriculoData(prev => ({
                        ...prev,
                        nome_completo: currentUser.nome || currentUser.nome_completo || '',
                        email: currentUser.email || ''
                    }));
                }
            } else if (response.status === 404) {
                console.log('Nenhum currículo encontrado (404)');
                setCurriculoData(prev => ({
                    ...prev,
                    nome_completo: currentUser.nome || currentUser.nome_completo || '',
                    email: currentUser.email || ''
                }));
            } else {
                console.log('❌ Erro ao buscar currículo:', response.status);
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

        setTimeout(() => {
            calcularProgresso({ ...curriculoData, [name]: value });
        }, 100);
    };

    const handleSalvarCurriculo = async () => {
        if (!currentUser || currentUser.tipo_usuario === 'empresa') {
            alert('Apenas candidatos podem salvar currículos');
            navigate('/login');
            return;
        }

        setSalvando(true);
        try {
            console.log(' Salvando currículo...', curriculoData);

            let response;
            let resultado;

            if (curriculoExistente && curriculoExistente.id_curriculo) {
                console.log(' Atualizando currículo existente:', curriculoExistente.id_curriculo);
                response = await fetch(`http://localhost:5000/api/curriculos/${curriculoExistente.id_curriculo}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(curriculoData)
                });
            } else {
                console.log(' Criando novo currículo');
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

            console.log(' Status da resposta do salvamento:', response.status);

            if (response.ok) {
                resultado = await response.json();
                console.log('✅ Currículo salvo com sucesso:', resultado);

                setCurriculoExistente(resultado);
                alert('✅ Currículo salvo com sucesso!');
                await carregarCurriculo();
            } else {
                const errorText = await response.text();
                console.error('❌ Resposta de erro:', errorText);
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao salvar currículo:', error);
            alert(`❌ Erro ao salvar currículo: ${error.message}`);
        } finally {
            setSalvando(false);
        }
    };

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

    if (!currentUser || currentUser.tipo_usuario === 'empresa') {
        return (
            <main className="meucurriculo">
                <Header />
                <div className="loading">
                    <p>Redirecionando...</p>
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
                    Bem vindo ao seu curriculo,  <>{currentUser.nome || currentUser.nome_completo}</>
                </div>
            </section>

            <div className="curriculo-container">
                <div className="curriculo-content">
                    {/* REMOVIDA A SEÇÃO DE PDF */}

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

                    <div className="section">
                        <div className="section-body">
                            <button
                                className="edit-btn save-full"
                                onClick={handleSalvarCurriculo}
                                disabled={salvando}
                            >
                                {salvando ? 'Salvando...' : 'Salvar Currículo'}
                            </button>
                            {curriculoExistente && (
                                <div className="curriculo-info">
                                    <p> Currículo De: {curriculoExistente.nome_completo}</p>
                                    <p> Última atualização: {new Date(curriculoExistente.data_atualizacao).toLocaleDateString('pt-BR')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="curriculo-sidebar">
                    <div className="sidebar-card">
                        <h3> Preenchimento do currículo</h3>
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
                    </div>

                    <div className="sidebar-links">
                        <h4> Ações Rápidas</h4>
                        <a href="" onClick={(e) => { e.preventDefault(); navigate('/minhasvagas'); }}>
                             Minhas Candidaturas
                        </a>
                        <a href="" onClick={(e) => { e.preventDefault(); navigate('/vagas'); }}>
                             Buscar Vagas
                        </a>
                    </div>
                </aside>
            </div>
                          
            <Footer />
        </main>
    );
}

export default MeuCurriculo;