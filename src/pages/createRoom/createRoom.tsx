import styles from './createRoom.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css'
import TextInput from '../../components/textInput/TextInput'
import ActionButton from '../../components/ActionButton/ActionButton';
import Modal from '../../components/Modal/Modal';
import useUserStore from '../../store/userStore';
import useRoomStore from '../../store/roomStore';
import useModalStore from '../../store/modalStore';

function CreateRoom() {
  const { roomName, setRoomName, setTeamId } = useRoomStore();
  const { showModal, setShowModal } = useModalStore();

  const handleroomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const navigate = useNavigate();

  const userId = useUserStore((state) => state.id);

  const handleCreateRoom = async () => {
    if (!userId) {
      console.error('유저가 로그인되지 않았습니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/teams', {
        name: roomName,
        leaderId: userId,
      });

      const createdTeam = response.data;
      console.log('생성된 팀:', createdTeam);
      setTeamId(createdTeam.id);
      navigate('/waitingRoom');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setShowModal(true);
      } else {
        console.error('방 생성 중 오류:', error);
      }
    }
  };

  return (
    <>
      <div className={styles.background}>
        <p className={styles.title}>방 만들기</p>
        <div className={styles.inputContainer}>
          <TextInput
            placeholder="게임방 이름 입력"
            value={roomName}
            onChange={handleroomNameChange}
            width="41.3vw"
          />
        </div>

        <ActionButton onClick={handleCreateRoom}>생성하기</ActionButton>

        {showModal && (
          <Modal onClick={() => setShowModal(false)}>
            게임방 이름이 중복되었습니다. <br />
            다시 입력해주세요.
          </Modal>
        )}

      </div>
    </>
  );
}

export default CreateRoom;
