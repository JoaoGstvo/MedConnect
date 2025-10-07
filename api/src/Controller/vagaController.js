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