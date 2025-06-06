import { useState } from 'react';
import styles from './registerUser.module.css';
import TextInput from '../../components/textInput/TextInput'; 
import ActionButton from '../../components/ActionButton/ActionButton';
import '../../App.css';
import axios from 'axios';

function RegisterUser() {

  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); 

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users', {
        name,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error('사용자 등록 에러', error);
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
        <ActionButton onClick={handleSubmit}>
            완료
        </ActionButton>
      </div>
    </>
  );
}

export default RegisterUser;
