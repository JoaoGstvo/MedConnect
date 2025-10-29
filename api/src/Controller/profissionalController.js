import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  getUserByEmail,
  loginProfissional // IMPORTE A FUNÇÃO CORRETA
} from "../Repository/profissionalRepository.js";

export const registerProfissionalController = async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario = 'candidato' } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const user = await createUser(nome, email, senha, tipo_usuario);
    res.status(201).json(user);
  } catch (error) {
    console.error('Erro no registerProfissionalController:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getProfissionaisController = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro no getProfissionaisController:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getProfissionalByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erro no getProfissionalByIdController:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateProfissionalController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedUser = await updateUser(id, updates);
    res.json(updatedUser);
  } catch (error) {
    console.error('Erro no updateProfissionalController:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const loginProfissionalController = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // USE A FUNÇÃO loginProfissional QUE FAZ A VERIFICAÇÃO COM BCRYPT
    const user = await loginProfissional(email, senha);
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const userData = {
      id_usuario: user.id_usuario,
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario || 'candidato',
      data_cadastro: user.data_cadastro
    };

    res.json(userData);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};