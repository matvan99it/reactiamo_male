import { useState } from 'react'

function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false)

    const style = {
        backgroundColor: darkMode ? '#333' : '#FFF',
        color: darkMode ? '#FFF' : '#333',
        padding: '50px',
        borderRadius: '10px',
        marginTop: '20px'
    }
    return (
        <div style={style}>
            <h2>{darkMode ? "Notte 🌙" : "Giorno ☀️"}</h2>
            <button onClick={() => setDarkMode(!darkMode)}>
                Cambia tema
            </button>
        </div>
    )
}

export default ThemeToggle