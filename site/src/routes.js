import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login/index.js';
import LandingPage from './Pages/LandingPage/index.js'
import Signup from './Pages/Cadastro/index.js';
import BusnessProfile from './Pages/PerfilEmpresa/index.js';
import ProfissionalProfile from './Pages/PerfilProfissional/index.js';
import ArtigosPage from './Pages/Artigos/index.js';
import CriarArtigoPage from './Pages/Artigos/Criar.js';


export default function Index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/perfilempresa" element={<BusnessProfile/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/cadastro" element={<Signup/>} />
                <Route path="/perfilprofissional" element={<ProfissionalProfile/>} />
                <Route path="/Artigos" element={<ArtigosPage/>} />
                <Route path="Criar/" element={<CriarArtigoPage/>} />
            </Routes>
        </BrowserRouter>
    )
}