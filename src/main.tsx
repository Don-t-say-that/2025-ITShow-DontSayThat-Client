import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home/home.tsx';
import Menu from './pages/menu/menu.tsx';
import JoinGame from './pages/joinGame/joinGame.tsx';
import RegisterUser from './pages/registerUser/registerUser.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/joinGame" element={<JoinGame />} />
        <Route path= "/registerUser" element={<RegisterUser/> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
