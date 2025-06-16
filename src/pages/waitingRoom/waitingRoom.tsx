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
import useUserReady from '../../hooks/useUserReady';
import useSocket from '../../hooks/useSocket';
import { useMemo } from 'react';

// 사용자 타입 정의
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

  const teamId = useRoomStore((state) => state.teamId);
  const userId = useUserStore((state) => state.id);
  
  // users가 배열인지 확인하고, 아니면 빈 배열로 초기화
  const safeUsers = Array.isArray(users) ? users : [];
  
  const currentUser = useMemo(() => {
    if (!Array.isArray(safeUsers) || userId === undefined || userId === null) return undefined;
    return safeUsers.find((user) => user.id === Number(userId));
  }, [safeUsers, userId]);
  
  const isLeader = currentUser?.isLeader;
  const socket = useSocket();
  const navigate = useNavigate();

  // 컴포넌트가 마운트되어 있는지 추적
  const isMounted = useRef(true);

  // 컴포넌트 마운트/언마운트 추적
  useEffect(() => {
    isMounted.current = true;
    console.log('🏠 컴포넌트 마운트됨');
    
    return () => {
      isMounted.current = false;
      console.log('🏠 컴포넌트 언마운트됨');
    };
  }, []);

  // 필수 데이터가 없으면 로딩 상태 표시
  if (!socket || !teamId || !userId) {
    return (
      <div className={styles.background}>
        <div style={{ color: 'white', textAlign: 'center', marginTop: '50vh' }}>
          연결 중...
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log('🔍 디버깅 정보:');
    console.log('- userId:', userId);
    console.log('- teamId:', teamId);
    console.log('- users 배열:', safeUsers);
    console.log('- users.length:', safeUsers.length);
    console.log('- currentUser:', currentUser);
    console.log('- users에서 userId로 찾기:', safeUsers.map(user => ({ id: user.id, name: user.name, match: user.id === userId })));
  }, [safeUsers, currentUser, userId, teamId]);

  // useUserReady 훅 호출 전에 디버깅 로그 추가
  console.log('🔧 useUserReady 호출 전:', {
    userId: userId ?? -1,
    currentUser
  });

  const { toggleReady } = useUserReady(userId);

  // 사용자 목록을 새로고침하는 함수
  const refreshUsers = useCallback(async () => {
    if (!teamId) return;

    try {
      console.log(`🔄 사용자 목록 새로고침 시작 - teamId: ${teamId}`);
      const response = await axios.get(`http://localhost:3000/teams/${teamId}/users`);
      console.log(`📋 새로운 사용자 목록:`, response.data);

      // 컴포넌트가 마운트되어 있을 때만 상태 업데이트
      if (isMounted.current) {
        console.log(`🔄 setUsers 호출 - 데이터:`, response.data);
        // 응답 데이터가 배열인지 확인
        const userData = Array.isArray(response.data) ? response.data : [];
        setUsers(userData);
        console.log(`✅ 사용자 목록 업데이트 완료`);
      } else {
        console.log('⚠️ 컴포넌트가 언마운트되어 상태 업데이트 건너뜀');
      }
    } catch (error) {
      console.error('❌ 사용자 목록 새로고침 실패:', error);
    }
  }, [teamId, setUsers]);

  // 준비 상태 토글 함수 - 에러 처리 강화
  const handleToggleReady = useCallback(async () => {
    console.log('🎯 준비 버튼 클릭됨');
    console.log('- 현재 userId:', userId);
    console.log('- 현재 isReady:', currentUser?.isReady);
    console.log('- 현재 사용자 정보:', currentUser);

    // 필수 데이터 검증
    if (!userId || !teamId) {
      console.error('❌ 필수 데이터가 없음:', { userId, teamId });
      return;
    }

    // currentUser가 없는 경우 사용자 목록 새로고침 후 재시도
    if (!currentUser) {
      console.log('⚠️ currentUser가 없음, 사용자 목록 새로고침 시도');
      await refreshUsers();
      return;
    }

    try {
      console.log('🔄 toggleReady 호출 시작');
      await toggleReady();
      console.log('✅ toggleReady 호출 완료');

    } catch (error) {
      console.error('❌ toggleReady 호출 중 에러:', error);

      // 에러 발생 시에도 사용자 목록 새로고침 시도
      if (isMounted.current) {
        refreshUsers();
      }
    }
  }, [toggleReady, userId, teamId, currentUser, refreshUsers]);

  // 초기 사용자 목록 불러오기
  useEffect(() => {
    if (teamId) {
      refreshUsers();
    }
  }, [teamId, refreshUsers]);

  // 소켓 연결 및 실시간 이벤트 처리
  useEffect(() => {
    console.log(`🔄 소켓 useEffect 실행 - socket: ${!!socket}, teamId: ${teamId}, userId: ${userId}`);

    if (!socket || !teamId || !userId) {
      console.log(`⚠️ 소켓, teamId 또는 userId가 없어서 리턴`);
      return;
    }

    // 방 참가
    console.log(`🚪 joinRoom 이벤트 전송 - teamId: ${teamId}, userId: ${userId}`);
    socket.emit('joinRoom', { teamId, userId });

    // 사용자 입장 이벤트 처리
    const handleUserJoined = (userData: WaitingRoomUser) => {
      console.log(`🎉 userJoined 이벤트 수신:`, userData);
      if (isMounted.current) {
        refreshUsers();
      }
    };

    // 사용자 퇴장 이벤트 처리
    const handleUserLeft = (userData: { userId: number }) => {
      console.log('👋 사용자 퇴장:', userData);
      if (isMounted.current) {
        refreshUsers();
      }
    };

    // 사용자 목록 업데이트 이벤트 처리
    const handleUsersUpdated = (updatedUsers: WaitingRoomUser[]) => {
      console.log('📝 사용자 목록 업데이트:', updatedUsers);
      if (isMounted.current) {
        // 업데이트된 사용자 목록이 배열인지 확인
        const userData = Array.isArray(updatedUsers) ? updatedUsers : [];
        setUsers(userData);
      }
    };

    // 캐릭터 선택 이벤트 처리
    const handleCharacterSelected = (data: { userId: number; characterId: number; character: string }) => {
      console.log('🎭 캐릭터 선택 이벤트 수신:', data);
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

    // Ready 상태 변경 이벤트 처리
    const handleUserReadyToggled = (data: { userId: number; isReady: boolean }) => {
      console.log('✅ Ready 상태 변경 이벤트 수신:', data);
      console.log('- 현재 컴포넌트 마운트 상태:', isMounted.current);

      if (isMounted.current) {
        console.log('🔄 Ready 상태 업데이트 적용');
        setUsers(prevUsers => {
          const safePrevUsers = Array.isArray(prevUsers) ? prevUsers : [];
          const updatedUsers = safePrevUsers.map(user =>
            user.id === data.userId
              ? { ...user, isReady: data.isReady }
              : user
          );
          console.log('📊 업데이트된 사용자 목록:', updatedUsers);
          return updatedUsers;
        });
      } else {
        console.log('⚠️ 컴포넌트가 언마운트되어 Ready 상태 업데이트 건너뜀');
      }
    };

    // 소켓 연결 상태 체크
    const handleConnect = () => {
      console.log('🔗 소켓 재연결됨');
      if (isMounted.current) {
        socket.emit('joinRoom', { teamId, userId });
        refreshUsers();
      }
    };

    const handleDisconnect = (reason: string) => {
      console.log('❌ 소켓 연결 끊어짐:', reason);
    };

    // 에러 처리 추가
    const handleError = (error: any) => {
      console.error('🚨 소켓 에러:', error);
    };

    // 이벤트 리스너 등록
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('usersUpdated', handleUsersUpdated);
    socket.on('characterSelected', handleCharacterSelected);
    socket.on('userReadyToggled', handleUserReadyToggled);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      console.log('🧹 소켓 이벤트 리스너 정리');

      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('usersUpdated', handleUsersUpdated);
      socket.off('characterSelected', handleCharacterSelected);
      socket.off('userReadyToggled', handleUserReadyToggled);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
    };
  }, [socket, teamId, userId, setUsers, refreshUsers]);

  // activeUsersCount 계산 시 안전한 배열 사용
  const activeUsersCount = safeUsers.filter(user => user.name !== '').length;

  // 캐릭터 ID에 따른 고정 위치 매핑 (빨강(3)=0, 파랑(4)=1, 노랑(2)=2, 초록(1)=3)
  const positionToCharacterId = [3, 4, 2, 1];

  // 4개의 빈 슬롯을 만들고, 각 사용자를 캐릭터 ID에 따른 고정 위치에 배치
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
    console.log('🔙 뒤로가기 버튼 클릭');
    navigate('/joinGame');
  };

  const handleStartGame = () => {
    console.log('🎮 게임 시작 버튼 클릭');
    // 게임 시작 로직 추가 예정
  };

  // 버튼 렌더링 디버깅
  console.log('🎯 버튼 렌더링 정보:');
  console.log('- userId:', userId);
  console.log('- userId !== null:', userId !== null);
  console.log('- isLeader:', isLeader);
  console.log('- currentUser?.isLeader:', currentUser?.isLeader);
  console.log('- currentUser?.isReady:', currentUser?.isReady);

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
        {userId !== null && currentUser ? (
          isLeader ? (
            <ActionButton onClick={handleStartGame}>게임시작</ActionButton>
          ) : (
            <ActionButton onClick={handleToggleReady}>
              {currentUser.isReady ? '준비 취소' : '준비'}
            </ActionButton>
          )
        ) : null}

      </div>
    </div>
  );
}

export default WaitingRoom;