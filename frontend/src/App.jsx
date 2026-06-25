// src/App.jsx
import MatchCard from "./components/matchCard";

function App() {
  //  Simulamos el array que nos devolvería MongoDB
  const mockMatches = [
    { id: "1", local: "Manchester City", visitor: "Liverpool", time: "16:00" },
    { id: "2", local: "Atletico Madrid", visitor: "Sevilla", time: "19:00" },
    { id: "3", local: "Bayern Munich", visitor: "Dortmund", time: "18:30" },
    { id: "4", local: "Inter Milan", visitor: "Napoli", time: "20:45" }
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>MatchHub Dashboard</h1>
      <p>Partidos disponibles hoy:</p>
      
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {/* Recorremos el array y por cada partido, devolvemos una tarjeta */}
        {mockMatches.map((match) => {
          return (
            <MatchCard 
              key={match.id} // Obligatorio en React: un ID único para que no se líe al renderizar
              localTeam={match.local} 
              visitorTeam={match.visitor} 
              matchTime={match.time} 
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;