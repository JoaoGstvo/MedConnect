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
import LandingPage1 from './Pages/LandingPage1/index.js';
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

export default function Index() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/inicial" element={<LandingPage1 />} />  {/*pagina 1*/}
                <Route path="/" element={<LandingPage />} /> {/*pagina principal*/}
                <Route path="/cadastro" element={<Signup />} /> {/*cadastro geral*/}
                <Route path="/login" element={<Login />} /> {/*login geral*/}
                <Route path="/senha" element={<EsqueceuSenha />} /> {/*esqueceu a senha*/}
                <Route path="/artigos" element={<Artigos />} /> {/*tela de artigos*/}
                <Route path="/artigopublicado" element={<ArtigoPublicadoPage />} /> {/*tela de artigo criado com sucesso*/}
                <Route path="/empresas" element={<EmpresaPage />} /> {/*tela de empresas*/}
                <Route path="/vagas" element={<VagasPage />} /> {/*tela de vagas*/}
                <Route path="/informacoesvaga" element={<MaisInformacoesPage />} /> {/*tela de mais informações da vaga*/}
                <Route path="/faqsite" element={<ContatoPage />} /> {/*suporte site*/}
                <Route path="/vaga/:id" element={<MaisInformacoesPage />} /> {/*tela de mais informações da vaga (ID)*/}
                <Route path="/cardcandidato" element={<CardCandidato />} />
                <Route path="/cardempresa" element={<CardEmpresa />} />

                {/* Rotas protegidas - requerem autenticação */}
                <Route path="/minhasvagas" element={
                    <ProtectedRoute>
                        <MinhasVagas />
                    </ProtectedRoute>
                } /> {/*tela de vagas do candidato*/}

                <Route path="/novoartigo" element={
                    <ProtectedRoute>
                        <NovoArtigoPage />
                    </ProtectedRoute>
                } /> {/*tela de criação de artigos*/}

                <Route path="/inscricaovaga" element={
                    <ProtectedRoute>
                        <InscricaoPage />
                    </ProtectedRoute>
                } /> {/*tela de inscrição na vaga*/}

                <Route path="/inscricaovaga/:id" element={
                    <ProtectedRoute>
                        <InscricaoPage />
                    </ProtectedRoute>
                } /> {/*tela de inscrição na vaga (ID)*/}

                <Route path="/inscricaovagasucesso" element={
                    <ProtectedRoute>
                        <InscricaoSucessoPage />
                    </ProtectedRoute>
                } /> {/*tela de inscrição na vaga com sucesso*/}

                <Route path="/dashboardempresa" element={
                    <ProtectedRoute>
                        <DashboardEmpresaPage />
                    </ProtectedRoute>
                } /> {/*dashboard da empresa*/}

                <Route path="/meucurriculo" element={
                    <ProtectedRoute>
                        <MeuCurriculo />
                    </ProtectedRoute>
                } /> {/*tela do curriculo do candidato*/}

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
            </Routes>
        </BrowserRouter>
    )
}