import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/Hooks/ProtectedRoute';

import Login from './Pages/Login/index.js';
import LandingPage from './Pages/LandingPage/index.js'
import Signup from './Pages/Cadastro/index.js';
import Artigos from './Pages/Artigos/index.js';
import NovoArtigoPage from './Pages/Artigos/NovoArtigo/index.js';
import EmpresaPage from './Pages/Empresa/index.js';
import VagasPage from './Pages/Vagas/index.js';
import MinhasVagas from './Pages/Vagas/Minhas Vagas/index.js';
import TelacInicial from './Pages/TelaInicial/index.js';
import DashboardEmpresaPage from './Pages/Dashboard Empresa/index.js';
import MeuCurriculo from './Pages/PerfilProfissional/Curriculo/index.js';
import MaisInformacoesPage from './Pages/Vagas/maisinformações/index.js';
import InscricaoPage from './Pages/Vagas/inscrição/index.js';
import ContatoPage from './Pages/Contato/index.js';
import InscricaoSucessoPage from './Pages/Vagas/inscrição/incricaosucesso/index.js';
import ContatoProfissionalPage from './Pages/ContatoProfissional/index.js';
import MensagemSucessoPage from './Pages/PerfilProfissional/menssagemsucesso/index.js';
import ArtigoPublicadoPage from './Pages/Artigos/ArtigoPublicado/index.js';
import EsqueceuSenha from './Pages/Login/EsqueceuSenha/index.js';
import CardCandidato from './Components/CardCandidato/index.js';
import CardEmpresa from './Components/CardEmpresa/index.js';
import EditarArtigoPage from './Pages/Artigos/EditarArtigo/index.js';

export default function Index() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/inicio" element={<TelacInicial />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/senha" element={<EsqueceuSenha />} />
                <Route path="/artigos" element={<Artigos />} />
                <Route path="/artigopublicado" element={<ArtigoPublicadoPage />} />
                <Route path="/empresas" element={<EmpresaPage />} />
                <Route path="/vagas" element={<VagasPage />} />
                <Route path="/informacoesvaga" element={<MaisInformacoesPage />} />
                <Route path="/faqsite" element={<ContatoPage />} />
                <Route path="/vaga/:id" element={<MaisInformacoesPage />} />
                <Route path="/cardcandidato" element={<CardCandidato />} />
                <Route path="/cardempresa" element={<CardEmpresa />} />

                {/* Rota de inscrição */}
                <Route path="/inscricaovaga/:id" element={
                    <ProtectedRoute>
                        <InscricaoPage />
                    </ProtectedRoute>
                } />

                <Route path="/inscricaovagasucesso" element={
                    <ProtectedRoute>
                        <InscricaoSucessoPage />
                    </ProtectedRoute>
                } />

                {/* Dashboard empresa */}
                <Route path="/dashboardempresa" element={
                    <ProtectedRoute>
                        <DashboardEmpresaPage />
                    </ProtectedRoute>
                } />

                {/* Rotas protegidas para profissionais */}
                <Route path="/minhasvagas" element={
                    <ProtectedRoute>
                        <MinhasVagas />
                    </ProtectedRoute>
                } />

                <Route path="/novoartigo" element={
                    <ProtectedRoute>
                        <NovoArtigoPage />
                    </ProtectedRoute>
                } />

                <Route path="/meucurriculo" element={
                    <ProtectedRoute>
                        <MeuCurriculo />
                    </ProtectedRoute>
                } />

                <Route path="/contatoprofissional" element={
                    <ProtectedRoute>
                        <ContatoProfissionalPage />
                    </ProtectedRoute>
                } />

                <Route path="/mensagemenviadaprofissional" element={
                    <ProtectedRoute>
                        <MensagemSucessoPage />
                    </ProtectedRoute>
                } />

                <Route path="/editar-artigo/:id" element={
                    <ProtectedRoute>
                        <EditarArtigoPage />
                    </ProtectedRoute>
                } />

                {/* Rota de fallback */}
            </Routes>
        </BrowserRouter>
    )
}