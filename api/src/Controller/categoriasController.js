import { getCategorias, getCategoriaById, createCategoria } from "../Repository/categoriasRepository.js";

export async function getCategoriasController(req, res) {
  try {
    const categorias = await getCategorias();
    return res.json(categorias);
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
}

export async function getCategoriaByIdController(req, res) {
  try {
    const { id } = req.params;
    const categoria = await getCategoriaById(id);
    if (!categoria) return res.status(404).json({ msg: "Categoria não encontrada" });
    return res.json(categoria);
  } catch (err) {
    console.error("Erro ao buscar categoria:", err);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
}

export async function createCategoriaController(req, res) {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ msg: "Nome da categoria é obrigatório" });

    const novaCategoria = await createCategoria(nome.trim());
    return res.status(201).json({ msg: "Categoria criada com sucesso ✅", categoria: novaCategoria });
  } catch (err) {
    console.error("Erro ao criar categoria:", err);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
}
