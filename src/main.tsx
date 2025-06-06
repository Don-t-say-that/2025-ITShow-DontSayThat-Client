import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home/home.tsx';
import Menu from './pages/menu/menu.tsx';
import JoinGame from './pages/joinGame/joinGame.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/joinGame" element={<JoinGame />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
