import pool from "../connection.js";

export async function findProfissionalByEmailOrCpf(email, cpf) {
    const result = await pool.query(
        "SELECT * FROM candidatos WHERE email=$1 OR cpf=$2",
        [email, cpf]
    );
    return result.rows[0];
}

export async function createProfissional(profissional) {
    const { nome_completo, cpf, email, telefone, crm, especializacoes, senha_hash } = profissional;

    await pool.query(
        "INSERT INTO candidatos (nome_completo, cpf, email, telefone, crm, especializacoes, senha_hash) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        [nome_completo, cpf, email, telefone, crm, especializacoes, senha_hash]
    );
}