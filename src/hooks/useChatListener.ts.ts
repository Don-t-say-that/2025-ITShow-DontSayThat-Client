import { useEffect } from "react";
import { socket } from "../sockets/socket";
import { useMultiplayerStore } from "../store/multiplayerStore";

export const useChatListener = () => {
  useEffect(() => {
    const handleChat = (data: any) => {
      const { user, content } = data;
      useMultiplayerStore.getState().updatePlayerMessage(user.id, content);
    };

    socket.on("chat", handleChat);

    return () => {
      socket.off("chat", handleChat);
    };
  }, []);
};
