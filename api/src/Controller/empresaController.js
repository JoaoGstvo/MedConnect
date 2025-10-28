import * as empresaRepository from '../Repository/empresaRepository.js';

export async function loginEmpresaController(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const empresa = await empresaRepository.getEmpresaByEmail(email);

    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não encontrada' });
    }

    if (empresa.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const empresaData = {
      id_empresa: empresa.id_empresa,
      nome: empresa.nome,
      email: empresa.email,
      cnpj: empresa.cnpj,
      endereco: empresa.endereco,
      descricao: empresa.descricao,
      logo_url: empresa.logo_url,
      telefone: empresa.telefone,
      cidade: empresa.cidade,
      estado: empresa.estado,
      data_criacao: empresa.data_criacao,
      tipo_usuario: 'empresa'
    };

    res.json({
      success: true,
      empresa: empresaData,
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no login da empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
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
    const { nome, cnpj, email, senha, endereco, descricao, telefone, cidade, estado } = req.body;

    if (!nome || !cnpj || !email || !senha) {
      return res.status(400).json({ error: 'Nome, CNPJ, email e senha são obrigatórios' });
    }

    const empresaExistente = await empresaRepository.getEmpresaByEmail(email);
    if (empresaExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const empresa = await empresaRepository.createEmpresa(
      nome, cnpj, email, senha, endereco, null, descricao, telefone, cidade, estado
    );

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

export async function getEmpresasController(req, res) {
  try {
    const empresas = await empresaRepository.getEmpresas();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}