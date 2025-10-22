import * as vagaRepository from '../Repository/vagaRepository.js';

export async function createVagaController(req, res) {
  try {
    const { id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade } = req.body;
    
    if (!id_empresa || !titulo || !descricao || !localizacao) {
      return res.status(400).json({ error: 'ID da empresa, título, descrição e localização são obrigatórios' });
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

export async function searchVagasController(req, res) {
  try {
    const { palavraChave, localizacao, modalidade, salarioMin } = req.query;
    
    const filters = {
      palavraChave: palavraChave || '',
      localizacao: localizacao || '',
      modalidade: modalidade || '',
      salarioMin: salarioMin || ''
    };

    console.log('Filtros recebidos:', filters);

    const vagas = await vagaRepository.searchVagas(filters);
    res.json(vagas);
  } catch (error) {
    console.error('Erro no searchVagasController:', error);
    res.status(500).json({ error: error.message });
  }
}

// ADICIONAR: Estas funções estavam faltando
export async function getVagasSalvasController(req, res) {
  try {
    const { id_usuario } = req.params;
    
    if (!id_usuario || isNaN(id_usuario)) {
      return res.status(400).json({ error: 'ID do usuário inválido' });
    }
    
    const vagas = await vagaRepository.getVagasSalvas(parseInt(id_usuario));
    res.json(vagas);
  } catch (error) {
    console.error('Erro no getVagasSalvasController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function salvarVagaController(req, res) {
  try {
    const { id_usuario, id_vaga } = req.body;
    
    if (!id_usuario || !id_vaga) {
      return res.status(400).json({ error: 'ID do usuário e ID da vaga são obrigatórios' });
    }
    
    const resultado = await vagaRepository.salvarVaga(id_usuario, id_vaga);
    res.json(resultado);
  } catch (error) {
    console.error('Erro no salvarVagaController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function removerVagaSalvaController(req, res) {
  try {
    const { id_usuario, id_vaga } = req.body;
    
    if (!id_usuario || !id_vaga) {
      return res.status(400).json({ error: 'ID do usuário e ID da vaga são obrigatórios' });
    }
    
    const resultado = await vagaRepository.removerVagaSalva(id_usuario, id_vaga);
    res.json(resultado);
  } catch (error) {
    console.error('Erro no removerVagaSalvaController:', error);
    res.status(500).json({ error: error.message });
  }
}