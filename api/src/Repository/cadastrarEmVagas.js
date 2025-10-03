import pool from "../connection.js";

export async function createInscricao({ nome, email, telefone, curriculo, mensagem }) {
  const query = `
    INSERT INTO inscricoes (nome, email, telefone, curriculo, mensagem)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [nome, email, telefone, curriculo, mensagem];
  const result = await pool.query(query, values);
  return result.rows[0];
}
