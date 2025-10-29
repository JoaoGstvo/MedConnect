import pool from "../connection.js";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function createEmpresa(nome, cnpj, email, senha, endereco, logo_url, descricao, telefone, cidade, estado) {
  try {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    
    const query = `
      INSERT INTO empresas (nome, cnpj, email, senha, endereco, logo_url, descricao, telefone, cidade, estado) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING id_empresa, nome, cnpj, email, endereco, logo_url, descricao, telefone, cidade, estado, data_criacao
    `;
    const values = [nome, cnpj, email, senhaHash, endereco, logo_url, descricao, telefone, cidade, estado];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    throw error;
  }
}

export async function getEmpresas() {
  const query = `SELECT id_empresa, nome, cnpj, email, endereco, logo_url, descricao, telefone, cidade, estado, data_criacao FROM empresas WHERE ativo = true`;
  const result = await pool.query(query);
  return result.rows;
}

export async function getEmpresaById(id) {
  const query = `SELECT id_empresa, nome, cnpj, email, endereco, logo_url, descricao, telefone, cidade, estado, data_criacao FROM empresas WHERE id_empresa = $1 AND ativo = true`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

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

export async function updateEmpresa(id, updates) {
  try {
    const allowedFields = ['nome', 'cnpj', 'email', 'senha', 'endereco', 'logo_url', 'descricao', 'telefone', 'cidade', 'estado'];
    const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
    
    // Se estiver atualizando a senha, fazer hash
    if (updates.senha) {
      updates.senha = await bcrypt.hash(updates.senha, SALT_ROUNDS);
    }
    
    const values = fields.map(field => updates[field]);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE empresas SET ${setClause} WHERE id_empresa = $1 RETURNING id_empresa, nome, cnpj, email, endereco, logo_url, descricao, telefone, cidade, estado, data_criacao`;
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    throw error;
  }
}

export async function deleteEmpresa(id) {
  const query = `UPDATE empresas SET ativo = false WHERE id_empresa = $1`;
  await pool.query(query, [id]);
}

export async function loginEmpresa(email, senha) {
  try {
    const query = `SELECT * FROM empresas WHERE email = $1 AND ativo = true`;
    const result = await pool.query(query, [email]);
    
    if (!result.rows[0]) {
      return null;
    }

    const empresa = result.rows[0];
    
    // Verificar senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, empresa.senha);
    
    if (!senhaValida) {
      return null;
    }

    // Retornar dados sem a senha
    const { senha: _, ...empresaSemSenha } = empresa;
    return empresaSemSenha;
  } catch (error) {
    console.error('Erro no loginEmpresa:', error);
    throw error;
  }
}