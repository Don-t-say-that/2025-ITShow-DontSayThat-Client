import { useEffect } from 'react';
import styles from './createRoom.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css'
import TextInput from '../../components/textInput/TextInput'
import ActionButton from '../../components/ActionButton/ActionButton';
import Modal from '../../components/Modal/Modal';
import useUserStore from '../../store/userStore';
import useRoomStore from '../../store/roomStore';
import useModalStore from '../../store/ModalStore';
import { SlArrowLeft } from 'react-icons/sl';

function CreateRoom() {
  const { roomName, setRoomName, setTeamId } = useRoomStore();
  const { showModal, setShowModal } = useModalStore();

  const handleroomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const navigate = useNavigate();
  const userId = useUserStore((state) => state.id);

  useEffect(() => {
    setRoomName('');
  }, [setRoomName]);

  const handleCreateRoom = async () => {
    if (!userId) {
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/teams`, {
        name: roomName,
        leaderId: userId,
      });

      const createdTeam = response.data;
      setTeamId(createdTeam.id);
      // navigate('/waitingRoom');
      navigate('/gameDescription');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setShowModal(true);
      } else {
        console.error('방 생성 중 오류:', error);
      }
    }
  };

  const handleArrowClick = () => {
    navigate('/joinGame');
  };

  return (
    <>
      <div className={styles.background}>
        <div>
          <SlArrowLeft size={'2.6vw'} color='white' fontWeight={50} onClick={handleArrowClick} className={styles.arrow} />
        </div>
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
