// routes.js - VERIFIQUE SE ESTÁ ASSIM
import { Router } from "express";
import { registerUser } from "./Controller/profissionalController.js";
import { createVagaController, getVagasController } from "./Controller/vagaController.js";
import { createArtigoController, getArtigosController, getArtigoByIdController } from "./Controller/artigosController.js";
import { getCategoriasController, getCategoriaByIdController, createCategoriaController } from "./Controller/categoriasController.js";
import { getEmpresasController, getEmpresaByIdController, createEmpresaController } from "./Controller/empresaController.js";
import {
  createEmpresaCadastroController,
  getEmpresasCadastroController,
  getEmpresaCadastroByIdController,
  updateEmpresaCadastroController,
  deleteEmpresaCadastroController,
} from "./Controller/empresaCadastroController.js";


const router = Router();

// Profissional
router.post("/profissional", registerUser);

// Vagas
router.post("/vaga", createVagaController);
router.get("/vagas", getVagasController);

// Artigos
router.post("/artigos", createArtigoController);
router.get("/artigos", getArtigosController);
router.get("/artigos/:id", getArtigoByIdController);

// Categorias Artigos
router.get("/categorias", getCategoriasController);
router.get("/categorias/:id", getCategoriaByIdController);
router.post("/categorias", createCategoriaController);

// ✅ EMPRESAS - VERIFIQUE SE ESTÁ ADICIONADO
router.get("/empresas", getEmpresasController);
router.get("/empresas/:id", getEmpresaByIdController);
router.post("/empresas", createEmpresaController);

// Criando Empresas
router.post("/", createEmpresaCadastroController);
router.get("/", getEmpresasCadastroController);
router.get("/:id", getEmpresaCadastroByIdController);
router.put("/:id", updateEmpresaCadastroController);
router.delete("/:id", deleteEmpresaCadastroController);

export default router;