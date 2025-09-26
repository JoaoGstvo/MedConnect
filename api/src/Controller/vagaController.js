import { Router } from "express";
import { createVaga } from "../Repository/vagaRepository.js";

const router = Router();

export async function createVagaController(req, res) {
  try {
    const { titulo, descricao, tipo_contrato, requisitos, salario } = req.body;

    if (!titulo || !descricao || !tipo_contrato) {
      return res.status(400).json({ msg: "Preencha os campos obrigatórios" });
    }

    const novaVaga = await createVaga({ titulo, descricao, tipo_contrato, requisitos, salario });

    res.status(201).json({
      msg: "Vaga criada com sucesso 🔥",
      vaga: novaVaga
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro no servidor" });
  }
}

export default router;
