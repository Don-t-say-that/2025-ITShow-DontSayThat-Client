import { useEffect } from "react";
import { useCharacterStore } from "../../store/useCharacterStore";
import { socket } from "../../sockets/socket";
import { useMultiplayerStore } from "../../store/multiplayerStore";
import useRoomStore from "../../store/roomStore";


// 유효 범위 내로 값을 고정하는 함수
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

function CharacterController({ playerId }: { playerId: string }) {
  const { x, y, setPosition, imgUrl, nickName } = useCharacterStore();
  const setMyPlayerId = useMultiplayerStore((state) => state.setMyPlayerId);
  const { teamId } = useRoomStore();

  useEffect(() => {
    setMyPlayerId(playerId);

    const handleKeyDown = (e: KeyboardEvent) => {
      let newX = x;
      let newY = y;
      const step = 30;

      switch (e.key) {
        case "ArrowUp":
          newY -= step;
          break;
        case "ArrowDown":
          newY += step;
          break;
        case "ArrowLeft":
          newX -= step;
          break;
        case "ArrowRight":
          newX += step;
          break;
        default:
          return;
      }

      const characterWidth = 250;
      const characterHeight = 250;

      // const screenWidth = window.innerWidth;
      // const screenHeight = window.innerHeight;

      const screenWidth = 1920;
      const screenHeight = 1080;

      // 좌표 제한
      const clampedX = clamp(newX, 0, screenWidth - characterWidth);
      const clampedY = clamp(newY, 0, screenHeight - characterHeight);

      setPosition(clampedX, clampedY);

      socket.emit("move", {
        playerId,
        x: clampedX,
        y: clampedY,
        imgUrl,
        teamId,
        nickName
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imgUrl, setPosition, x, y]);

  return null; // 컴포넌트 자체는 화면에 렌더링 안됨
}

export default CharacterController;
