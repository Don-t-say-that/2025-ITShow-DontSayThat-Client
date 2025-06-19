import { useEffect } from 'react';
import useRegisterStore from '../../store/registerStore';
import useUserStore from '../../store/userStore';
import useNavigationStore from '../../store/navigationStore';
import useModalStore from '../../store/ModalStore';
import useRoomStore from '../../store/roomStore';
import styles from './registerUser.module.css';
import TextInput from '../../components/textInput/TextInput';
import ActionButton from '../../components/ActionButton/ActionButton';
import Modal from '../../components/Modal/Modal';
import '../../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterUser() {

  const { name, password, setName, setPassword } = useRegisterStore();
  const { showModal, setShowModal } = useModalStore();
  const navigate = useNavigate();
  const { setUserId } = useUserStore();
  const mode = useNavigationStore((state) => state.mode);
  const roomId = useRoomStore((state) => state.teamId);

  useEffect(() => {
    setName('');
  }, [setName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users`, {
        name,
        password,
      });

      if (response.status === 201) {
        setUserId(response.data.id);
        const userId = response.data.id;

        if (mode === 'join') {
          if (roomId) {
            await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/${userId}/team`, {
              teamId: Number(roomId),
            });
          }
        }

        if (mode === 'join') {
          navigate('/gameDescription');
        }
        else if (mode === 'create') {
          navigate('/createRoom');
        }
      }

    } catch (error: any) {
      if (error.response?.status === 400) {
        setShowModal(true);
      } else {
        console.error('사용자 등록 에러', error);
      }
    }
  };

  return (
    <>
      <div className={styles.background}>
        <p className={styles.title}>사용자 등록하기</p>

        <div className={styles.inputContainer}>
          <TextInput
            placeholder="닉네임 입력"
            value={name}
            onChange={handleNameChange}
          />
          <TextInput
            placeholder="비밀번호 입력"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <div className={styles.buttonContainer}>
          <ActionButton onClick={handleSubmit}>완료</ActionButton>
        </div>

        {showModal && (
          <Modal onClick={() => setShowModal(false)}>
            중복된 사용자입니다.  <br />
            새로운 닉네임을 입력해주세요.
          </Modal>
        )}
      </div>
    </>
  );
}

export default RegisterUser;
