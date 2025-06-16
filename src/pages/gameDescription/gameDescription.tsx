import { useEffect, useState } from "react";
import styles from "./gameDescription.module.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ActionButton from "../../components/ActionButton/ActionButton";
import styled from "styled-components";
import useUserStore from "../../store/userStore";
import useRoomStore from "../../store/roomStore";

interface Room {
  id: number;
  name: string;
  userCount: number;
}

const StyledActionButton = styled(ActionButton)`
  z-index: 10;
  bottom: 30vh;
`;

function GameDescription() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const userId = useUserStore((state) => state.id);
  const teamId = useRoomStore((state) => state.teamId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.patch<Room[]>(
          `http://localhost:3000/users/${userId}/team`,
          {
            teamId,
          }
        );
        setRooms(response.data);
      } catch (error) {
        console.error("게임방으로 이동 실패:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleMoveChatRoom = () => {
    navigate("/randomCharacter");
  };

  return (
    <div className={styles.background}>
      <h1 className={styles.title}>게임 방법</h1>
      <div className={styles.board}>
        <div className={styles.content}>
          <div>
            <big>"쉿!</big> 말하지 마. 그 단어는... 금지야!"
          </div>
          <div>
            누군가 당신의 입에 테이프를 붙였습니다.
            <br />
            하지만 수다는 멈출 수 없죠!
          </div>
          <div>
            정해진 주제로 자유롭게 대화를 나누되
            <br />
            상대가 몰래 정해둔 금칙어는 절대! 말하면 안 됩니다.
          </div>
          <div>
            말하는 순간 입 막힘! 점수도 OUT!
            <br />
            2분간의 Don't Say That, 당신은 얼마나 버틸 수 있을까요?
          </div>
        </div>
      </div>
      <div style={{ marginTop: "3vh" }}>
        <StyledActionButton onClick={handleMoveChatRoom}>
          입장하기
        </StyledActionButton>
      </div>
    </div>
  );
}

export default GameDescription;
