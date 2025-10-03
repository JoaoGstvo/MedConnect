import * as profissionalRepository from '../Repository/profissionalRepository.js';
import * as empresaRepository from '../Repository/empresaRepository.js';

export async function loginProfissionalController(req, res) {
  try {
    console.log('Corpo da requisição recebido:', req.body);
    
    const { email, senha } = req.body;

    if (!email || !senha) {
      console.log('Email ou senha faltando');
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const profissional = await profissionalRepository.loginProfissional(email, senha);

    if (!profissional) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: profissional.id_usuario,
        nome: profissional.nome,
        email: profissional.email,
        tipo: 'profissional',
        tipo_usuario: profissional.tipo_usuario,
        data_cadastro: profissional.data_cadastro
      }
    });
  } catch (error) {
    console.error('Erro no login do profissional:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function loginEmpresaController(req, res) {
  try {
    console.log('Corpo da requisição recebido (empresa):', req.body);
    
    const { email, senha } = req.body;

    if (!email || !senha) {
      console.log('Email ou senha faltando (empresa)');
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const empresa = await empresaRepository.loginEmpresa(email, senha);

    if (!empresa) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: empresa.id_empresa,
        nome: empresa.nome,
        email: empresa.email,
        cnpj: empresa.cnpj,
        tipo: 'empresa',
        endereco: empresa.endereco,
        logo: empresa.logo,
        descricao: empresa.descricao
      }
    });
  } catch (error) {
    console.error('Erro no login da empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}