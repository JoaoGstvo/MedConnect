import pool from "../connection.js";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function createUser(nome, email, senha, tipo_usuario = 'candidato') {
  try {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    
    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo_usuario) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id_usuario, nome, email, tipo_usuario, data_cadastro
    `;
    const values = [nome, email, senhaHash, tipo_usuario];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

export async function getUsers() {
  const query = `SELECT id_usuario, nome, email, tipo_usuario, data_cadastro FROM usuarios`;
  const result = await pool.query(query);
  return result.rows;
}

// ADICIONE ESTA FUNÇÃO QUE ESTÁ FALTANDO
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
  try {
    const allowedFields = ['nome', 'email', 'senha', 'tipo_usuario'];
    const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
    
    // Se estiver atualizando a senha, fazer hash
    if (updates.senha) {
      updates.senha = await bcrypt.hash(updates.senha, SALT_ROUNDS);
    }
    
    const values = fields.map(field => updates[field]);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE usuarios SET ${setClause} WHERE id_usuario = $1 RETURNING id_usuario, nome, email, tipo_usuario`;
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

export async function loginProfissional(email, senha) {
  try {
    const query = `SELECT * FROM usuarios WHERE email = $1`;
    const result = await pool.query(query, [email]);
    
    if (!result.rows[0]) {
      return null;
    }

    const user = result.rows[0];
    
    // Verificar senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (!senhaValida) {
      return null;
    }

    // Retornar dados sem a senha
    const { senha: _, ...userSemSenha } = user;
    return userSemSenha;
  } catch (error) {
    console.error('Erro no loginProfissional:', error);
    throw error;
  }
}