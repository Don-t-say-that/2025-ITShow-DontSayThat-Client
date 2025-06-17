import { useMultiplayerStore } from "../../store/multiplayerStore";
import MessageBubble from "./MessageBubble";

function AllCharacters() {
  const players = useMultiplayerStore((state) => state.players);
  const myPlayerId = useMultiplayerStore((state) => state.myPlayerId);

  return (
    <>
      {Object.values(players).map((player) => (
        <div
          key={player.id}
          style={{
            position: "absolute",
            transform: `translate(${player.x}px, ${player.y}px)`,
            width: "240px",
            height: "240px",
            transition: "0.15s ease-out",
            userSelect: "none",
            zIndex: player.id === myPlayerId ? 10 : 1,
          }}
        >
          <MessageBubble player={player} />
          <img src={player.imgUrl} alt="player" />
          <div
            style={{
              marginTop: "5px",
              fontWeight: "bold",
              color: "#fff",
              textShadow: "0 0 5px black",
            }}
          >
            {player.nickName}
          </div>
        </div>
      ))}
    </>
  );
}

export default AllCharacters;
