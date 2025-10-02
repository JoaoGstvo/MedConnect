import { getEmpresas, getEmpresaById, createEmpresa } from "../Repository/empresaRepository.js";

export async function getEmpresasController(req, res) {
  try {
    const empresas = await getEmpresas();
    
    // Formatar os dados para o frontend (converter números para formato amigável)
    const empresasFormatadas = empresas.map(empresa => ({
      ...empresa,
      avaliacoes: empresa.avaliacoes >= 1000 
        ? `${(empresa.avaliacoes / 1000).toFixed(0)} mil` 
        : empresa.avaliacoes.toString(),
      nota: empresa.nota.toString()
    }));

    return res.json(empresasFormatadas);
  } catch (err) {
    console.error("Erro ao buscar empresas:", err);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
}

export async function getEmpresaByIdController(req, res) {
  try {
    const { id } = req.params;
    const empresa = await getEmpresaById(id);
    
    if (!empresa) {
      return res.status(404).json({ msg: "Empresa não encontrada" });
    }

    // Formatar para o frontend
    const empresaFormatada = {
      ...empresa,
      avaliacoes: empresa.avaliacoes >= 1000 
        ? `${(empresa.avaliacoes / 1000).toFixed(0)} mil` 
        : empresa.avaliacoes.toString(),
      nota: empresa.nota.toString()
    };

    return res.json(empresaFormatada);
  } catch (err) {
    console.error("Erro ao buscar empresa:", err);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
}

export async function createEmpresaController(req, res) {
  try {
    const { nome, logo, nota, vagas, avaliacoes, descricao, localizacao } = req.body;
    
    if (!nome || !descricao || !localizacao) {
      return res.status(400).json({ msg: "Nome, descrição e localização são obrigatórios" });
    }

    const novaEmpresa = await createEmpresa({
      nome: nome.trim(),
      logo: logo?.trim() || "/logos/placeholder.png",
      nota: nota ? parseFloat(nota) : 0.0,
      vagas: vagas ? parseInt(vagas) : 0,
      avaliacoes: avaliacoes ? parseInt(avaliacoes) : 0,
      descricao: descricao.trim(),
      localizacao: localizacao.trim()
    });

    return res.status(201).json({ 
      msg: "Empresa cadastrada com sucesso ✅", 
      empresa: novaEmpresa 
    });
  } catch (err) {
    console.error("Erro ao criar empresa:", err);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
}