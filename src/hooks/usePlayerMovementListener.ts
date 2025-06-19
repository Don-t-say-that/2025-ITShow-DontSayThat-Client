import { useEffect } from "react";
import { useMultiplayerStore } from "../store/multiplayerStore";
import { socket } from "../sockets/socket";

export function usePlayerMovementListener() {

  useEffect(() => {
    socket.on("player-moved", (data) => {

      useMultiplayerStore.getState().updatePlayer({
        ...data,
        message: data.message ?? "",
      });
    });

    return () => {
      socket.off("player-moved");
    };
  }, []);
}