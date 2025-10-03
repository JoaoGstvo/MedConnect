import * as curriculoRepository from '../Repository/curriculoRepository.js';

export async function createCurriculoController(req, res) {
  try {
    const { id_usuario, resumo, experiencia, formacao, competencias, arquivo_cv } = req.body;
    
    if (!id_usuario) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }
    
    const curriculo = await curriculoRepository.createCurriculo(
      id_usuario, 
      resumo, 
      experiencia, 
      formacao, 
      competencias, 
      arquivo_cv
    );
    
    res.status(201).json({
      message: 'Currículo criado com sucesso',
      curriculo
    });
  } catch (error) {
    console.error('Erro ao criar currículo:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getCurriculoByUsuarioController(req, res) {
  try {
    const { id_usuario } = req.params;
    
    const curriculo = await curriculoRepository.getCurriculoByUsuario(id_usuario);
    
    if (!curriculo) {
      return res.status(404).json({ error: 'Currículo não encontrado' });
    }
    
    res.json(curriculo);
  } catch (error) {
    console.error('Erro ao buscar currículo:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateCurriculoController(req, res) {
  try {
    const { id_curriculo } = req.params;
    const updates = req.body;
    
    const curriculo = await curriculoRepository.updateCurriculo(id_curriculo, updates);
    
    if (!curriculo) {
      return res.status(404).json({ error: 'Currículo não encontrado' });
    }
    
    res.json({
      message: 'Currículo atualizado com sucesso',
      curriculo
    });
  } catch (error) {
    console.error('Erro ao atualizar currículo:', error);
    res.status(500).json({ error: error.message });
  }
}