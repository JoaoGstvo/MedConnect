import { Router } from "express";
import { registerUser } from './Controller/profissionalController.js';

const router = Router();

// Rota de cadastro do candidato
router.post("/profissional/register", registerUser);


export default router;
