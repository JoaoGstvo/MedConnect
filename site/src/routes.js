import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login/index.js';
import LandingPage from './Pages/LandingPage/index.js'
import Signup from './Pages/Cadastro/index.js';
import BusnessProfile from './Pages/PerfilEmpresa/index.js';
import ProfissionalProfile from './Pages/PerfilProfissional/index.js';
import Artigos from './Pages/Artigos/index.js';
import NovoArtigoPage from './Pages/NovoArtigo/index.js';
import EmpresaPage from './Pages/Empresa/index.js';
import VagasPage from './Pages/Vagas/index.js';

export default function Index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/perfilempresa" element={<BusnessProfile/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/cadastro" element={<Signup/>} />
                <Route path="/perfilprofissional" element={<ProfissionalProfile/>} />
                <Route path="/artigos" element={<Artigos/>} />
                <Route path="/novoartigo" element={<NovoArtigoPage/>} />
                <Route path="/empresas" element={<EmpresaPage/>} />
                <Route path="/vagas" element={<VagasPage/>} />
            </Routes>
        </BrowserRouter>
    )
}