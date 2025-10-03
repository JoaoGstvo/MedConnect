import * as categoriasRepository from '../Repository/categoriasRepository.js';

export async function createCategoriaController(req, res) {
  try {
    const { nome } = req.body;
    const categoria = await categoriasRepository.createCategoria(nome);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCategoriasController(req, res) {
  try {
    const categorias = await categoriasRepository.getCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCategoriaByIdController(req, res) {
  try {
    const { id } = req.params;
    const categoria = await categoriasRepository.getCategoriaById(id);
    
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateCategoriaController(req, res) {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    
    const categoria = await categoriasRepository.updateCategoria(id, nome);
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCategoriaController(req, res) {
  try {
    const { id } = req.params;
    await categoriasRepository.deleteCategoria(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}