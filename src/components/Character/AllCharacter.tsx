import { useMultiplayerStore } from "../../store/multiplayerStore";

function AllCharacters() {
  const players = useMultiplayerStore((state) => state.players);
  const myPlayerId = useMultiplayerStore((state) => state.myPlayerId);

  return (
    <>
      {Object.values(players).map(
        (player) => (
          console.log('Allcharacter: ', player.imgUrl),
          (
            <img
              key={player.id}
              src={player.imgUrl}
              alt="player"
              style={{
                position: "absolute",
                transform: `translate(${player.x}px, ${player.y}px)`,
                width: "100px",
                height: "100px",
                transition: "0.15s ease-out",
                userSelect: "none",
                zIndex: player.id === myPlayerId ? 10 : 1
              }}
            />
          )
        )
      )}
    </>
  );
}

export default AllCharacters;
