import { Router } from "express";
import { registerUser } from './Controller/profissionalController.js';
import { loginUser } from './Controller/profissionalController.js';

const router = Router();



// cadastro
router.post("/profissional/register", registerUser);

// login
router.post("/profissional/login", loginUser);


export default router;
