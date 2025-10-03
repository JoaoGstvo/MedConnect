import pool from "../connection.js";

export async function createCurriculo(id_usuario, resumo, experiencia, formacao, competencias, arquivo_cv) {
  try {
    // Verifica se já existe currículo para este usuário
    const existingCurriculo = await pool.query(
      'SELECT * FROM curriculos WHERE id_usuario = $1',
      [id_usuario]
    );
    
    if (existingCurriculo.rows.length > 0) {
      throw new Error('Já existe um currículo para este usuário');
    }
    
    const query = `
      INSERT INTO curriculos (id_usuario, resumo, experiencia, formacao, competencias, arquivo_cv) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const values = [id_usuario, resumo, experiencia, formacao, competencias, arquivo_cv];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getCurriculoByUsuario(id_usuario) {
  try {
    const query = `
      SELECT c.*, u.nome, u.email 
      FROM curriculos c 
      JOIN usuarios u ON c.id_usuario = u.id_usuario 
      WHERE c.id_usuario = $1
    `;
    const result = await pool.query(query, [id_usuario]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function updateCurriculo(id_curriculo, updates) {
  try {
    const allowedFields = ['resumo', 'experiencia', 'formacao', 'competencias', 'arquivo_cv'];
    const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('Nenhum campo válido para atualização');
    }
    
    const values = fields.map(field => updates[field]);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `
      UPDATE curriculos 
      SET ${setClause} 
      WHERE id_curriculo = $1 
      RETURNING *
    `;
    
    const result = await pool.query(query, [id_curriculo, ...values]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}