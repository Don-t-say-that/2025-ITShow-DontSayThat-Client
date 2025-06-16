import styles from './waitingRoom.module.css';
import '../../App.css';
import { SlArrowLeft } from "react-icons/sl";
import ActionButton from '../../components/ActionButton/ActionButton';
import UserBox from '../../components/userBox/UserBox';
import useWaitingRoomStore from '../../store/waitingStore';
import useRoomStore from '../../store/roomStore';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import useSocket from '../../hooks/useSocket';


type WaitingRoomUser = {
  id: number;
  name: string;
  character: string;
  characterId: number;
  isLeader: boolean;
};

function WaitingRoom() {
  const { users, setUsers } = useWaitingRoomStore() as {
    users: WaitingRoomUser[];
    setUsers: (users: WaitingRoomUser[] | ((prevUsers: WaitingRoomUser[]) => WaitingRoomUser[])) => void;
  };

  const teamId = useRoomStore((state) => state.teamId);
  const userId = useUserStore((state) => state.id);
  const socket = useSocket();
  const navigate = useNavigate();


  const isMounted = useRef(true);


  const safeUsers = Array.isArray(users) ? users : [];

  // 현재 사용자 찾기
  const currentUser = useMemo(() => {
    if (!Array.isArray(safeUsers) || userId === undefined || userId === null) return undefined;
    return safeUsers.find((user) => user.id === Number(userId));
  }, [safeUsers, userId]);

  const isLeader = currentUser?.isLeader;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const loadInitialUsers = async () => {
      if (!teamId) return;

      try {
        console.log(`사용자 목록 ${teamId}`);
        const response = await axios.get(`http://localhost:3000/teams/${teamId}/users`);

        if (isSubscribed && isMounted.current) {
          const userData = Array.isArray(response.data) ? response.data : [];
          setUsers(userData);
        }
      } catch (error) {
        console.error('사용자 목록 로딩 실패', error);
      }
    };

    if (teamId) {
      loadInitialUsers();
    }

    return () => {
      isSubscribed = false;
    };
  }, [teamId]);


  useEffect(() => {
    console.log(`소켓 실행 socket: ${!!socket}, teamId: ${teamId}, userId: ${userId}`);

    if (!socket || !teamId || !userId) {
      console.log(`소켓, teamId 또는 userId가 없어서 리턴`);
      return;
    }

    socket.emit('joinRoom', { teamId, userId });

    const handleUserJoined = (userData: WaitingRoomUser) => {
      if (isMounted.current) {
        setUsers(prevUsers => {
          const safePrevUsers = Array.isArray(prevUsers) ? prevUsers : [];
          const userExists = safePrevUsers.some(user => user.id === userData.id);
          if (userExists) {
            return safePrevUsers;
          }
          return [...safePrevUsers, userData];
        });
      }
    };

    const handleUserLeft = (userData: { userId: number }) => {
      console.log('사용자 퇴장:', userData);
      if (isMounted.current) {
        setUsers(prevUsers => {
          const safePrevUsers = Array.isArray(prevUsers) ? prevUsers : [];
          return safePrevUsers.filter(user => user.id !== userData.userId);
        });
      }
    };

    const handleUsersUpdated = (updatedUsers: WaitingRoomUser[]) => {
      console.log('사용자 목록 업데이트:', updatedUsers);
      if (isMounted.current) {
        const userData = Array.isArray(updatedUsers) ? updatedUsers : [];
        setUsers(userData);
      }
    };


    const handleConnect = () => {
      console.log('소켓 재연결');
      if (isMounted.current) {
        socket.emit('joinRoom', { teamId, userId });
        axios.get(`http://localhost:3000/teams/${teamId}/users`)
          .then(response => {
            if (isMounted.current) {
              const userData = Array.isArray(response.data) ? response.data : [];
              setUsers(userData);
            }
          })
          .catch(error => console.error('재연결 시 사용자 목록 로딩 실패:', error));
      }
    };

    const handleDisconnect = (reason: string) => {
      console.log('소켓 연결 끊어짐:', reason);
    };

    const handleError = (error: any) => {
      console.error('소켓 에러:', error);
    };

    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('usersUpdated', handleUsersUpdated);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);

    return () => {
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('usersUpdated', handleUsersUpdated);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
    };
  }, [socket, teamId, userId]);

  const activeUsersCount = safeUsers.filter(user => user.name !== '').length;

  const positionToCharacterId = [3, 4, 2, 1];

  const fullUsersList = Array.from({ length: 4 }).map((_, index) => {
    const targetCharacterId = positionToCharacterId[index];
    const userForThisPosition = safeUsers.find(user =>
      user.name !== '' && user.characterId === targetCharacterId
    );

    return userForThisPosition || {
      id: index,
      name: '',
      character: '',
      characterId: 0,
      isLeader: false,
    };
  });

  const handleArrowClick = () => {
    navigate('/joinGame');
  };

  const handleStartGame = () => {
    // 게임 시작 로직
  };

  return (
    <div className={styles.background}>
      <div className={styles.titleContainer}>
        <SlArrowLeft size={'2.6vw'} color='white' fontWeight={50} onClick={handleArrowClick} />
        <p className={styles.title}>대기방 ({activeUsersCount}/4)</p>
      </div>

      <div className={styles.userContainer}>
        {fullUsersList.map((user, index) => (
          <UserBox
            key={index}
            isEmpty={user.name === ''}
            boxIndex={index}
          />
        ))}
      </div>

      <div className={styles.startButtonWrapper}>
        {userId !== null && currentUser && isLeader && (
          <ActionButton onClick={handleStartGame}>게임시작</ActionButton>
        )}
      </div>
    </div>
  );
}

export default WaitingRoom;