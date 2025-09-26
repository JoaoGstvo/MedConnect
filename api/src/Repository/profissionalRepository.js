import pool from "../connection.js";


// cria profissional (Cadastro)
export async function createProfissional(profissional) {
    const { nome_completo, cpf, email, telefone, crm, especializacoes, senha_hash } = profissional;
    await pool.query(
        "INSERT INTO candidatos (nome_completo, cpf, email, telefone, crm, especializacoes, senha_hash) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        [nome_completo, cpf, email, telefone, crm, especializacoes, senha_hash]
    );
}


// busca por email ou cpf (Cadastro)
export async function findProfissionalByEmailOrCpf(email, cpf) {
    const result = await pool.query(
        "SELECT * FROM candidatos WHERE email=$1 OR cpf=$2",
        [email, cpf]
    );
    return result.rows[0];
}




// busca por email (Login)
export async function findProfissionalByEmail(email) {
    const result = await pool.query(
        "SELECT * FROM candidatos WHERE email=$1",
        [email]
    );
    return result.rows[0];
}