import { useEffect, useState } from 'react';
import styles from './joinGame.module.css';
import '../../App.css';
import RoomButton from '../../components/roomButton/RoomButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useRoomStore from '../../store/roomStore';
import useNavigationStore from '../../store/navigationStore';

interface Room {
  id: number;
  name: string;
  userCount: number;
}

function JoinGame() {
  const { rooms, setRooms } = useRoomStore();
  const navigate = useNavigate();
  const setMode = useNavigationStore((state) => state.setMode);

  const handleCreateUser = () => {
    setMode('create'); 
    navigate('/registerUser');
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get<Room[]>('http://localhost:3000/teams/waiting');
        setRooms(response.data);
      } catch (error) {
        console.error('방 목록 불러오기 실패:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleJoinRoom = async (teamId: number) => {
    localStorage.setItem('selectedRoomId', String(teamId));
    setMode('join');
    navigate('/registerUser');
  };

  return (
    <>
      <div className={styles.background}>
        <p className={styles.title}>게임 참가하기</p>
        <div className={styles.roomList}>
          {rooms.map((room) => (
            <RoomButton
              key={room.id}
              roomName={room.name}
              currentCount={room.userCount}
              onClick={() => handleJoinRoom(room.id)}
            />
          ))}
        </div>
        <button className={styles.createRoomBtn} onClick={handleCreateUser}>
          +
        </button>
      </div>
    </>
  );
}

export default JoinGame;
