import { useState } from 'react';
import styles from './joinGame.module.css';
import '../../App.css';
import RoomButton from '../../components/roomButton/RoomButton';

interface Room {
  id: number;
  name: string;
}

function JoinGame() {
  const [rooms, setRooms] = useState<Room[]>([]);

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

        {/* 방 목록 */}
        <div className={styles.roomList}>
          {rooms.map((room) => (
            <RoomButton
                key={room.id}
                roomName={room.name}
                currentCount={1} // 또는 임시로 Math.floor(Math.random() * 4) + 1 도 가능
                onClick={() => alert(`${room.name} 입장!`)}
            />
            ))}
        </div>

        {/* 방 생성 버튼 */}
        <button className={styles.createRoomBtn} onClick={createRoom}>
          +
        </button>
      </div>
    </>
  );
}

export default JoinGame;
