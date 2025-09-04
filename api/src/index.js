import express from 'express';
import cors from 'cors';
import "dotenv/config";
// import pool from './src/Repository/connection.js';


// To criando o servidor Express
const server = express();
// To habilitando o Cors
server.use(cors());
// To habilitando fazer requisições com formato JSON
server.use(express.json());







// To iniciando o servidor
server.listen(process.env.PORT, () => console.log(`A Braba Ta On Na Porta ${process.env.PORT}`));