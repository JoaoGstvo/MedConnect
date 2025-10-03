import pool from "../connection.js";

export async function createEmpresaCadastro({ nome_empresa, cnpj, email, telefone, endereco, senha }) {
  const query = `
    INSERT INTO empresas (nome_empresa, cnpj, email, telefone, endereco, senha)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [nome_empresa, cnpj, email, telefone, endereco, senha];
  const result = await pool.query(query, values);
  return result.rows[0];
}