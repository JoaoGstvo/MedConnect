import {
  createEmpresa,
  getEmpresas,
  getEmpresaById,
  updateEmpresa,
  deleteEmpresa,
  getEmpresaByEmail
} from "../Repository/empresaRepository.js";

export const getEmpresasController = async (req, res) => {
  try {
    const empresas = await getEmpresas();
    res.json(empresas);
  } catch (error) {
    console.error('Erro no getEmpresasController:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getEmpresaByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await getEmpresaById(id);
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    res.json(empresa);
  } catch (error) {
    console.error('Erro no getEmpresaByIdController:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createEmpresaController = async (req, res) => {
  try {
    const { nome, email, senha, cnpj, descricao, telefone, endereco } = req.body;

    if (!nome || !email || !senha || !cnpj) {
      return res.status(400).json({ error: 'Nome, email, senha e CNPJ são obrigatórios' });
    }

    // Verificar se empresa já existe
    const existingEmpresa = await getEmpresaByEmail(email);
    if (existingEmpresa) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const empresa = await createEmpresa(nome, email, senha, cnpj, descricao, telefone, endereco);
    res.status(201).json(empresa);
  } catch (error) {
    console.error('Erro no createEmpresaController:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateEmpresaController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedEmpresa = await updateEmpresa(id, updates);
    res.json(updatedEmpresa);
  } catch (error) {
    console.error('Erro no updateEmpresaController:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// CORRIGIR: Mudar o nome da função para deleteEmpresaController
export const deleteEmpresaController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteEmpresa(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro no deleteEmpresaController:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

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
      id_usuario: empresa.id_empresa, // Para compatibilidade
      nome: empresa.nome,
      email: empresa.email,
      cnpj: empresa.cnpj,
      descricao: empresa.descricao,
      telefone: empresa.telefone,
      endereco: empresa.endereco,
      tipo_usuario: 'empresa',
      data_cadastro: empresa.data_cadastro
    };

    console.log('Login bem-sucedido:', empresaData);
    res.json(empresaData);
  } catch (error) {
    console.error('Erro no login empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};