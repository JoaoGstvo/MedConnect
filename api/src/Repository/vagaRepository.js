import pool from "../connection.js";

// Criar uma nova vaga
export async function createVaga(id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade) {
  try {
    const query = `
      INSERT INTO vagas (
        id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade, status, data_publicacao
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'aberta', NOW())
      RETURNING *;
    `;
    const values = [id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    throw error;
  }
}

// Buscar todas as vagas abertas
export async function getVagas() {
  try {
    const query = `
      SELECT 
        v.*, 
        e.nome AS empresa_nome, 
        e.logo_url AS empresa_logo, 
        e.descricao AS empresa_descricao
      FROM vagas v
      JOIN empresas e ON v.id_empresa = e.id_empresa
      WHERE v.status = 'aberta'
      ORDER BY v.data_publicacao DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    throw error;
  }
}

// Buscar vaga por ID
export async function getVagaById(id) {
  try {
    const query = `
      SELECT 
        v.*, 
        e.nome AS empresa_nome, 
        e.logo_url AS empresa_logo, 
        e.descricao AS empresa_descricao
      FROM vagas v 
      JOIN empresas e ON v.id_empresa = e.id_empresa 
      WHERE v.id_vaga = $1;
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao buscar vaga por ID:", error);
    throw error;
  }
}

// Atualizar vaga
export async function updateVaga(id, updates) {
  try {
    const allowedFields = ["titulo", "descricao", "requisitos", "localizacao", "salario", "modalidade", "status"];
    const fields = Object.keys(updates).filter(field => allowedFields.includes(field));

    if (fields.length === 0) {
      throw new Error("Nenhum campo válido para atualização");
    }

    const values = fields.map(field => updates[field]);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ");
    const query = `
      UPDATE vagas 
      SET ${setClause} 
      WHERE id_vaga = $1 
      RETURNING *;
    `;
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao atualizar vaga:", error);
    throw error;
  }
}

// Deletar vaga
export async function deleteVaga(id) {
  try {
    const query = `DELETE FROM vagas WHERE id_vaga = $1;`;
    await pool.query(query, [id]);
    return { message: "Vaga deletada com sucesso" };
  } catch (error) {
    console.error("Erro ao deletar vaga:", error);
    throw error;
  }
}
