import { createInscricao } from "../Repository/cadastrarEmVagas.js";

export async function registerInscricaoController(req, res) {
  try {
    const { nome, email, telefone, curriculo, mensagem } = req.body;

    if (!nome || !email || !telefone) {
      return res.status(400).json({ msg: "Nome, email e telefone são obrigatórios" });
    }

    const novaInscricao = await createInscricao({ nome, email, telefone, curriculo, mensagem });
    return res.status(201).json({ msg: "Inscrição realizada com sucesso!", inscricao: novaInscricao });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao cadastrar inscrição" });
  }
}
