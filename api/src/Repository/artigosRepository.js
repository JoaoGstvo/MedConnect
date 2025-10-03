import pool from "../connection.js";

export async function createArtigo(id_usuario, id_categoria, titulo, resumo, conteudo, imagem) {
  const query = `
    INSERT INTO artigos (id_usuario, id_categoria, titulo, resumo, conteudo, imagem) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *
  `;
  const values = [id_usuario, id_categoria, titulo, resumo, conteudo, imagem];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getArtigos() {
  const query = `
    SELECT a.*, u.nome as autor_nome, ac.nome as categoria_nome
    FROM artigos a
    JOIN usuarios u ON a.id_usuario = u.id_usuario
    JOIN artigos_categorias ac ON a.id_categoria = ac.id_categoria
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getArtigoById(id) {
  const query = `
    SELECT a.*, u.nome as autor_nome, ac.nome as categoria_nome
    FROM artigos a
    JOIN usuarios u ON a.id_usuario = u.id_usuario
    JOIN artigos_categorias ac ON a.id_categoria = ac.id_categoria
    WHERE a.id_artigo = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function updateArtigo(id, updates) {
  const allowedFields = ['titulo', 'resumo', 'conteudo', 'imagem', 'id_categoria'];
  const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
  const values = fields.map(field => updates[field]);
  
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  const query = `UPDATE artigos SET ${setClause} WHERE id_artigo = $1 RETURNING *`;
  const result = await pool.query(query, [id, ...values]);
  return result.rows[0];
}

export async function deleteArtigo(id) {
  const query = `DELETE FROM artigos WHERE id_artigo = $1`;
  await pool.query(query, [id]);
}