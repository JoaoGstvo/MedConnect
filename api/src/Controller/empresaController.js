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

// Adicione esta função ao empresaController.js
export const loginEmpresaController = async (req, res) => {
  try {
    const { email, senha } = req.body;

    console.log('Tentativa de login empresa:', email);

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar empresa pelo email
    const empresa = await getEmpresaByEmail(email);

    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não encontrada' });
    }

    // Verificar senha
    if (empresa.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Retornar dados da empresa (sem a senha)
    const empresaData = {
      id_empresa: empresa.id_empresa,
      nome: empresa.nome,
      email: empresa.email,
      cnpj: empresa.cnpj,
      endereco: empresa.endereco,
      descricao: empresa.descricao,
      logo_url: empresa.logo_url,
      tipo_usuario: 'empresa',
      data_criacao: empresa.data_criacao
    };

    console.log('Login empresa bem-sucedido:', empresaData);
    res.json(empresaData);
  } catch (error) {
    console.error('Erro no login da empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};