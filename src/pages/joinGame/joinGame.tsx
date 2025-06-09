import { useEffect, useState } from 'react';
import styles from './joinGame.module.css';
import '../../App.css';
import RoomButton from '../../components/roomButton/RoomButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Room {
  id: number;
  name: string;
  userCount: number;
}

function JoinGame() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

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

  const handleCreateUser = () => {
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
              onClick={() => alert(`${room.name} 입장!`)}
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
