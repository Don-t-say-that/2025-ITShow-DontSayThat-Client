import styles from './enterForbidden.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css'
import TextInput from '../../components/textInput/TextInput'
import ActionButton from '../../components/ActionButton/ActionButton';
import useUserStore from '../../store/userStore';
import forbbidenStore from '../../store/forbiddenStore';

function EnterForbbiden() {

    const userId = useUserStore((state) => state.id);
    const { forbbiden, setForbbiden } = forbbidenStore();
    const navigate = useNavigate();
    const handleforbbidenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForbbiden(e.target.value);
    };

    const handleEnterForbbiden = async () => {
        navigate('/chatGame');
    }
    return (
        <>
            <div className={styles.background}>
                <p className={styles.title}>상대방 금칙어 입력하기</p>
                <div className={styles.inputContainer}>
                    <TextInput
                        placeholder="금칙어 입력"
                        value={forbbiden}
                        onChange={handleforbbidenChange}
                        width="35vw"
                    />
                </div>

                <ActionButton onClick={handleEnterForbbiden}>시작하기</ActionButton>
            </div>
        </>
    );
}

export default EnterForbbiden;
