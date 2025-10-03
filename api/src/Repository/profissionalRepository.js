import pool from "../connection.js";

export async function createUser(nome, email, senha, tipo_usuario = 'candidato') {
  const query = `
    INSERT INTO usuarios (nome, email, senha, tipo_usuario) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id_usuario, nome, email, tipo_usuario, data_cadastro
  `;
  const values = [nome, email, senha, tipo_usuario];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getUsers() {
  const query = `SELECT id_usuario, nome, email, tipo_usuario, data_cadastro FROM usuarios`;
  const result = await pool.query(query);
  return result.rows;
}

export async function getUserById(id) {
  const query = `SELECT id_usuario, nome, email, tipo_usuario, data_cadastro FROM usuarios WHERE id_usuario = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const query = `SELECT * FROM usuarios WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

export async function updateUser(id, updates) {
  const allowedFields = ['nome', 'email', 'senha', 'tipo_usuario'];
  const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
  const values = fields.map(field => updates[field]);
  
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  const query = `UPDATE usuarios SET ${setClause} WHERE id_usuario = $1 RETURNING id_usuario, nome, email, tipo_usuario`;
  const result = await pool.query(query, [id, ...values]);
  return result.rows[0];
}