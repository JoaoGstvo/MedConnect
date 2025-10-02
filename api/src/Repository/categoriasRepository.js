import pool from "../connection.js";

// Buscar todas as categorias
export async function getCategorias() {
  const result = await pool.query(`SELECT * FROM categorias_artigos ORDER BY nome_categoria ASC`);
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
export async function createCategoria(nome_categoria) {
  const result = await pool.query(
    `INSERT INTO categorias_artigos (nome_categoria) VALUES ($1) RETURNING *`,
    [nome_categoria]
  );
  return result.rows[0];
}
