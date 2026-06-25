
function FieldCard({ name, location, pricePerHour, clubName }) {
    return (
        <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        margin: '15px',
        width: '300px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
        }}>
        <div>
            <h3 style={{ marginBottom: '10px', fontSize: '1.25rem' }}>{name}</h3>
            <p style={{ color: '#718096', fontSize: '0.9rem', margin: '5px 0' }}>📍 {location}</p>
            <p style={{ color: '#a0aec0', fontSize: '0.8rem', margin: '5px 0' }}>🏟️ Gestionado por: {clubName}</p>
        </div>
        
        <div style={{ marginTop: '15px', borderTop: '1px solid #edf2f7', paddingTop: '15px' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2b6cb0', margin: '0 0 12px 0' }}>
            {pricePerHour}€ <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#718096' }}>/ hora</span>
            </p>
            <button style={{
            backgroundColor: '#3182ce',
            color: '#ffffff',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '6px',
            width: '100%',
            fontWeight: 'bold',
            cursor: 'pointer'
            }}>
            Reservar Pista
            </button>
        </div>
        </div>
    );
}

export default FieldCard; // 🌟 ¡Esto y las llaves de arriba eran lo que faltaba!