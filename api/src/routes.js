import { Router } from "express";
import { registerUser } from "./Controller/profissionalController.js";
import { createVagaController } from "./Controller/vagaController.js";
import { getVagasController } from "./Controller/vagaController.js";
import { createArtigoController, getArtigosController, getArtigoByIdController } from "./Controller/artigosController.js";
import { getCategoriasController, getCategoriaByIdController, createCategoriaController } from "./Controller/categoriasController.js";


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

//Categorias Artigos
router.get("/categorias", getCategoriasController);
router.get("/categorias/:id", getCategoriaByIdController);
router.post("/categorias", createCategoriaController);

export default router;
