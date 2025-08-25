import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login/index.js';
import LandingPage from './Pages/LandingPage/index.js'
import Signup from './Pages/Cadastro/index.js';
import PerfilEmpresa from './Pages/PerfilEmpresa/index.js'
import PerfilFunc from './Pages/PerfilFunc/index.js'

export default function Index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/cadastro" element={<Signup/>} />
                <Route path="/PerfilEmpresa" element={<PerfilEmpresa/>} />
                <Route path="/PerfilFunc" element={<PerfilFunc/>} />
            </Routes>
        </BrowserRouter>
    )
}