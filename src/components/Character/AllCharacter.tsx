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
            width: "300px",
            height: "300px",
            transition: "0.15s ease-out",
            userSelect: "none",
            zIndex: player.id === myPlayerId ? 10 : 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
          }}
        >
          <MessageBubble player={player} />
          <img src={player.imgUrl} style={{ height: "200px" }} alt="player" />
        </div>
      ))}
    </>
  );
}

export default AllCharacters;