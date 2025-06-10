import styles from './waitingRoom.module.css';
import '../../App.css';
import { SlArrowLeft } from "react-icons/sl";
import ActionButton from '../../components/ActionButton/ActionButton';
import UserBox from '../../components/userBox/UserBox';
import useWaitingRoomStore from '../../store/waitingStore';
import useRoomStore from '../../store/roomStore';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import useUserReady from '../../hooks/useUserReady';

function WaitingRoom() {
  const { users, setUsers } = useWaitingRoomStore();
  const teamId = useRoomStore((state) => state.teamId);
  const userId = useUserStore((state) => state.id);
  const currentUser = users.find(user => user.id === userId);
  const isLeader = currentUser?.isLeader;

  useEffect(() => {
    console.log('users 배열 업데이트:', users);
    console.log('currentUser 업데이트:', currentUser);
  }, [users, currentUser]);

  const { toggleReady } = useUserReady(userId ?? -1, currentUser?.isReady ?? false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/teams/${teamId}/users`);

        const characterImages = [
          'https://i.postimg.cc/Hsvz7tHQ/image.png',
          'https://i.postimg.cc/FH2xTsYz/image.png',
          'https://i.postimg.cc/pL9ZQnX3/image.png',
          'https://i.postimg.cc/CKksXT8N/image.png',
        ];

        const enrichedUsersByCharacter = Array(4).fill(null);
        const assignedCharacterIds: number[] = [];

        response.data.forEach((user: any) => {
          let characterId: number;
          do {
            characterId = Math.floor(Math.random() * 4);
          } while (assignedCharacterIds.includes(characterId));
          assignedCharacterIds.push(characterId);

          enrichedUsersByCharacter[characterId] = {
            ...user,
            character: characterImages[characterId],
          };
        });

        const fullUsersList = enrichedUsersByCharacter.map((user, index) =>
          user || { id: index, name: '', character: '', isLeader: false, isReady: false }
        );

        setUsers(fullUsersList);
      } catch (error) {
        console.error('사용자 목록을 불러오는 데 실패했습니다:', error);
      }
    };
    fetchUsers();
  }, [teamId, setUsers]);

  const activeUsersCount = users.filter(user => user.name !== '').length;
  const fixedBoxCount = 4;
  const fullUsersList = Array.from({ length: fixedBoxCount }).map((_, index) => {
    return users[index] || { id: index, name: '', character: '', isLeader: false, isReady: false };
  });

  const navigate = useNavigate();
  const handleArrowClick = () => {
    navigate('/joinGame');
  };

  const handleStartGame = () => {
    // 게임 시작할 때 navigate 넣기
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
            user={user}
            isEmpty={user.name === ''}
            boxIndex={index}
          />
        ))}
      </div>

      <div className={styles.startButtonWrapper}>
        {userId !== null && (
          isLeader ? (
            <ActionButton onClick={handleStartGame}>게임시작</ActionButton>
          ) : (
            <ActionButton onClick={toggleReady}>
              {currentUser?.isReady ? '준비 취소' : '준비'}
            </ActionButton>
          )
        )}
      </div>
    </div>
  );
}

export default WaitingRoom;
