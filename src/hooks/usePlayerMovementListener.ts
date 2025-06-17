import { useEffect } from "react";
import { useMultiplayerStore } from "../store/multiplayerStore";
import { socket } from "../sockets/socket";

export function usePlayerMovementListener() {
  const updatePlayer = useMultiplayerStore((state) => state.updatePlayer);

  useEffect(() => {
    socket.on("player-moved", (data) => {
      updatePlayer({
        id: data.playerId,
        x: data.x,
        y: data.y,
        imgUrl: data.imgUrl || "", // 없을 때 처리
      });
    });

    return () => {
      socket.off("player-moved");
    };
  }, []);
}
