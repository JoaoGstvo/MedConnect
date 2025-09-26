import { Router } from "express";
import {registerUser} from "./Controller/profissionalController.js";
import {createVagaController} from "./Controller/vagaController.js";

const router = Router();

// Profissional
router.use("/profissional", registerUser); // aqui o controller já tem o server.post interno

// Rota para criar vaga
router.post("/vaga", createVagaController);

export default router;
