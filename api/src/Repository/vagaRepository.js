import pool from "../connection.js"; // <-- ESSA LINHA IMPORTA O POOL

export async function createVaga(vaga) {
    const { titulo, descricao, tipo_contrato, requisitos, salario } = vaga;
    console.log("Tentando inserir vaga:", vaga);

    const result = await pool.query(
        `INSERT INTO vagas (titulo, descricao, tipo_contrato, requisitos, salario, data_publicacao) 
         VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
        [titulo, descricao, tipo_contrato, requisitos, salario]
    );

    console.log("Vaga inserida:", result.rows[0]);
    return result.rows[0];
}

export async function getVagas() {
    const result = await pool.query(`SELECT * FROM vagas ORDER BY data_publicacao DESC`);
    return result.rows;
}
