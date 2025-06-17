export default function MessageBubble({ player }) {
if (!player.message) return null;
console.log("MessageBubble message:", player.message);


  return (
    <div
      style={{
        background: "white",
        padding: "10px 15px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        display: "inline-block",
        marginBottom: "7px",
        maxWidth: "200px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: "20px",
        fontFamily: "Maplestory",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      {player.message}
    </div>
  );
}
