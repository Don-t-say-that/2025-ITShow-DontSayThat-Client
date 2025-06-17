import { useEffect } from "react";
import { useMultiplayerStore } from "../store/multiplayerStore";
import { socket } from "../sockets/socket";

export function usePlayerMovementListener() {

  useEffect(() => {
    socket.on("player-moved", (data) => {
      useMultiplayerStore.getState().updatePlayer({
        ...data,    // id, x, y, imageUrl, nickName
        message: data.message ?? "",
      });
    });

    return () => {
      socket.off("player-moved");
    };
  }, []);
}