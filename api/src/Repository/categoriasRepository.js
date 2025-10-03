import pool from "../connection.js";

export async function createCategoria(nome) {
  const query = `
    INSERT INTO artigos_categorias (nome) 
    VALUES ($1) 
    RETURNING *
  `;
  const result = await pool.query(query, [nome]);
  return result.rows[0];
}

export async function getCategorias() {
  const query = `SELECT * FROM artigos_categorias`;
  const result = await pool.query(query);
  return result.rows;
}

export async function getCategoriaById(id) {
  const query = `SELECT * FROM artigos_categorias WHERE id_categoria = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function updateCategoria(id, nome) {
  const query = `UPDATE artigos_categorias SET nome = $1 WHERE id_categoria = $2 RETURNING *`;
  const result = await pool.query(query, [nome, id]);
  return result.rows[0];
}

export async function deleteCategoria(id) {
  const query = `DELETE FROM artigos_categorias WHERE id_categoria = $1`;
  await pool.query(query, [id]);
}