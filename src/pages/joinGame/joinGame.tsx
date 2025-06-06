import { useState } from 'react';
import styles from './joinGame.module.css';
import '../../App.css';
import RoomButton from '../../components/roomButton/RoomButton';
import { useNavigate } from 'react-router-dom';

interface Room {
  id: number;
  name: string;
}

function JoinGame() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const navigate = useNavigate();
  const handleBackgroundClick = () => {
    navigate('/registerUser');
  };

  const createRoom = () => {
    const newRoom: Room = {
      id: rooms.length + 1,
      name: `방 ${rooms.length + 1}`,
    };
    setRooms([...rooms, newRoom]);
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
                currentCount={1}  // 임시로
                onClick={() => alert(`${room.name} 입장!`)}
            />
            ))}
        </div>
        <button className={styles.createRoomBtn} onClick={handleBackgroundClick}>
          +
        </button>
      </div>
    </>
  );
}

export default JoinGame;
