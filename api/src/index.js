import express from 'express';
import cors from 'cors';
import "dotenv/config";
import router from './routes.js';

const server = express();

server.use(cors());
server.use(express.json())

server.use(express.json());
server.use(express.urlencoded({ extended: true }));;


server.use("/api", router);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`A Braba Ta On Na Porta ${PORT} 🔥`));
