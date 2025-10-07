import pool from "../connection.js";

export async function createVaga(id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade) {
  try {
    const query = `
      INSERT INTO vagas (id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    const values = [id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    throw error;
  }
}

// vagaRepository.js - Atualizar as queries que retornam dados da empresa
export async function getVagas() {
  try {
    const query = `
      SELECT v.*, e.nome as empresa_nome, e.logo_url as empresa_logo, e.descricao as empresa_descricao
      FROM vagas v 
      JOIN empresas e ON v.id_empresa = e.id_empresa 
      WHERE v.status = 'aberta'
      ORDER BY v.data_publicacao DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    throw error;
  }
}

export async function getVagaById(id) {
  try {
    const query = `
      SELECT v.*, e.nome as empresa_nome, e.logo_url as empresa_logo, e.descricao as empresa_descricao
      FROM vagas v 
      JOIN empresas e ON v.id_empresa = e.id_empresa 
      WHERE v.id_vaga = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao buscar vaga por ID:', error);
    throw error;
  }
}

export async function getVagasByEmpresa(id_empresa) {
  try {
    const query = `
      SELECT v.*, e.nome as empresa_nome, e.logo_url as empresa_logo
      FROM vagas v 
      JOIN empresas e ON v.id_empresa = e.id_empresa 
      WHERE v.id_empresa = $1
      ORDER BY v.data_publicacao DESC
    `;
    const result = await pool.query(query, [id_empresa]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar vagas por empresa:', error);
    throw error;
  }
}

export async function updateVaga(id, updates) {
  try {
    const allowedFields = ['titulo', 'descricao', 'requisitos', 'localizacao', 'salario', 'modalidade', 'status'];
    const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('Nenhum campo válido para atualização');
    }
    
    const values = fields.map(field => updates[field]);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `
      UPDATE vagas 
      SET ${setClause} 
      WHERE id_vaga = $1 
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    throw error;
  }
}

export async function deleteVaga(id) {
  try {
    const query = `DELETE FROM vagas WHERE id_vaga = $1`;
    await pool.query(query, [id]);
    return { message: 'Vaga deletada com sucesso' };
  } catch (error) {
    console.error('Erro ao deletar vaga:', error);
    throw error;
  }
}


export async function getVagasByEmpresa(id_empresa) {
  try {
    const query = `
      SELECT v.*, e.nome as empresa_nome, e.logo_url as empresa_logo
      FROM vagas v 
      JOIN empresas e ON v.id_empresa = e.id_empresa 
      WHERE v.id_empresa = $1
      ORDER BY v.data_publicacao DESC
    `;
    const result = await pool.query(query, [id_empresa]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar vagas por empresa:', error);
    throw error;
  }
}