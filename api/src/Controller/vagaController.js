import * as vagaRepository from '../Repository/vagaRepository.js';

export async function createVagaController(req, res) {
  try {
    const { id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade } = req.body;
    const vaga = await vagaRepository.createVaga(id_empresa, titulo, descricao, requisitos, localizacao, salario, modalidade);
    res.status(201).json(vaga);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getVagasController(req, res) {
  try {
    const vagas = await vagaRepository.getVagas();
    res.json(vagas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getVagaByIdController(req, res) {
  try {
    const { id } = req.params;
    const vaga = await vagaRepository.getVagaById(id);
    
    if (!vaga) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }
    
    res.json(vaga);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateVagaController(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const vaga = await vagaRepository.updateVaga(id, updates);
    res.json(vaga);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteVagaController(req, res) {
  try {
    const { id } = req.params;
    await vagaRepository.deleteVaga(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}