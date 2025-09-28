import { createVaga, getVagas } from "../Repository/vagaRepository.js";

export async function createVagaController(req, res) {
  try {
    console.log("Body recebido do site:", req.body);
    const { titulo, descricao, tipo_contrato, requisitos, salario } = req.body;

    if (!titulo || !descricao || !tipo_contrato) {
      return res.status(400).json({ msg: "Preencha os campos obrigatórios" });
    }

    const novaVaga = await createVaga({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tipo_contrato,
      requisitos: requisitos ? requisitos.trim() : null,
      salario: salario ? Number(salario) : null
    });

    res.status(201).json({ msg: "Vaga criada com sucesso 🔥", vaga: novaVaga });

  } catch (err) {
    console.error("Erro no createVagaController:", err);
    res.status(500).json({ msg: "Erro no servidor" });
  }
}

export async function getVagasController(req, res) {
  try {
    const vagas = await getVagas();
    res.json(vagas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro ao buscar vagas" });
  }
}
