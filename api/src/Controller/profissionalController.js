import bcrypt from "bcrypt";
import { createProfissional, findProfissionalByEmailOrCpf, findProfissionalByEmail } from "../Repository/profissionalRepository.js";

export async function registerUser(req, res) {
    try {
        const { nome_completo, cpf, email, telefone, crm, especializacoes, senha } = req.body;

        if (!nome_completo || !cpf || !email || !senha) {
            return res.status(400).json({ msg: "Preencha os campos obrigatórios" });
        }

        const existingUser = await findProfissionalByEmailOrCpf(email, cpf);
        if (existingUser) {
            return res.status(400).json({ msg: "Email ou CPF já cadastrados" });
        }

        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);

        await createProfissional({ nome_completo, cpf, email, telefone, crm, especializacoes, senha_hash });

        res.status(201).json({ msg: "Profissional cadastrado com sucesso 🔥" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erro no servidor" });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ msg: "Informe email e senha" });
        }

        const user = await findProfissionalByEmail(email);
        if (!user) {
            return res.status(400).json({ msg: "Usuário não encontrado" });
        }

        const senhaValida = await bcrypt.compare(senha, user.senha_hash);
        if (!senhaValida) {
            return res.status(400).json({ msg: "Senha inválida" });
        }

        res.json({
            msg: "Login realizado com sucesso ✅",
            id: user.id_candidato,
            nome: user.nome_completo,
            email: user.email
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erro no servidor" });
    }
}
