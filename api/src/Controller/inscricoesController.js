import * as inscricaoRepository from '../Repository/inscricaoRepository.js';

export async function registerInscricaoController(req, res) {
  try {
    const { id_vaga, id_usuario } = req.body;
    
    if (!id_vaga || !id_usuario) {
      return res.status(400).json({ error: 'ID da vaga e ID do usuário são obrigatórios' });
    }
    
    const inscricao = await inscricaoRepository.createInscricao(id_vaga, id_usuario);
    
    res.status(201).json({
      message: 'Inscrição realizada com sucesso',
      inscricao
    });
  } catch (error) {
    console.error('Erro ao realizar inscrição:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getInscricoesByVagaController(req, res) {
  try {
    const { id_vaga } = req.params;
    const inscricoes = await inscricaoRepository.getInscricoesByVaga(id_vaga);
    res.json(inscricoes);
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getInscricoesByUsuarioController(req, res) {
  try {
    const { id_usuario } = req.params;
    const inscricoes = await inscricaoRepository.getInscricoesByUsuario(id_usuario);
    res.json(inscricoes);
  } catch (error) {
    console.error('Erro ao buscar inscrições do usuário:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateStatusInscricaoController(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pendente', 'aprovado', 'recusado'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    
    const inscricao = await inscricaoRepository.updateStatusInscricao(id, status);
    
    if (!inscricao) {
      return res.status(404).json({ error: 'Inscrição não encontrada' });
    }
    
    res.json({
      message: 'Status da inscrição atualizado com sucesso',
      inscricao
    });
  } catch (error) {
    console.error('Erro ao atualizar status da inscrição:', error);
    res.status(500).json({ error: error.message });
  }
}