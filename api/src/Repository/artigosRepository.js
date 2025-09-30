import pool from "../connection.js";

export async function createArtigo(artigo) {
  const { titulo, categoria, resumo, conteudo, imagem } = artigo;
  const result = await pool.query(
    `INSERT INTO artigos (titulo, categoria, resumo, conteudo, imagem, data_publicacao)
     VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
    [titulo, categoria, resumo, conteudo, imagem]
  );
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
