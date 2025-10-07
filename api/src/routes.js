  import { Router } from "express";

  // Controllers existentes...
  import {
    registerProfissionalController,
    getProfissionaisController,
    getProfissionalByIdController,
    updateProfissionalController
  } from "./Controller/profissionalController.js";

  import {
    createVagaController,
    getVagasController,
    getVagaByIdController,
    updateVagaController,
    deleteVagaController
  } from "./Controller/vagaController.js";

  import {
    createArtigoController,
    getArtigosController,
    getArtigoByIdController,
    updateArtigoController,
    deleteArtigoController
  } from "./Controller/artigosController.js";

  import {
    getCategoriasController,
    getCategoriaByIdController,
    createCategoriaController,
    updateCategoriaController,
    deleteCategoriaController
  } from "./Controller/categoriasController.js";

  import {
    getEmpresasController,
    getEmpresaByIdController,
    createEmpresaController,
    updateEmpresaController,
    deleteEmpresaController
  } from "./Controller/empresaController.js";

  import {
    registerInscricaoController,
    getInscricoesByVagaController,
    getInscricoesByUsuarioController,
    updateStatusInscricaoController
  } from "./Controller/inscricoesController.js";

  import {
    createCurriculoController,
    getCurriculoByUsuarioController,
    updateCurriculoController
  } from "./Controller/curriculoController.js";


  const router = Router();


  // ----------------- PROFISSIONAIS -----------------
  router.post("/profissionais", registerProfissionalController);
  router.get("/profissionais", getProfissionaisController);
  router.get("/profissionais/:id", getProfissionalByIdController);
  router.put("/profissionais/:id", updateProfissionalController);

  // ----------------- CURRÍCULOS -----------------
router.post("/curriculos", createCurriculoController);
router.get("/curriculos/usuario/:id_usuario", getCurriculoByUsuarioController);
router.put("/curriculos/:id_curriculo", updateCurriculoController);
router.post("/curriculos/salvar", createCurriculoController);

  // ----------------- EMPRESAS -----------------
  router.get("/empresas", getEmpresasController);
  router.get("/empresas/:id", getEmpresaByIdController);
  router.post("/empresas", createEmpresaController);
  router.put("/empresas/:id", updateEmpresaController);
  router.delete("/empresas/:id", deleteEmpresaController);

  // ----------------- CATEGORIAS -----------------
  router.get("/categorias", getCategoriasController);
  router.get("/categorias/:id", getCategoriaByIdController);
  router.post("/categorias", createCategoriaController);
  router.put("/categorias/:id", updateCategoriaController);
  router.delete("/categorias/:id", deleteCategoriaController);

  // ----------------- ARTIGOS -----------------
  router.get("/artigos", getArtigosController);
  router.get("/artigos/:id", getArtigoByIdController);
  router.post("/artigos", createArtigoController);
  router.put("/artigos/:id", updateArtigoController);
  router.delete("/artigos/:id", deleteArtigoController);

  // ----------------- VAGAS -----------------
  router.get("/vagas", getVagasController);
  router.get("/vagas/:id", getVagaByIdController);
  router.post("/vagas", createVagaController);
  router.put("/vagas/:id", updateVagaController);
  router.delete("/vagas/:id", deleteVagaController);

  // ----------------- INSCRIÇÕES -----------------
router.post("/inscricoes", registerInscricaoController);
router.get("/inscricoes/vaga/:id_vaga", getInscricoesByVagaController);
router.get("/inscricoes/usuario/:id_usuario", getInscricoesByUsuarioController);
router.put("/inscricoes/:id/status", updateStatusInscricaoController);

  export default router;