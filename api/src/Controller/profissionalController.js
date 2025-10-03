import * as profissionalRepository from '../Repository/profissionalRepository.js';

export async function registerProfissionalController(req, res) {
  try {
    const { nome, email, senha, tipo_usuario } = req.body;
    
    const existingUser = await profissionalRepository.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    const user = await profissionalRepository.createUser(nome, email, senha, tipo_usuario);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProfissionaisController(req, res) {
  try {
    const users = await profissionalRepository.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProfissionalByIdController(req, res) {
  try {
    const { id } = req.params;
    const user = await profissionalRepository.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProfissionalController(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const user = await profissionalRepository.updateUser(id, updates);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}