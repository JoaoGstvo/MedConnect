import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login/index.js';
import Signup from './Pages/Cadastro/index.js';


export default function Index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Signup/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
        </BrowserRouter>
    )
}