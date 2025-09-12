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
import MinhasVagas from './Pages/Minhas Vagas/index.js';
import PostarVaga from './Pages/Postarvaga/index.js';
import LandingPage1 from './Pages/LandingPage1/index.js';
import DashboardEmpresaPage from './Pages/Dashboard Empresa/index.js';
import DashboardCandidatoPage from './Pages/Dashboard Candidato/index.js';
import MeuCurriculo from './Pages/Curriculo/index.js';
import MaisInformacoesPage from './Pages/maisinformações/index.js';
import InscricaoPage from './Pages/inscrição/index.js';


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
                <Route path="/minhasvagas" element={<MinhasVagas/>} />
                <Route path="/postarvaga" element={<PostarVaga/>} />
                <Route path="/inicial" element={<LandingPage1/>} />
                <Route path="/dashempresa" element={<DashboardEmpresaPage/>} />
                <Route path="/dashcandidato" element={<DashboardCandidatoPage/>} />
                <Route path="/meucurriculo" element={<MeuCurriculo/>} />
                <Route path="/informacoes" element={<MaisInformacoesPage/>} />
                <Route path="/inscricao" element={<InscricaoPage/>} />
            </Routes>
        </BrowserRouter>
    )
}