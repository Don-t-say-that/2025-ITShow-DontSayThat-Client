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
import { useMultiplayerStore } from "../../store/multiplayerStore";
import axios from "axios";
import useModalStore from "../../store/modalStore";
import Modal from "../../components/Modal/Modal";
import { useChatListener } from "../../hooks/useChatListener.ts";

function ChatGame() {
  usePlayerMovementListener(); // 플레이어 움직임 감지 후 업데이트
  useChatListener();

  const [backgroundImage, setBackGroundImage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const userId = useUserStore((state) => state.id);
  const teamId = useRoomStore((state) => state.teamId);
  const randomImage = useRoomStore((state) => state.backgroundImage);
  const { imgUrl, nickName } = useCharacterStore();
  const { showModal, setShowModal } = useModalStore();
  const [timer, setTimer] = useState(90);
  const [gameEnded, setGameEnded] = useState(false);
  const [message, setMessage] = useState("");

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
    { x: -370, y: 110 }, // 왼쪽
    { x: -40, y: 110 }, // 중앙 왼쪽
    { x: 170, y: 110 }, // 중앙 오른쪽
    { x: 410, y: 110 }, // 오른쪽 (1920 - 500 = 1420이 최대이므로 안전)
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setIsSending(true);

    socket.emit(
      "chat",
      {
        content: message,
        userId,
        teamId,
      },
      () => {
        setMessage("");
        setIsSending(false);
      }
    );
  };

  // 3. 컴포넌트 언마운트 시 소켓 정리
  useEffect(() => {
    return () => {
      // 모든 소켓 리스너 정리
      socket.off("timer");
      socket.off("gameEnd");
      socket.off("chat");
    };
  }, []);

  const handleFinishedGame = async () => {
    if (hasFinished) return;
    setHasFinished(true); // 실행 됐으면 재실행 방지

    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/teams/${teamId}/finish`);

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/teams/${userId}/${teamId}/result`
      );
      console.log(data);

      setUserScore(data?.score);
      setGameEnded(true);
      setShowModal(true);
    } catch (error) {
      console.error("게임 종료로 상태 변경, 모달 열기 실패", error);
      alert("게임 상태 변경, 모달 열기 실패");
    }
  };

  useEffect(() => {
    console.log("✅ ChatGame mounted");

    return () => {
      console.log("❌ ChatGame unmounted");
    };
  }, []);

  useEffect(() => {
    socket.emit("startGameTimer", { teamId });

    socket.on("timer", (seconds: number) => {
      setTimer(seconds);
    });

    socket.on("gameEnd", () => {
      handleFinishedGame();
      alert("게임이 종료되었습니다!");
    });

    return () => {
      socket.off("timer");
      socket.off("gameEnd");
    };
  }, [teamId]);

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
      const index = Number(userId) % initialPositions.length;
      const position = initialPositions[index];
      console.log(position);
      setAssignedPosition(position);
      socket.emit("joinRoom", { teamId, userId });
      useMultiplayerStore.getState().setMyPlayerId(String(userId));
    }
  }, [userId, teamId, imgUrl]);

  useEffect(() => {
    if (assignedPosition && userId && teamId && imgUrl) {
      // useCharacterStore의 위치도 업데이트
      const { setPosition } = useCharacterStore.getState();
      setPosition(assignedPosition.x, assignedPosition.y);

      socket.emit("move", {
        teamId,
        id: userId,
        x: assignedPosition.x,
        y: assignedPosition.y,
        imgUrl,
        nickName,
      });
    }
  }, [assignedPosition]);

  return (
    <div
      className={styles.background}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <AllCharacters /> {/* 플레이어 한번에 그리기 */}
      {userId && <CharacterController playerId={String(userId)} />}
      <div className={styles.timer}>
        {gameEnded
          ? "게임 종료"
          : `${Math.floor(timer / 60)} : ${String(timer % 60).padStart(
              2,
              "0"
            )}`}
      </div>
      <div className={styles.inputWrapper}>
        <input
          checked
          className={styles.input}
          value={message}
          placeholder="모두 안녕하세요!! 채팅을 입력해주세요."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button className={styles.sendButton} onClick={handleSendMessage}>
          <IoSend size={"2vw"} />
        </button>
      </div>
      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <div>
            <p className={styles.title}>게임 결과</p>
            <div>{/* 내용 넣기 */}</div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ChatGame;
