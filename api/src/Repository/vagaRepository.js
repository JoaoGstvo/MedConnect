import pool from "../connection.js";

export async function createVaga(id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade) {
  const query = `
    INSERT INTO vagas (id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *
  `;
  const values = [id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getVagas() {
  const query = `
    SELECT v.*, e.nome as empresa_nome, e.logo as empresa_logo 
    FROM vagas v 
    JOIN empresas e ON v.id_empresa = e.id_empresa 
    WHERE v.status = 'aberta'
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getVagaById(id) {
  const query = `
    SELECT v.*, e.nome as empresa_nome, e.logo as empresa_logo, e.descricao as empresa_descricao
    FROM vagas v 
    JOIN empresas e ON v.id_empresa = e.id_empresa 
    WHERE v.id_vaga = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function updateVaga(id, updates) {
  const allowedFields = ['titulo', 'descricao', 'requisitos', 'localizacao', 'salario', 'modalidade', 'status'];
  const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
  const values = fields.map(field => updates[field]);
  
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  const query = `UPDATE vagas SET ${setClause} WHERE id_vaga = $1 RETURNING *`;
  const result = await pool.query(query, [id, ...values]);
  return result.rows[0];
}

export async function deleteVaga(id) {
  const query = `DELETE FROM vagas WHERE id_vaga = $1`;
  await pool.query(query, [id]);
}