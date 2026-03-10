import { useState } from "react";

function ColorPicker() {
    const [color, setColor] = useState('#646cff')

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Selettore colore</h2>
            <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: color,
                margin: '20px auto',
                borderRadius: '50%',
                border: '2px solid white'
            }}/>
            <input 
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <p>Codice Hex: <code>{color}</code></p>
        </div>
    )
}

export default ColorPicker