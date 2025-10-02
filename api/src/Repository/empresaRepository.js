import pool from "../connection.js";

// Retorna todas as empresas, ordenadas por nota e nome
export async function getEmpresas() {
    const query = `
        SELECT 
            id,
            nome,
            logo,
            nota,
            vagas,
            avaliacoes,
            descricao,
            localizacao
        FROM empresas 
        ORDER BY nota DESC, nome
    `;
    const result = await pool.query(query);
    return result.rows;
}

// Retorna uma empresa pelo ID
export async function getEmpresaById(id) {
    const query = `
        SELECT *
        FROM empresas
        WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

// Cria uma nova empresa
export async function createEmpresa({ nome, logo, nota, vagas, avaliacoes, descricao, localizacao }) {
    const query = `
        INSERT INTO empresas (nome, logo, nota, vagas, avaliacoes, descricao, localizacao)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [nome, logo, nota, vagas, avaliacoes, descricao, localizacao];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Atualiza uma empresa existente
export async function updateEmpresa({ id, nome, logo, nota, vagas, avaliacoes, descricao, localizacao }) {
    const query = `
        UPDATE empresas
        SET nome=$1,
            logo=$2,
            nota=$3,
            vagas=$4,
            avaliacoes=$5,
            descricao=$6,
            localizacao=$7
        WHERE id=$8
        RETURNING *
    `;
    const values = [nome, logo, nota, vagas, avaliacoes, descricao, localizacao, id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Deleta uma empresa pelo ID
export async function deleteEmpresa(id) {
    const query = `
        DELETE FROM empresas
        WHERE id=$1
        RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}
