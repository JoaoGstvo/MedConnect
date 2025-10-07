import * as curriculoRepository from '../Repository/curriculoRepository.js';

export async function createCurriculoController(req, res) {
    try {
        console.log('Body recebido no controller:', req.body);
        
        const { id_usuario, ...dadosCurriculo } = req.body;
        
        if (!id_usuario) {
            return res.status(400).json({ error: "ID do usuário é obrigatório" });
        }

        const curriculo = await curriculoRepository.createCurriculo(id_usuario, dadosCurriculo);
        
        res.status(201).json({
            message: 'Currículo criado com sucesso',
            curriculo
        });
    } catch (error) {
        console.error('Erro detalhado no createCurriculoController:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getCurriculoByUsuarioController(req, res) {
    try {
        const { id_usuario } = req.params;
        
        if (!id_usuario || isNaN(id_usuario)) {
            return res.status(400).json({ error: 'ID do usuário inválido' });
        }
        
        const curriculo = await curriculoRepository.getCurriculoByUsuario(parseInt(id_usuario));
        
        if (!curriculo) {
            return res.status(404).json({ error: 'Currículo não encontrado' });
        }
        
        res.json(curriculo);
    } catch (error) {
        console.error('Erro no getCurriculoByUsuarioController:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function updateCurriculoController(req, res) {
    try {
        const { id_curriculo } = req.params;
        const updates = req.body;
        
        console.log('Atualizando currículo ID:', id_curriculo);
        console.log('Dados de atualização:', updates);
        
        if (!id_curriculo || isNaN(id_curriculo)) {
            return res.status(400).json({ error: 'ID do currículo inválido' });
        }
        
        const curriculo = await curriculoRepository.updateCurriculo(parseInt(id_curriculo), updates);
        
        res.json({
            message: 'Currículo atualizado com sucesso',
            curriculo
        });
    } catch (error) {
        console.error('Erro no updateCurriculoController:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function createOrUpdateCurriculoController(req, res) {
    try {
        const { id_usuario, ...dadosCurriculo } = req.body;
        
        if (!id_usuario) {
            return res.status(400).json({ error: "ID do usuário é obrigatório" });
        }

        const curriculo = await curriculoRepository.createOrUpdateCurriculo(id_usuario, dadosCurriculo);
        
        res.json({
            message: 'Currículo salvo com sucesso',
            curriculo
        });
    } catch (error) {
        console.error('Erro no createOrUpdateCurriculoController:', error);
        res.status(500).json({ error: error.message });
    }
}