import pool from "../connection.js";

export async function createVaga(vaga) {
    const { titulo, descricao, tipo_contrato, requisitos, salario } = vaga;

    const result = await pool.query(
        `INSERT INTO vagas (titulo, descricao, tipo_contrato, requisitos, salario, data_publicacao) 
         VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
        [titulo, descricao, tipo_contrato, requisitos, salario]
    );

    return result.rows[0];
}
