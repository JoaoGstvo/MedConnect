import { Router } from "express";
import { registerUser } from "./Controller/profissionalController.js";
import { createVagaController } from "./Controller/vagaController.js";
import { getVagasController } from "./Controller/vagaController.js";

const router = Router();

// Profissional
router.post("/profissional", registerUser); // CORRETO: POST direto

// Vagas
router.post("/vaga", createVagaController); // POST
router.get("/vagas", getVagasController);  // GET

// Artigos
router.post("/artigos", createArtigoController); // POST
router.get("/artigos", getArtigosController); // GET
router.get("/artigos/:id", getArtigoByIdController); // GET by ID


export default router;
