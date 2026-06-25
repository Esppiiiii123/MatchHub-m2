// src/components/MatchCard.jsx
// Recibimos las propiedades dentro de las llaves en los argumentos
function MatchCard({ localTeam, visitorTeam, matchTime }) {
    return (
        <div style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        margin: "12px 0",
        maxWidth: "300px",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.05)"
        }}>
        {/* 🌟 Ahora pintamos lo que nos llegue desde fuera */}
        <h3>{localTeam} vs {visitorTeam}</h3>
        <p>🕒 Time: {matchTime}</p>
        <button style={{ cursor: "pointer" }}>View Details</button>
        </div>
    );
}

export default MatchCard;