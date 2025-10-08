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

// ADICIONAR: Esta função estava faltando
export async function createEmpresaController(req, res) {
  try {
    const { 
      nome, 
      cnpj, 
      email, 
      senha, 
      endereco, 
      logo_url, 
      descricao, 
      telefone, 
      cidade, 
      estado 
    } = req.body;

    // Validação básica
    if (!nome || !cnpj || !email || !senha) {
      return res.status(400).json({ error: 'Nome, CNPJ, email e senha são obrigatórios' });
    }

    // Verificar se email já existe
    const empresaExistente = await empresaRepository.getEmpresaByEmail(email);
    if (empresaExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const empresa = await empresaRepository.createEmpresa(
      nome, 
      cnpj, 
      email, 
      senha, 
      endereco, 
      logo_url, 
      descricao, 
      telefone, 
      cidade, 
      estado
    );
    
    res.status(201).json(empresa);
  } catch (error) {
    console.error('Erro no createEmpresaController:', error);
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
    console.error('Erro no updateEmpresaController:', error);
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

export async function loginEmpresaController(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const empresa = await empresaRepository.loginEmpresa(email, senha);

    if (!empresa) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      message: 'Login realizado com sucesso',
      empresa
    });
  } catch (error) {
    console.error('Erro no loginEmpresaController:', error);
    res.status(500).json({ error: error.message });
  }
}