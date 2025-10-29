import pool from "../connection.js";

export async function createInscricao(id_vaga, id_usuario, dadosCurriculo = null) {
    try {
        console.log(' Criando inscrição com dados:', { id_vaga, id_usuario, dadosCurriculo });
        
        let query, values;
        
        if (dadosCurriculo && Object.values(dadosCurriculo).some(val => val !== null && val !== '')) {
            // Se temos dados do currículo válidos, insere com todas as informações
            query = `
                INSERT INTO vaga_candidaturas (
                    id_vaga, id_usuario, nome_completo, email, telefone, 
                    endereco, cidade, objetivo, resumo_profissional, 
                    formacao_academica, experiencia_profissional, 
                    habilidades, idiomas, curriculo_pdf_url
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                RETURNING *
            `;
            
            values = [
                id_vaga,
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
                dadosCurriculo.arquivo_url || null
            ];
            
            console.log('✅ Inserindo inscrição COM dados do currículo');
        } else {
            // Se não temos dados do currículo válidos, insere apenas os IDs
            query = `
                INSERT INTO vaga_candidaturas (id_vaga, id_usuario) 
                VALUES ($1, $2) 
                RETURNING *
            `;
            values = [id_vaga, id_usuario];
            console.log(' Inserindo inscrição SEM dados do currículo');
        }
        
        console.log(' Query executada:', query);
        console.log(' Valores:', values);
        
        const result = await pool.query(query, values);
        console.log(' Inscrição criada com sucesso:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error(' Erro detalhado no createInscricao:', error);
        throw error;
    }
}

export async function getInscricoesByVaga(id_vaga) {
    try {
        const query = `
            SELECT vc.*, u.nome as candidato_nome, u.email as candidato_email
            FROM vaga_candidaturas vc
            JOIN usuarios u ON vc.id_usuario = u.id_usuario
            WHERE vc.id_vaga = $1
        `;
        const result = await pool.query(query, [id_vaga]);
        return result.rows;
    } catch (error) {
        console.error('Erro no getInscricoesByVaga:', error);
        throw error;
    }
}

export async function getInscricoesByUsuario(id_usuario) {
    try {
        const query = `
            SELECT 
                vc.*, 
                v.titulo as vaga_titulo, 
                v.descricao as vaga_descricao,
                v.localizacao as vaga_localizacao,
                v.modalidade as vaga_modalidade,
                v.salario as vaga_salario,
                e.nome as empresa_nome,
                e.logo_url as empresa_logo
            FROM vaga_candidaturas vc
            JOIN vagas v ON vc.id_vaga = v.id_vaga
            JOIN empresas e ON v.id_empresa = e.id_empresa
            WHERE vc.id_usuario = $1
            ORDER BY vc.data_candidatura DESC
        `;
        const result = await pool.query(query, [id_usuario]);
        return result.rows;
    } catch (error) {
        console.error('Erro no getInscricoesByUsuario:', error);
        throw error;
    }
}

export async function updateStatusInscricao(id_candidatura, status) {
    try {
        const query = `
            UPDATE vaga_candidaturas 
            SET status = $1 
            WHERE id_candidatura = $2 
            RETURNING *
        `;
        const result = await pool.query(query, [status, id_candidatura]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro no updateStatusInscricao:', error);
        throw error;
    }
}