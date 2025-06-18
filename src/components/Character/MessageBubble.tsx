export default function MessageBubble({ player }) {
  if (!player.message) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "-70px", 
        left: "50%",
        transform: "translateX(-50%)", 
        background: "white",
        padding: "10px 15px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        display: "inline-block",
        width: "300px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: "30px",
        fontFamily: "Maplestory",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 100,
        textAlign: "center", 
      }}
    >
      {player.message}
    </div>
  );
}