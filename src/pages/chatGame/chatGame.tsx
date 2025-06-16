import React, { useEffect, useState } from "react";
import AllCharacters from "../../components/Character/AllCharacter";
import CharacterController from "../../components/Character/CharacterController";
import { usePlayerMovementListener } from "../../hooks/usePlayerMovementListener";
import styles from "./chatGame.module.css";
import { IoSend } from "react-icons/io5";
import bg1 from "../../assets/Image/gameBackground/gameBg1.png";
import bg2 from "../../assets/Image/gameBackground/gameBg2.png";
import bg3 from "../../assets/Image/gameBackground/gameBg3.png";
import bg4 from "../../assets/Image/gameBackground/gameBg4.png";
import useUserStore from "../../store/userStore";

function ChatGame() {
  const [backgroundImage, setBackGroundImage] = useState("");
  const userId = useUserStore((state) => state.id);
  const bgList = [bg1, bg2, bg3, bg4];

  usePlayerMovementListener(); // 플레이어 움직임 감지 후 업데이트

  console.log(userId);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * bgList.length);
    setBackGroundImage(bgList[randomIdx]);
  }, []);

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
