import pool from "../connection.js";

export async function createArtigo({ titulo, id_categoria, resumo, conteudo, imagem }) {
  const query = `
    INSERT INTO artigos (titulo, categoria, resumo, conteudo, imagem, data_publicacao)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *
  `;
  const values = [titulo, id_categoria, resumo, conteudo, imagem];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getArtigos() {
  const result = await pool.query(`SELECT * FROM artigos ORDER BY data_publicacao DESC`);
  return result.rows;
}

export async function getArtigoById(id) {
  const result = await pool.query(`SELECT * FROM artigos WHERE id_artigo = $1`, [id]);
  return result.rows[0];
}
