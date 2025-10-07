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

// ADICIONAR: Função para buscar empresa por email
// empresaRepository.js - Atualizar a função updateEmpresa
export async function updateEmpresa(id, updates) {
  const allowedFields = ['nome', 'cnpj', 'email', 'senha', 'endereco', 'logo_url', 'descricao', 'telefone', 'cidade', 'estado'];
  const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
  const values = fields.map(field => updates[field]);
  
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  const query = `UPDATE empresas SET ${setClause} WHERE id_empresa = $1 RETURNING *`;
  const result = await pool.query(query, [id, ...values]);
  return result.rows[0];
}

// Atualizar também a função loginEmpresa para retornar todos os campos
export async function loginEmpresa(email, senha) {
  try {
    const query = `
      SELECT id_empresa, nome, cnpj, email, endereco, logo_url, descricao, telefone, cidade, estado, ativo, data_criacao
      FROM empresas 
      WHERE email = $1 AND senha = $2 AND ativo = true
    `;
    const result = await pool.query(query, [email, senha]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Atualizar getEmpresaByEmail
export async function getEmpresaByEmail(email) {
  try {
    const query = `SELECT * FROM empresas WHERE email = $1 AND ativo = true`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro no getEmpresaByEmail:', error);
    throw error;
  }
}

// Atualizar getEmpresaById
export async function getEmpresaById(id) {
  const query = `SELECT * FROM empresas WHERE id_empresa = $1 AND ativo = true`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}