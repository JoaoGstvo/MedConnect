import pool from "../connection.js";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Função para detectar se a senha está criptografada
const isPasswordHashed = (password) => {
  return typeof password === 'string' && 
         password.startsWith('$2b$') && 
         password.length === 60;
};

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
    
    // Se estiver atualizando a senha e não estiver criptografada, fazer hash
    if (updates.senha && !isPasswordHashed(updates.senha)) {
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
    
    // VERIFICAÇÃO HÍBRIDA: Aceita senha criptografada ou texto simples
    let senhaValida = false;
    
    if (isPasswordHashed(empresa.senha)) {
      // Senha está criptografada - usar bcrypt
      senhaValida = await bcrypt.compare(senha, empresa.senha);
    } else {
      // Senha está em texto simples - comparação direta
      senhaValida = empresa.senha === senha;
    }
    
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

// Função para migrar senhas para bcrypt (opcional)
export async function migrateEmpresaPasswordToBcrypt(empresaId, senhaAtual) {
  try {
    const senhaHash = await bcrypt.hash(senhaAtual, SALT_ROUNDS);
    const query = `UPDATE empresas SET senha = $1 WHERE id_empresa = $2`;
    await pool.query(query, [senhaHash, empresaId]);
    return true;
  } catch (error) {
    console.error('Erro ao migrar senha da empresa:', error);
    throw error;
  }
}