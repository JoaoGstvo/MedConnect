import express from 'express';
import cors from 'cors';
import "dotenv/config";
import routes from './routes.js';
import pool from './connection.js';

const server = express();

server.use(cors());
server.use(express.json());


// Todas as rotas da API vêm do routes.js
server.use("/api", routes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`A Braba Ta On Na Porta ${PORT} 🔥`));
