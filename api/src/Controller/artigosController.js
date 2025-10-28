import * as artigosRepository from '../Repository/artigosRepository.js';

export async function createArtigoController(req, res) {
  try {
    const { id_usuario, id_categoria, titulo, resumo, conteudo, imagem } = req.body;
    
    if (!id_usuario || !id_categoria || !titulo || !conteudo) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: id_usuario, id_categoria, titulo e conteudo' 
      });
    }

    const artigo = await artigosRepository.createArtigo(
      id_usuario, 
      id_categoria, 
      titulo, 
      resumo, 
      conteudo, 
      imagem
    );
    
    res.status(201).json({
      message: 'Artigo criado com sucesso',
      artigo: {
        id: artigo.id_artigo,
        titulo: artigo.titulo,
        resumo: artigo.resumo,
        conteudo: artigo.conteudo,
        imagem: artigo.imagem,
        data_publicacao: artigo.data_publicacao
      }
    });
  } catch (error) {
    console.error('Erro no createArtigoController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getArtigosController(req, res) {
  try {
    const { categoria } = req.query;
    
    let artigos;
    if (categoria && categoria !== 'todos') {
      artigos = await artigosRepository.getArtigosByCategoria(categoria);
    } else {
      artigos = await artigosRepository.getArtigos();
    }
    
    res.json(artigos);
  } catch (error) {
    console.error('Erro no getArtigosController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getArtigoByIdController(req, res) {
  try {
    const { id } = req.params;
    const artigo = await artigosRepository.getArtigoById(id);
    
    if (!artigo) {
      return res.status(404).json({ error: 'Artigo não encontrado' });
    }
    
    res.json(artigo);
  } catch (error) {
    console.error('Erro no getArtigoByIdController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getArtigosByUsuarioController(req, res) {
  try {
    const { id_usuario } = req.params;
    
    if (!id_usuario || isNaN(id_usuario)) {
      return res.status(400).json({ error: 'ID do usuário inválido' });
    }
    
    const artigos = await artigosRepository.getArtigosByUsuario(parseInt(id_usuario));
    res.json(artigos);
  } catch (error) {
    console.error('Erro no getArtigosByUsuarioController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateArtigoController(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const artigo = await artigosRepository.updateArtigo(id, updates);
    res.json({
      message: 'Artigo atualizado com sucesso',
      artigo
    });
  } catch (error) {
    console.error('Erro no updateArtigoController:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteArtigoController(req, res) {
  try {
    const { id } = req.params;
    await artigosRepository.deleteArtigo(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro no deleteArtigoController:', error);
    res.status(500).json({ error: error.message });
  }
}