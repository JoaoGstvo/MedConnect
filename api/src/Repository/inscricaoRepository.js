import pool from "../connection.js";

export async function createInscricao(id_vaga, id_usuario) {
  const query = `
    INSERT INTO vaga_candidaturas (id_vaga, id_usuario) 
    VALUES ($1, $2) 
    RETURNING *
  `;
  const values = [id_vaga, id_usuario];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getInscricoesByVaga(id_vaga) {
  const query = `
    SELECT vc.*, u.nome as candidato_nome, u.email as candidato_email
    FROM vaga_candidaturas vc
    JOIN usuarios u ON vc.id_usuario = u.id_usuario
    WHERE vc.id_vaga = $1
  `;
  const result = await pool.query(query, [id_vaga]);
  return result.rows;
}

export async function getInscricoesByUsuario(id_usuario) {
  const query = `
    SELECT vc.*, v.titulo as vaga_titulo, e.nome as empresa_nome
    FROM vaga_candidaturas vc
    JOIN vagas v ON vc.id_vaga = v.id_vaga
    JOIN empresas e ON v.id_empresa = e.id_empresa
    WHERE vc.id_usuario = $1
  `;
  const result = await pool.query(query, [id_usuario]);
  return result.rows;
}

export async function updateStatusInscricao(id_candidatura, status) {
  const query = `
    UPDATE vaga_candidaturas 
    SET status = $1 
    WHERE id_candidatura = $2 
    RETURNING *
  `;
  const result = await pool.query(query, [status, id_candidatura]);
  return result.rows[0];
}