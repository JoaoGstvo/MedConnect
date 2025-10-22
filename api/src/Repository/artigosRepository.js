import pool from "../connection.js";

export async function createArtigo(id_usuario, id_categoria, titulo, resumo, conteudo, imagem) {
  try {
    const query = `
      INSERT INTO artigos (id_usuario, id_categoria, titulo, resumo, conteudo, imagem) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const values = [id_usuario, id_categoria, titulo, resumo, conteudo, imagem];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erro no createArtigo:', error);
    throw error;
  }
}

export async function getArtigos() {
  try {
    const query = `
      SELECT 
        a.id_artigo as id,
        a.titulo,
        a.resumo,
        a.conteudo,
        a.imagem,
        a.data_publicacao,
        c.nome as categoria,
        u.nome as autor,
        u.id_usuario
      FROM artigos a
      JOIN artigos_categorias c ON a.id_categoria = c.id_categoria
      JOIN usuarios u ON a.id_usuario = u.id_usuario
      ORDER BY a.data_publicacao DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Erro no getArtigos:', error);
    throw error;
  }
}

export async function getArtigoById(id) {
  try {
    const query = `
      SELECT 
        a.id_artigo as id,
        a.titulo,
        a.resumo,
        a.conteudo,
        a.imagem,
        a.data_publicacao,
        c.nome as categoria,
        u.nome as autor,
        u.id_usuario
      FROM artigos a
      JOIN artigos_categorias c ON a.id_categoria = c.id_categoria
      JOIN usuarios u ON a.id_usuario = u.id_usuario
      WHERE a.id_artigo = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro no getArtigoById:', error);
    throw error;
  }
}

export async function getArtigosByCategoria(categoria) {
  try {
    const query = `
      SELECT 
        a.id_artigo as id,
        a.titulo,
        a.resumo,
        a.conteudo,
        a.imagem,
        a.data_publicacao,
        c.nome as categoria,
        u.nome as autor,
        u.id_usuario
      FROM artigos a
      JOIN artigos_categorias c ON a.id_categoria = c.id_categoria
      JOIN usuarios u ON a.id_usuario = u.id_usuario
      WHERE c.nome = $1
      ORDER BY a.data_publicacao DESC
    `;
    const result = await pool.query(query, [categoria]);
    return result.rows;
  } catch (error) {
    console.error('Erro no getArtigosByCategoria:', error);
    throw error;
  }
}

export async function getArtigosByUsuario(id_usuario) {
  try {
    const query = `
      SELECT 
        a.id_artigo as id,
        a.titulo,
        a.resumo,
        a.conteudo,
        a.imagem,
        a.data_publicacao,
        c.nome as categoria,
        u.nome as autor,
        u.id_usuario
      FROM artigos a
      JOIN artigos_categorias c ON a.id_categoria = c.id_categoria
      JOIN usuarios u ON a.id_usuario = u.id_usuario
      WHERE a.id_usuario = $1
      ORDER BY a.data_publicacao DESC
    `;
    const result = await pool.query(query, [id_usuario]);
    return result.rows;
  } catch (error) {
    console.error('Erro no getArtigosByUsuario:', error);
    throw error;
  }
}

export async function updateArtigo(id, updates) {
  try {
    const allowedFields = ['id_categoria', 'titulo', 'resumo', 'conteudo', 'imagem'];
    const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
    const values = fields.map(field => updates[field]);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE artigos SET ${setClause} WHERE id_artigo = $1 RETURNING *`;
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro no updateArtigo:', error);
    throw error;
  }
}

export async function deleteArtigo(id) {
  try {
    const query = `DELETE FROM artigos WHERE id_artigo = $1`;
    await pool.query(query, [id]);
  } catch (error) {
    console.error('Erro no deleteArtigo:', error);
    throw error;
  }
}