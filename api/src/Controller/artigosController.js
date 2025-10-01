import { createArtigo, getArtigos, getArtigoById } from "../Repository/artigosRepository.js";

export async function createArtigoController(req, res) {
  try {
    console.log("Body recebido (artigo):", req.body);
    const { titulo, categoria, resumo, conteudo, imagem } = req.body;

    if (!titulo || !categoria || !conteudo) {
      return res.status(400).json({ msg: "Preencha os campos obrigatórios" });
    }

    const novoArtigo = await createArtigo({
      titulo: titulo.trim(),
      categoria,
      resumo: resumo ? resumo.trim() : null,
      conteudo: conteudo.trim(),
      imagem: imagem ? imagem.trim() : null
    });

    return res.status(201).json({ msg: "Artigo criado com sucesso 🔥", artigo: novoArtigo });
  } catch (err) {
    console.error("Erro no createArtigoController:", err);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
}

export async function getArtigosController(req, res) {
  try {
    const artigos = await getArtigos();
    return res.json(artigos);
  } catch (err) {
    console.error("Erro ao buscar artigos:", err);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
}

export async function getArtigoByIdController(req, res) {
  try {
    const { id } = req.params;
    const artigo = await getArtigoById(id);
    if (!artigo) return res.status(404).json({ msg: "Artigo não encontrado" });
    return res.json(artigo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
}
