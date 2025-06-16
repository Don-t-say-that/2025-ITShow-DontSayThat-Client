import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home/home.tsx';
import Menu from './pages/menu/menu.tsx';
import JoinGame from './pages/joinGame/joinGame.tsx';
import RegisterUser from './pages/registerUser/registerUser.tsx';
import CreateRoom from './pages/createRoom/createRoom.tsx';
import GameDescription from './pages/gameDescription/gameDescription.tsx';
import RandomCharacter from './pages/randomCharacter/randomCharacter.tsx';
import WaitingRoom from './pages/waitingRoom/waitingRoom.tsx';
// import ChatGame from './pages/chatGame/chatGame.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/joinGame" element={<JoinGame />} />
        <Route path= "/registerUser" element={<RegisterUser/> } />
        <Route path='/createRoom' element={<CreateRoom />} />
        <Route path='/gameDescription' element={<GameDescription/>} />
        <Route path='/randomCharacter' element={<RandomCharacter/>} />
        <Route path='/waitingRoom' element={<WaitingRoom />} />
        {/* <Route path='/chatGame' element={<ChatGame />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
