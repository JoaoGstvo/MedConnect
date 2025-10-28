import * as inscricaoRepository from '../Repository/inscricaoRepository.js';
import * as curriculoRepository from '../Repository/curriculoRepository.js';

export async function registerInscricaoController(req, res) {
    try {
        const { id_vaga, id_usuario, usar_curriculo_salvo = true } = req.body;
        
        console.log('Dados recebidos na inscrição:', { id_vaga, id_usuario, usar_curriculo_salvo });
        
        if (!id_vaga || !id_usuario) {
            return res.status(400).json({ error: 'ID da vaga e ID do usuário são obrigatórios' });
        }

        let dadosCurriculo = null;

        const buscarDadosProfissional = async (id_usuario) => {
            try {
                console.log('Buscando dados do profissional:', id_usuario);
                const query = 'SELECT * FROM profissionais WHERE id_profissional = $1';
                const result = await pool.query(query, [id_usuario]);
                
                if (result.rows.length > 0) {
                    console.log('✅ Dados do profissional encontrados:', result.rows[0]);
                    return result.rows[0];
                }
                
                console.log('❌ Profissional não encontrado na tabela profissionais');
                return null;
            } catch (error) {
                console.error('💥 Erro ao buscar dados do profissional:', error);
                return null;
            }
        };

        if (usar_curriculo_salvo) {
            try {
                console.log('Buscando currículo para usuário:', id_usuario);
                let curriculo = await curriculoRepository.getCurriculoByUsuario(id_usuario);
                
                if (!curriculo) {
                    console.log('❌ Nenhum currículo encontrado, buscando dados do profissional...');
                    const profissional = await buscarDadosProfissional(id_usuario);
                    
                    if (profissional) {
                        console.log('Dados do profissional encontrados:', profissional);
                        const curriculoBasico = {
                            nome_completo: profissional.nome || 'Usuário Demo',
                            email: profissional.email || 'demo@email.com',
                            telefone: profissional.telefone || null,
                            endereco: null,
                            cidade: profissional.cidade || null,
                            objetivo: `Profissional ${profissional.profissao || 'da área de saúde'} buscando novas oportunidades`,
                            resumo: profissional.descricao || `Profissional ${profissional.profissao || 'qualificado'} com experiência no mercado`,
                            formacao: profissional.profissao ? `Formação em ${profissional.profissao}` : null,
                            experiencia: null,
                            habilidades: null,
                            idiomas: null
                        };
                        
                        console.log(' Criando currículo automático:', curriculoBasico);
                        try {
                            curriculo = await curriculoRepository.createCurriculo(id_usuario, curriculoBasico);
                            console.log('✅ Currículo automático criado:', curriculo);
                        } catch (error) {
                            console.error('💥 Erro ao criar currículo automático:', error);
                        }
                    } else {
                        console.log('❌ Não foi possível encontrar dados do profissional');
                    }
                }
                
                if (curriculo) {
                    dadosCurriculo = {
                        nome_completo: curriculo.nome_completo,
                        email: curriculo.email,
                        telefone: curriculo.telefone,
                        endereco: curriculo.endereco,
                        cidade: curriculo.cidade,
                        objetivo: curriculo.objetivo,
                        resumo: curriculo.resumo,
                        formacao: curriculo.formacao,
                        experiencia: curriculo.experiencia,
                        habilidades: curriculo.habilidades,
                        idiomas: curriculo.idiomas,
                        arquivo_url: curriculo.arquivo_url
                    };
                    console.log('✅ Dados do currículo preparados:', dadosCurriculo);
                } else {
                    console.log('❌ Não foi possível obter dados do currículo');
                }
            } catch (error) {
                console.error('💥 Erro ao buscar/processar currículo:', error);
            }
        } else {
            console.log(' Usuário optou por não usar currículo salvo');
        }

        console.log('Criando inscrição com dados:', { id_vaga, id_usuario, dadosCurriculo });
        const inscricao = await inscricaoRepository.createInscricao(id_vaga, id_usuario, dadosCurriculo);
        
        res.status(201).json({
            message: dadosCurriculo 
                ? 'Inscrição realizada com sucesso usando dados do currículo!' 
                : 'Inscrição realizada com sucesso!',
            inscricao,
            dados_curriculo_incluidos: !!dadosCurriculo
        });
    } catch (error) {
        console.error('💥 Erro ao realizar inscrição:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getInscricoesByVagaController(req, res) {
    try {
        const { id_vaga } = req.params;
        const inscricoes = await inscricaoRepository.getInscricoesByVaga(id_vaga);
        res.json(inscricoes);
    } catch (error) {
        console.error('Erro ao buscar inscrições:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getInscricoesByUsuarioController(req, res) {
    try {
        const { id_usuario } = req.params;
        const inscricoes = await inscricaoRepository.getInscricoesByUsuario(id_usuario);
        res.json(inscricoes);
    } catch (error) {
        console.error('Erro ao buscar inscrições do usuário:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function updateStatusInscricaoController(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['pendente', 'aprovado', 'recusado', 'cancelado'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }
        
        const inscricao = await inscricaoRepository.updateStatusInscricao(id, status);
        
        if (!inscricao) {
            return res.status(404).json({ error: 'Inscrição não encontrada' });
        }
        
        res.json({
            message: 'Status da inscrição atualizado com sucesso',
            inscricao
        });
    } catch (error) {
        console.error('Erro ao atualizar status da inscrição:', error);
        res.status(500).json({ error: error.message });
    }
}