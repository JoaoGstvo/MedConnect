import { createEmpresaCadastro } from "../Repository/empresaCadastroRepository.js";

export async function createEmpresaCadastroController(req, res) {
  try {
    const novaEmpresa = await createEmpresaCadastro(req.body);
    return res.status(201).json(novaEmpresa);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao cadastrar empresa" });
  }
}

export async function getEmpresasCadastroController(req, res) {
  try {
    const empresas = await getEmpresasCadastro();
    return res.json(empresas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao buscar empresas" });
  }
}

export async function getEmpresaCadastroByIdController(req, res) {
  try {
    const { id } = req.params;
    const empresa = await getEmpresaCadastroById(id);
    if (!empresa) return res.status(404).json({ msg: "Empresa não encontrada" });
    return res.json(empresa);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao buscar empresa" });
  }
}

export async function updateEmpresaCadastroController(req, res) {
  try {
    const { id } = req.params;
    const empresaAtualizada = await updateEmpresaCadastro(id, req.body);
    if (!empresaAtualizada) return res.status(404).json({ msg: "Empresa não encontrada" });
    return res.json(empresaAtualizada);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao atualizar empresa" });
  }
}

export async function deleteEmpresaCadastroController(req, res) {
  try {
    const { id } = req.params;
    const empresaDeletada = await deleteEmpresaCadastro(id);
    if (!empresaDeletada) return res.status(404).json({ msg: "Empresa não encontrada" });
    return res.json({ msg: "Empresa deletada com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao deletar empresa" });
  }
}
