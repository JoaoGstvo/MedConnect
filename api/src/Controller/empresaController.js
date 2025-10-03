import * as empresaRepository from '../Repository/empresaRepository.js';

export async function getEmpresasController(req, res) {
  try {
    const empresas = await empresaRepository.getEmpresas();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getEmpresaByIdController(req, res) {
  try {
    const { id } = req.params;
    const empresa = await empresaRepository.getEmpresaById(id);
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createEmpresaController(req, res) {
  try {
    const { nome, cnpj, email, senha, endereco, logo, descricao } = req.body;
    const empresa = await empresaRepository.createEmpresa(nome, cnpj, email, senha, endereco, logo, descricao);
    res.status(201).json(empresa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateEmpresaController(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const empresa = await empresaRepository.updateEmpresa(id, updates);
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteEmpresaController(req, res) {
  try {
    const { id } = req.params;
    await empresaRepository.deleteEmpresa(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}