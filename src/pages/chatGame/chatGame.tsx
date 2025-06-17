import React, { useEffect, useState } from "react";
import AllCharacters from "../../components/Character/AllCharacter";
import CharacterController from "../../components/Character/CharacterController";
import { usePlayerMovementListener } from "../../hooks/usePlayerMovementListener";
import styles from "./chatGame.module.css";
import { IoSend } from "react-icons/io5";
import { socket } from "../../sockets/socket";
import bg1 from "../../assets/Image/gameBackground/gameBg1.png";
import bg2 from "../../assets/Image/gameBackground/gameBg2.png";
import bg3 from "../../assets/Image/gameBackground/gameBg3.png";
import bg4 from "../../assets/Image/gameBackground/gameBg4.png";
import useUserStore from "../../store/userStore";
import useRoomStore from "../../store/roomStore";
import { useCharacterStore } from "../../store/useCharacterStore";

function ChatGame() {
  usePlayerMovementListener(); // 플레이어 움직임 감지 후 업데이트
  const [backgroundImage, setBackGroundImage] = useState("");
  const userId = useUserStore((state) => state.id);
  const teamId = useRoomStore((state) => state.teamId);
  const randomImage = useRoomStore((state) => state.backgroundImage);
  const { imgUrl } = useCharacterStore();
  const bgMap: { [key: string]: string } = {
    gameBg1: bg1,
    gameBg2: bg2,
    gameBg3: bg3,
    gameBg4: bg4,
  };

  const [assignedPosition, setAssignedPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const initialPositions = [
    { x: 400, y: 650 },
    { x: 580, y: 650 },
    { x: 760, y: 650 },
    { x: 940, y: 650 },
  ];

  useEffect(() => {
    if (randomImage && bgMap[randomImage]) {
      console.log("배경 적용:", bgMap[randomImage]);
      setBackGroundImage(bgMap[randomImage]);
    } else {
      console.warn("배경 이미지 설정 실패. randomImage:", randomImage);
    }
  }, [randomImage]);

  useEffect(() => {
    if (userId && teamId && imgUrl) {
      // 유저 ID 기반으로 순서를 결정해서 위치 할당
      const index = Number(userId) % initialPositions.length;
      const position = initialPositions[index];
      setAssignedPosition(position);
      console.log(position.x, " : ", position.y);

      socket.emit("joinRoom", { teamId, userId });

      socket.emit("move", {
        teamId,
        playerId: userId,
        x: position.x,
        y: position.y,
        imgUrl,
      });
    }
  }, [userId, teamId, imgUrl]);

  return (
    <div
      className={styles.background}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <AllCharacters /> {/* 플레이어 한번에 그리기 */}
      {userId && <CharacterController playerId={String(userId)} />}
      <div className={styles.timer}>00 : 00</div>
      <div className={styles.chat}></div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          placeholder="모두 안녕하세요!! 채팅을 입력해주세요."
        />
        <button className={styles.sendButton}>
          <IoSend size={"2vw"} />
        </button>
      </div>
    </div>
  );
}

export default ChatGame;
