import pool from "../connection.js";

export async function createCurriculo(id_usuario, dadosCurriculo) {
    try {
        console.log('Dados recebidos no repository para criar currículo:', dadosCurriculo);
        
        const query = `
            INSERT INTO curriculos (
                id_usuario, nome_completo, email, telefone, endereco, 
                cidade, objetivo, resumo, formacao, experiencia, 
                habilidades, idiomas, arquivo_url, nome_arquivo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `;
        
        const values = [
            id_usuario,
            dadosCurriculo.nome_completo || null,
            dadosCurriculo.email || null,
            dadosCurriculo.telefone || null,
            dadosCurriculo.endereco || null,
            dadosCurriculo.cidade || null,
            dadosCurriculo.objetivo || null,
            dadosCurriculo.resumo || null,
            dadosCurriculo.formacao || null,
            dadosCurriculo.experiencia || null,
            dadosCurriculo.habilidades || null,
            dadosCurriculo.idiomas || null,
            dadosCurriculo.arquivo_url || null,
            dadosCurriculo.nome_arquivo || null
        ];

        console.log('Valores para inserção do currículo:', values);
        
        const result = await pool.query(query, values);
        console.log('Currículo criado com sucesso:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro detalhado no createCurriculo:', error);
        throw error;
    }
}

export async function getCurriculoByUsuario(id_usuario) {
    try {
        console.log(' Buscando currículo para o usuário:', id_usuario);
        const query = `
            SELECT * FROM curriculos 
            WHERE id_usuario = $1 
            ORDER BY data_criacao DESC 
            LIMIT 1
        `;
        const result = await pool.query(query, [id_usuario]);
        console.log(' Resultado da busca de currículo:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error(' Erro no getCurriculoByUsuario:', error);
        throw error;
    }
}

export async function updateCurriculo(id_curriculo, updates) {
    try {
        console.log('Atualizando currículo:', id_curriculo, updates);
        
        const allowedFields = [
            'nome_completo', 'email', 'telefone', 'endereco', 'cidade',
            'objetivo', 'resumo', 'formacao', 'experiencia', 
            'habilidades', 'idiomas', 'arquivo_url', 'nome_arquivo'
        ];
        
        const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
        
        if (fields.length === 0) {
            throw new Error('Nenhum campo válido para atualização');
        }
        
        const values = fields.map(field => updates[field]);
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        
        const query = `
            UPDATE curriculos 
            SET ${setClause}, data_atualizacao = CURRENT_TIMESTAMP
            WHERE id_curriculo = $1 
            RETURNING *
        `;
        
        console.log('Query de atualização:', query);
        console.log('Valores:', [id_curriculo, ...values]);
        
        const result = await pool.query(query, [id_curriculo, ...values]);
        
        if (result.rows.length === 0) {
            throw new Error('Currículo não encontrado para atualização');
        }
        
        console.log('Currículo atualizado com sucesso:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro detalhado no updateCurriculo:', error);
        throw error;
    }
}

export async function createOrUpdateCurriculo(id_usuario, dadosCurriculo) {
    try {
        // Primeiro verifica se já existe um currículo
        const curriculoExistente = await getCurriculoByUsuario(id_usuario);
        
        if (curriculoExistente) {
            // Se existe, atualiza
            return await updateCurriculo(curriculoExistente.id_curriculo, dadosCurriculo);
        } else {
            // Se não existe, cria novo
            return await createCurriculo(id_usuario, dadosCurriculo);
        }
    } catch (error) {
        console.error('Erro no createOrUpdateCurriculo:', error);
        throw error;
    }
}