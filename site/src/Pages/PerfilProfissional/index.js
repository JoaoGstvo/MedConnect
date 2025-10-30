import './index.scss';
import Header from "../../Components/Header/index.js";
import Footer from "../../Components/Footer/index.js";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { toast } from 'react-toastify';

function ProfissionalProfile() {
    const [formData, setFormData] = useState({
        nome: '',
        dataNascimento: '',
        cpf: '',
        email: '',
        telefone: '',
        cidade: '',
        profissao: '',
        registro: '',
        especializacoes: ''
    });
    
    const { currentUser } = useCurrentUser();
    const navigate = useNavigate();

    // Redirecionar se não estiver logado
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
    }, [currentUser, navigate]);

    // Carregar dados do usuário quando o componente montar
    useEffect(() => {
        if (currentUser) {
            carregarDadosUsuario();
        }
    }, [currentUser]);

    const carregarDadosUsuario = async () => {
        if (!currentUser) return;

        try {
            const response = await fetch(`http://localhost:5000/api/profissionais/${currentUser.id_usuario}`);
            if (response.ok) {
                const userData = await response.json();
                setFormData(prev => ({
                    ...prev,
                    nome: userData.nome || '',
                    email: userData.email || '',
                    // Adicione outros campos conforme necessário
                }));
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast.warning('Você precisa estar logado para atualizar o perfil');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/profissionais/${currentUser.id_usuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success('Perfil atualizado com sucesso!');
                // Recarregar dados atualizados
                await carregarDadosUsuario();
            } else {
                toast.error('Erro ao atualizar perfil');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            toast.error('Erro ao atualizar perfil');
        }
    };

    return (
        <>
            <Header />
            <main className="profissionalprofile-page">
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="header">
                        <h2>Meu Perfil Profissional</h2>
                        {currentUser && (
                            <div className="user-info">
                                Logado como: <strong>{currentUser.nome}</strong>
                            </div>
                        )}
                    </div>

                    <div className="divider"></div>

                    <div className="form-content">
                        <h3>Informações Pessoais</h3>
                        <p className="form-description">Atualize suas informações profissionais abaixo</p>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="input-field">
                                    <span>Nome Completo</span>
                                    <input
                                        type="text"
                                        name="nome"
                                        placeholder="Seu nome completo"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="input-field">
                                    <span>Data de Nascimento</span>
                                    <input
                                        type="date"
                                        name="dataNascimento"
                                        value={formData.dataNascimento}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="input-field">
                                    <span>CPF</span>
                                    <input
                                        type="text"
                                        name="cpf"
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="input-field">
                                    <span>E-mail</span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="seu@email.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="input-field">
                                    <span>Telefone</span>
                                    <input
                                        type="tel"
                                        name="telefone"
                                        placeholder="(11) 99999-9999"
                                        value={formData.telefone}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="input-field">
                                    <span>Cidade</span>
                                    <input
                                        type="text"
                                        name="cidade"
                                        placeholder="Sua cidade"
                                        value={formData.cidade}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="input-field">
                                    <span>Profissão</span>
                                    <select
                                        name="profissao"
                                        value={formData.profissao}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Selecione a profissão</option>
                                        <option value="Médico">Médico</option>
                                        <option value="Enfermeiro">Enfermeiro</option>
                                        <option value="Fisioterapeuta">Fisioterapeuta</option>
                                        <option value="Nutricionista">Nutricionista</option>
                                        <option value="Psicólogo">Psicólogo</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="input-field">
                                    <span>Registro Profissional</span>
                                    <input
                                        type="text"
                                        name="registro"
                                        placeholder="Ex: CRM, COREN..."
                                        value={formData.registro}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>

                            <div className="photo-upload">
                                <label htmlFor="photoInput">
                                    <div className="photo-placeholder">📷</div>
                                    <div className="upload-text">Adicionar Foto</div>
                                </label>
                                <input
                                    type="file"
                                    id="photoInput"
                                    accept="image/*"
                                />
                            </div>

                            <div className="form-group double-width">
                                <label className="input-field">
                                    <span>Especializações</span>
                                    <textarea
                                        name="especializacoes"
                                        placeholder="Ex: Cardiologia, UTI, Emergência..."
                                        rows="3"
                                        value={formData.especializacoes}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="buttons">
                            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                                Cancelar
                            </button>
                            <button type="submit" className="save-button">💾 Salvar Alterações</button>
                            <button type="button" className="voltar-button" onClick={() => navigate('/')}>
                                🏠 Voltar ao Início
                            </button>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </>
    );
}

export default ProfissionalProfile;