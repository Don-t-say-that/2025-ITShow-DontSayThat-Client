import styles from './waitingRoom.module.css';
import '../../App.css';
import { SlArrowLeft } from "react-icons/sl";
import ActionButton from '../../components/ActionButton/ActionButton';
import UserBox from '../../components/userBox/UserBox';
import useWaitingRoomStore from '../../store/waitingStore';
import useRoomStore from '../../store/roomStore';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import useSocket from '../../hooks/useSocket';
import { useMemo } from 'react';
import useModalStore from '../../store/ModalStore';
import Modal from '../../components/Modal/Modal';

type WaitingRoomUser = {
  id: number;
  name: string;
  character: string;
  characterId: number;
  isLeader: boolean;
  isReady: boolean;
};

function WaitingRoom() {
  const { users, setUsers } = useWaitingRoomStore() as {
    users: WaitingRoomUser[];
    setUsers: (users: WaitingRoomUser[] | ((prevUsers: WaitingRoomUser[]) => WaitingRoomUser[])) => void;
  };
  const { setBackgroundImage } = useRoomStore.getState();

  const teamId = useRoomStore((state) => state.teamId);
  const userId = useUserStore((state) => state.id);
  const { showModal, setShowModal } = useModalStore();
  
  const safeUsers = Array.isArray(users) ? users : [];

  const currentUser = useMemo(() => {
    if (!Array.isArray(safeUsers) || userId === undefined || userId === null) return undefined;
    return safeUsers.find((user) => user.id === Number(userId));
  }, [safeUsers, userId]);

  const isLeader = currentUser?.isLeader;
  const socket = useSocket();
  const navigate = useNavigate();

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);


  const handleStartGame = () => {
    if (!socket || !teamId) return;

    const activeUsersCount = safeUsers.filter(user => user.name !== '').length; // 현재 사용자 수

    if (activeUsersCount <= 1) {
      setShowModal(true);
      return;
    }
    socket.emit('startGame', { teamId });
  };



  const exitTeam = async () => {
    try {
      if (socket && teamId && userId) {
        socket.emit('userLeft', { teamId, userId });

        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      await axios.patch(`${import.meta.env.VITE_BASE_URL}/teams/${userId}/users`);
      navigate('/joinGame');
    } catch (error) {
      navigate('/joinGame');
    }
  };

  const refreshUsers = useCallback(async () => {
    if (!teamId) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/teams/${teamId}/users`);

      if (isMounted.current) {
        const userData = Array.isArray(response.data.userTeam) ? response.data.userTeam : [];
        setUsers(userData); // 새로운 사용자 목록으로 업데이트
        setBackgroundImage(response.data.backgroundImage);
      }
    } catch (error) {
      console.error('사용자 목록 새로고침 실패:', error);
    }
  }, [teamId, setUsers]);


  useEffect(() => {
    if (!socket || !teamId || !userId) return;

    const handleGoToForbidden = () => {
      navigate('/enterForbbiden');
    };

    socket.on('goToForbidden', handleGoToForbidden);

    return () => {
      socket.off('goToForbidden', handleGoToForbidden);
    };
  }, [socket, teamId, userId, navigate]);

  useEffect(() => {
    if (!socket || !teamId) return;

    const handleTeamDeleted = ({ teamId: deletedTeamId }: { teamId: number }) => {
      if (deletedTeamId === teamId) {
        navigate('/joinGame');
      }
    };

    socket.on('teamDeleted', handleTeamDeleted);

    return () => {
      socket.off('teamDeleted', handleTeamDeleted);
    };
  }, [socket, teamId, navigate]);

  useEffect(() => {
    if (teamId) {
      refreshUsers();
    }
  }, [teamId, refreshUsers]);

  useEffect(() => {
    if (!socket || !teamId || !userId) {
      return;
    }

    socket.emit('joinRoom', { teamId, userId });

    const handleUserJoined = (userData: WaitingRoomUser) => {
      if (isMounted.current) {
        refreshUsers();
      }
    };

    const handleUserLeft = (userData: { userId: number }) => {
      if (isMounted.current) {
        refreshUsers();
      }
    };

    const handleUsersUpdated = (updatedUsers: WaitingRoomUser[]) => {
      if (isMounted.current) {
        const userData = Array.isArray(updatedUsers) ? updatedUsers : [];
        setUsers(userData);
      }
    };


    const handleCharacterSelected = (data: { userId: number; characterId: number; character: string }) => {
      if (isMounted.current) {
        setUsers(prevUsers => {
          const safePrevUsers = Array.isArray(prevUsers) ? prevUsers : [];
          return safePrevUsers.map(user =>
            user.id === data.userId
              ? { ...user, characterId: data.characterId, character: data.character }
              : user
          );
        });
      }
    };

    const handleConnect = () => {
      if (isMounted.current) {
        socket.emit('joinRoom', { teamId, userId });
        refreshUsers();
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
    socket.on('characterSelected', handleCharacterSelected);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);

    return () => {
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('usersUpdated', handleUsersUpdated);
      socket.off('characterSelected', handleCharacterSelected);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
    };
  }, [socket, teamId, userId, setUsers, refreshUsers]);

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
      isReady: false,
    };
  });

  const handleArrowClick = () => {
    exitTeam();
    navigate('/joinGame');
  };

  return (
    <div className={styles.background}>
      <div className={styles.titleContainer}>
        <SlArrowLeft size={'2.6vw'} color='white' fontWeight={50} onClick={handleArrowClick} className={styles.arrow}/>
        <p className={styles.title}>대기방 ({activeUsersCount}/4)</p>
      </div>

      <div className={styles.userContainer}>
        {fullUsersList.map((user, index) => (
          <UserBox
            key={index}
            user={user}
            isEmpty={user.name === ''}
            boxIndex={index}
          />
        ))}
      </div>

      <div className={styles.startButtonWrapper}>
        {userId !== null && currentUser?.isLeader === true ? (
          <ActionButton onClick={handleStartGame}>게임시작</ActionButton>
        ) : (
          <p className={styles.waitingText}>방장의 게임 시작을 기다려주세요!</p>
        )}
      </div>

        {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          혼자서는 게임을 시작할 수 없습니다. <br />
          다른 사용자를 기다려주세요!
        </Modal>
      )}

    </div>
  );
}

export default WaitingRoom;