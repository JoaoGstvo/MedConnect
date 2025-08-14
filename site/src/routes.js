import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login/index.js';

export default function Index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>} />
            </Routes>
        </BrowserRouter>
    )
}