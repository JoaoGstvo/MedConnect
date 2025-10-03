import * as artigosRepository from '../Repository/artigosRepository.js';

export async function createArtigoController(req, res) {
  try {
    const { id_usuario, id_categoria, titulo, resumo, conteudo, imagem } = req.body;
    const artigo = await artigosRepository.createArtigo(id_usuario, id_categoria, titulo, resumo, conteudo, imagem);
    res.status(201).json(artigo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getArtigosController(req, res) {
  try {
    const artigos = await artigosRepository.getArtigos();
    res.json(artigos);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
}

export async function updateArtigoController(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const artigo = await artigosRepository.updateArtigo(id, updates);
    res.json(artigo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteArtigoController(req, res) {
  try {
    const { id } = req.params;
    await artigosRepository.deleteArtigo(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}