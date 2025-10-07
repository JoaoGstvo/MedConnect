import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login/index.js';
import LandingPage from './Pages/LandingPage/index.js'
import Signup from './Pages/Cadastro/index.js';
import BusnessProfile from './Pages/PerfilEmpresa/index.js';
import ProfissionalProfile from './Pages/PerfilProfissional/index.js';
import Artigos from './Pages/Artigos/index.js';
import NovoArtigoPage from './Pages/Artigos/NovoArtigo/index.js';
import EmpresaPage from './Pages/Empresa/index.js';
import VagasPage from './Pages/Vagas/index.js';
import MinhasVagas from './Pages/Vagas/Minhas Vagas/index.js';
import PostarVaga from './Pages/Vagas/Postarvaga/index.js';
import LandingPage1 from './Pages/LandingPage1/index.js';
import DashboardEmpresaPage from './Pages/Dashboard Empresa/index.js';
import DashboardCandidatoPage from './Pages/Dashboard Candidato/index.js';
import MeuCurriculo from './Pages/PerfilProfissional/Curriculo/index.js';
import MaisInformacoesPage from './Pages/Vagas/maisinformações/index.js';
import InscricaoPage from './Pages/Vagas/inscrição/index.js';
import GerenciamentoCandidatosPage from './Pages/gerenciamentocandidato/index.js';
import ContatoPage from './Pages/Contato/index.js';
import InscricaoSucessoPage from './Pages/Vagas/inscrição/incricaosucesso/index.js';
import ContatoProfissionalPage from './Pages/ContatoProfissional/index.js';
import MensagemSucessoPage from './Pages/PerfilProfissional/menssagemsucesso/index.js';
import ArtigoPublicadoPage from './Pages/Artigos/ArtigoPublicado/index.js';
import EsqueceuSenha from './Pages/Login/EsqueceuSenha/index.js';
import CardArtigo from './Components/CardArtigo/index.js';


export default function Index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/cardartigo" element={<CardArtigo />} />
                <Route path="/inicial" element={<LandingPage1 />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/senha" element={<EsqueceuSenha />} />
                <Route path="/perfilempresa" element={<BusnessProfile />} />
                <Route path="/perfilprofissional" element={<ProfissionalProfile />} />
                <Route path="/artigos" element={<Artigos />} />
                <Route path="/novoartigo" element={<NovoArtigoPage />} />
                <Route path="/artigopublicado" element={<ArtigoPublicadoPage />} />
                <Route path="/empresas" element={<EmpresaPage />} />
                <Route path="/vagas" element={<VagasPage />} />
                <Route path="/minhasvagas" element={<MinhasVagas />} />
                <Route path="/postarvaga" element={<PostarVaga />} />
                <Route path="/informacoesvaga" element={<MaisInformacoesPage />} />
                <Route path="/inscricaovaga" element={<InscricaoPage />} />
                <Route path="/inscricaovagasucesso" element={<InscricaoSucessoPage />} />
                <Route path="/dashempresa" element={<DashboardEmpresaPage />} />
                <Route path="/meucurriculo" element={<MeuCurriculo />} />
                <Route path="/gerenciamentocandidato" element={<GerenciamentoCandidatosPage />} />
                <Route path="/contatoprofissional" element={<ContatoProfissionalPage />} />
                <Route path="/mensagemenviadaprofissional" element={<MensagemSucessoPage />} />
                <Route path="/faqsite" element={<ContatoPage />} />
                <Route path="/hospital" element={<hospital />} />
                <Route path="/vagas" element={<VagasPage />} />
                <Route path="/minhas-vagas" element={<MinhasVagas />} />
                <Route path="/inscricaovaga/:id" element={<InscricaoPage />} />
                <Route path="/vaga/:id" element={<MaisInformacoesPage />} />
                <Route path="/candidato/dashboard" element={<DashboardCandidatoPage />} />
      




            </Routes>
        </BrowserRouter>
    )
}