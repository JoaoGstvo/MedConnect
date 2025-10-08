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

// Funções de busca e vagas salvas (se você as tiver adicionado anteriormente)
export async function searchVagas(filters) {
  try {
    let query = `
      SELECT v.*, e.nome as empresa_nome, e.logo_url as empresa_logo, e.descricao as empresa_descricao
      FROM vagas v 
      JOIN empresas e ON v.id_empresa = e.id_empresa 
      WHERE v.status = 'aberta'
    `;
    
    const values = [];
    let paramCount = 0;

    // Filtro por palavra-chave no título ou descrição
    if (filters.palavraChave) {
      paramCount++;
      query += ` AND (v.titulo ILIKE $${paramCount} OR v.descricao ILIKE $${paramCount} OR v.requisitos ILIKE $${paramCount})`;
      values.push(`%${filters.palavraChave}%`);
    }

    // Filtro por localização
    if (filters.localizacao) {
      paramCount++;
      query += ` AND v.localizacao ILIKE $${paramCount}`;
      values.push(`%${filters.localizacao}%`);
    }

    // Filtro por modalidade
    if (filters.modalidade && filters.modalidade !== 'todas') {
      paramCount++;
      query += ` AND v.modalidade = $${paramCount}`;
      values.push(filters.modalidade);
    }

    // Filtro por salário mínimo
    if (filters.salarioMin) {
      paramCount++;
      // Extrai números do salário para comparação
      query += ` AND REPLACE(REPLACE(v.salario, 'R$', ''), '.', '')::numeric >= $${paramCount}`;
      values.push(parseFloat(filters.salarioMin));
    }

    query += ` ORDER BY v.data_publicacao DESC`;

    console.log('Query de busca:', query);
    console.log('Valores:', values);

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    throw error;
  }
}

export async function getVagasSalvas(id_usuario) {
  try {
    const query = `
      SELECT v.*, e.nome as empresa_nome, e.logo_url as empresa_logo, e.descricao as empresa_descricao
      FROM vagas_salvas vs
      JOIN vagas v ON vs.id_vaga = v.id_vaga
      JOIN empresas e ON v.id_empresa = e.id_empresa
      WHERE vs.id_usuario = $1 AND v.status = 'aberta'
      ORDER BY vs.data_salvo DESC
    `;
    const result = await pool.query(query, [id_usuario]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar vagas salvas:', error);
    throw error;
  }
}

export async function salvarVaga(id_usuario, id_vaga) {
  try {
    // Verifica se já está salva
    const checkQuery = 'SELECT * FROM vagas_salvas WHERE id_usuario = $1 AND id_vaga = $2';
    const checkResult = await pool.query(checkQuery, [id_usuario, id_vaga]);
    
    if (checkResult.rows.length > 0) {
      return { message: 'Vaga já está salva' };
    }

    const query = `
      INSERT INTO vagas_salvas (id_usuario, id_vaga) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    const result = await pool.query(query, [id_usuario, id_vaga]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao salvar vaga:', error);
    throw error;
  }
}

export async function removerVagaSalva(id_usuario, id_vaga) {
  try {
    const query = 'DELETE FROM vagas_salvas WHERE id_usuario = $1 AND id_vaga = $2';
    await pool.query(query, [id_usuario, id_vaga]);
    return { message: 'Vaga removida das salvas' };
  } catch (error) {
    console.error('Erro ao remover vaga salva:', error);
    throw error;
  }
}