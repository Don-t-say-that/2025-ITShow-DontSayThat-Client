import styles from './enterForbidden.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css'
import TextInput from '../../components/textInput/TextInput'
import ActionButton from '../../components/ActionButton/ActionButton';
import useUserStore from '../../store/userStore';
import forbbidenStore from '../../store/forbiddenStore';
import useRoomStore from '../../store/roomStore';
import useSocket from '../../hooks/useSocket';
import { useEffect, useState } from 'react';

function EnterForbbiden() {
    const socket = useSocket();
    const userId = useUserStore((state) => state.id);
    const teamId = useRoomStore((state) => state.teamId);
    const { forbbiden, setForbbiden } = forbbidenStore();
    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);
    const [allUsersReady, setAllUsersReady] = useState(false);
    const [readyUsers, setReadyUsers] = useState<string[]>([]);

    const handleforbbidenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForbbiden(e.target.value);
    };

    const handleEnterForbbiden = async () => {
        if (!forbbiden.trim()) {
            alert("금칙어를 입력해주세요.");
            return;
        }

        if (isReady) {
            alert("이미 준비 완료되었습니다.");
            return;
        }

        try {
            await axios.post(`http://localhost:3000/teams/${teamId}/forbidden-words`, {
                userId,
                word: forbbiden
            });

            socket.emit('enterForbidden', {
                teamId,
                userId,
                word: forbbiden,
            });

            setIsReady(true);

        } catch (error) {
            console.error("금칙어 저장 실패:", error);
            alert("금칙어 저장에 실패했습니다.");
        }
    }

    useEffect(() => {
        socket.on('allUsersReady', () => {
            console.log("모든 사용자가 준비 완료되었습니다.");
            setAllUsersReady(true);
            setTimeout(() => {
                navigate('/chatGame');
            }, 3000);
        });

        socket.on('readyStatus', (data) => {
            console.log("준비 상태 업데이트:", data);
            setReadyUsers(data.readyUsers || []);
        });

        return () => {
            socket.off('allUsersReady');
            socket.off('readyStatus');
        };
    }, [navigate, socket]);

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

                <ActionButton
                    onClick={handleEnterForbbiden}
                >
                    {isReady ? "준비 완료!" : "준비"}
                </ActionButton>


                {allUsersReady && (
                    <div className={styles.readyToStart}>
                        <p>3초 후 게임이 시작됩니다...</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default EnterForbbiden;