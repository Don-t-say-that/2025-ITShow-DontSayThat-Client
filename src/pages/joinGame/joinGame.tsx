import { useEffect } from 'react';
import styles from './joinGame.module.css';
import '../../App.css';
import RoomButton from '../../components/roomButton/RoomButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useRoomStore from '../../store/roomStore';
import useNavigationStore from '../../store/navigationStore';
import useSocket from '../../hooks/useSocket';
import { SlArrowLeft } from 'react-icons/sl';

interface Room {
  id: number;
  name: string;
  userCount: number;
}

function JoinGame() {
  const { rooms, setRooms, setTeamId } = useRoomStore();
  const navigate = useNavigate();
  const setMode = useNavigationStore((state) => state.setMode);
  const socket = useSocket();

  const handleCreateUser = () => {
    setMode('create');
    navigate('/registerUser');
  };

 const handleJoinRoom = async (teamId: number) => {
    setTeamId(teamId);
    setMode('join');
    navigate('/registerUser');
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get<Room[]>(`${import.meta.env.VITE_BASE_URL}/teams/waiting`);
        setRooms(response.data);
      } catch (error) {
        console.error('방 목록 불러오기 실패:', error);
      }
    };

    fetchRooms();

    const handleTeamCreated = (newRoom: Room) => {
      setRooms((prevRooms) => [...prevRooms, newRoom]);
    };

    const handleTeamDeleted = ({ teamId }: { teamId: number }) => {
      setRooms((prevTeams: any[]) => prevTeams.filter(team => team.id !== teamId));
    };

    const handleUserCountUpdated = ({ teamId, userCount }: { teamId: number; userCount: number }) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === teamId ? { ...room, userCount } : room
        )
      );
    };

    socket.on('teamCreated', handleTeamCreated);
    socket.on('teamDeleted', handleTeamDeleted);
    socket.on('userCountUpdated', handleUserCountUpdated);

    return () => {
      socket.off('teamCreated', handleTeamCreated);
      socket.off('teamDeleted', handleTeamDeleted);
      socket.off('userCountUpdated', handleUserCountUpdated);
    };
  }, [setRooms, socket]);

  const handleArrowClick = () => {
    navigate('/');
  };

  return (
    <>
      <div className={styles.background}>
        <SlArrowLeft size={'2.6vw'} color='white' fontWeight={50} onClick={handleArrowClick} className={styles.arrow}/>
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
