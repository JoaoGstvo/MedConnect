import * as vagaRepository from '../Repository/vagaRepository.js';

export async function createVagaController(req, res) {
  try {
    const { id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade } = req.body;
    
    // Validação básica
    if (!id_empresa || !titulo || !descricao || !localizacao) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    
    const vaga = await vagaRepository.createVaga(id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade);
    res.status(201).json(vaga);
  } catch (error) {
    console.error('Erro no createVagaController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getVagasController(req, res) {
  try {
    const vagas = await vagaRepository.getVagas();
    res.json(vagas);
  } catch (error) {
    console.error('Erro no getVagasController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getVagaByIdController(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    const vaga = await vagaRepository.getVagaById(parseInt(id));
    
    if (!vaga) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }
    
    res.json(vaga);
  } catch (error) {
    console.error('Erro no getVagaByIdController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateVagaController(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    const vaga = await vagaRepository.updateVaga(parseInt(id), updates);
    res.json(vaga);
  } catch (error) {
    console.error('Erro no updateVagaController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteVagaController(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    await vagaRepository.deleteVaga(parseInt(id));
    res.status(204).send();
  } catch (error) {
    console.error('Erro no deleteVagaController:', error);
    res.status(500).json({ error: error.message });
  }
}

// ADICIONAR: Esta função estava faltando
export async function getVagasByEmpresaController(req, res) {
  try {
    const { id_empresa } = req.params;
    
    if (!id_empresa || isNaN(id_empresa)) {
      return res.status(400).json({ error: 'ID da empresa inválido' });
    }
    
    const vagas = await vagaRepository.getVagasByEmpresa(parseInt(id_empresa));
    res.json(vagas);
  } catch (error) {
    console.error('Erro no getVagasByEmpresaController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function searchVagas(filters) {
  try {
    let query = `
      SELECT v.*, e.nome as empresa_nome, e.logo as empresa_logo, e.descricao as empresa_descricao
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
      SELECT v.*, e.nome as empresa_nome, e.logo as empresa_logo, e.descricao as empresa_descricao
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