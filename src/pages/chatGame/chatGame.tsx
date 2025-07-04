import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useChatListener } from "../../hooks/useChatListener.ts";
import { useNavigate } from "react-router-dom";
import useModalStore from "../../store/ModalStore.ts";

function ChatGame() {
  usePlayerMovementListener(); // 플레이어 움직임 감지 후 업데이트
  useChatListener();

  const [backgroundImage, setBackGroundImage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const userId = useUserStore((state) => state.id);
  const teamId = useRoomStore((state) => state.teamId);
  const randomImage = useRoomStore((state) => state.backgroundImage);
  const imgUrl = useCharacterStore((state) => state.imgUrl);
  const setUserStoreScore = useUserStore.getState().setScore;
  const [timer, setTimer] = useState(90);
  const [gameEnded, setGameEnded] = useState(false);
  const [message, setMessage] = useState("");
  const setShowModal = useModalStore((state) => state.setShowModal);

  const finishGameRef = useRef(false);
  const gameEndProcessedRef = useRef(false);
  const navigate = useNavigate();

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
    if (!message.trim() || isSending) return;

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

  // 컴포넌트 언마운트 시 소켓 정리
  useEffect(() => {
    return () => {
      // 모든 소켓 리스너 정리
      socket.off("timer");
      socket.off("gameEnd");
      socket.off("chat");
    };
  }, []);

   const handleFinishedGame = useCallback(async () => {

    // 이미 처리 중이거나 완료된 경우 즉시 리턴
    if (hasFinished || finishGameRef.current) {
      return;
    }

    // 플래그 즉시 설정하여 동시 호출 차단
    finishGameRef.current = true;
    setHasFinished(true);

    try {
      
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/teams/${teamId}/finish`);

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/teams/${userId}/${teamId}/result`
      );

      setUserStoreScore(data[0]?.score);
      setGameEnded(true);
      setShowModal(true);
      navigate('/personalResult');
    } catch (error) {
      console.error("게임 종료 처리 실패", error);
      alert("게임 상태 변경 실패");
      // 에러 시에만 플래그 리셋하여 재시도 허용
      finishGameRef.current = false;
      setHasFinished(false);
    }
  }, [hasFinished, teamId, userId, setGameEnded]);

  useEffect(() => {
    if (!teamId) return;
    socket.emit("startGameTimer", { teamId });

    const handleTimer = (seconds: number) => {
      setTimer(seconds);
    };

    const handleGameEnd = () => {
      // gameEnd 이벤트 중복 처리 방지
      if (gameEndProcessedRef.current) {
        return;
      }

      gameEndProcessedRef.current = true;
      console.log("게임 종료 이벤트 수신");
      handleFinishedGame();
    };

    socket.on("timer", handleTimer);
    socket.on("gameEnd", handleGameEnd);

    return () => {
      socket.off("timer", handleTimer);
      socket.off("gameEnd", handleGameEnd);
    };
  }, [teamId]);

  useEffect(() => {
    if (randomImage && bgMap[randomImage]) {
      setBackGroundImage(bgMap[randomImage]);
    } else {
      console.warn("배경 이미지 설정 실패. randomImage:", randomImage);
    }
  }, [randomImage]);

  useEffect(() => {
    if (userId && teamId && imgUrl) {
      const index = Number(userId) % initialPositions.length;
      const position = initialPositions[index];
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
    </div>
  );
}

export default ChatGame;
