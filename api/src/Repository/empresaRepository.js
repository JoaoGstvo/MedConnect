import pool from "../connection.js";

export async function createEmpresa(nome, cnpj, email, senha, endereco, logo, descricao) {
  const query = `
    INSERT INTO empresas (nome, cnpj, email, senha, endereco, logo, descricao) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *
  `;
  const values = [nome, cnpj, email, senha, endereco, logo, descricao];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getEmpresas() {
  const query = `SELECT * FROM empresas`;
  const result = await pool.query(query);
  return result.rows;
}

export async function getEmpresaById(id) {
  const query = `SELECT * FROM empresas WHERE id_empresa = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function updateEmpresa(id, updates) {
  const allowedFields = ['nome', 'cnpj', 'email', 'senha', 'endereco', 'logo', 'descricao'];
  const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
  const values = fields.map(field => updates[field]);
  
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  const query = `UPDATE empresas SET ${setClause} WHERE id_empresa = $1 RETURNING *`;
  const result = await pool.query(query, [id, ...values]);
  return result.rows[0];
}

export async function deleteEmpresa(id) {
  const query = `DELETE FROM empresas WHERE id_empresa = $1`;
  await pool.query(query, [id]);
}