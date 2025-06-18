import { useEffect } from "react";
import { useCharacterStore } from "../../store/useCharacterStore";
import { socket } from "../../sockets/socket";
import { useMultiplayerStore } from "../../store/multiplayerStore";
import useRoomStore from "../../store/roomStore";

// socket 연결 등 로직 처리 컴포넌트
function CharacterController({ playerId }: { playerId: string }) {
  const { x, y, setPosition, imgUrl } = useCharacterStore();
  const setMyPlayerId = useMultiplayerStore((state) => state.setMyPlayerId);
  const { teamId } = useRoomStore();

  useEffect(() => {
    setMyPlayerId(playerId);

    const handleKeyDown = (e: KeyboardEvent) => {
      let newX = x;
      let newY = y;
      const step = 60;

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

      setPosition(newX, newY);

      console.log(`현재 위치: X=${newX}, Y=${newY}`);

      socket.emit("move", {
        id: playerId,
        x: newX,
        y: newY,
        imgUrl,
        teamId,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imgUrl, setPosition, x, y]);
}

export default CharacterController;
