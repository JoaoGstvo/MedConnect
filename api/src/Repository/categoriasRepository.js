import pool from "../connection.js";

// Buscar todas as categorias
export async function getCategorias() {
    const result = await pool.query(`
        SELECT id_categoria, nome FROM categorias_artigos
        ORDER BY nome
    `);
    return result.rows;
}

// Buscar categoria por ID
export async function getCategoriaById(id) {
    const result = await pool.query(
        `SELECT * FROM categorias_artigos WHERE id_categoria = $1`,
        [id]
    );
    return result.rows[0];
}

// Criar nova categoria
export async function createCategoria(nome) {
    const result = await pool.query(
        `INSERT INTO categorias_artigos (nome) VALUES ($1) RETURNING *`,
        [nome]
    );
    return result.rows[0];
}
