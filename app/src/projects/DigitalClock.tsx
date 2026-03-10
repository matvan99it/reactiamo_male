import { useState, useEffect } from 'react';

function DigitalClock() {
    const [time, setTime] = useState(new Date().toLocaleDateString())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString())
        }, 1000)

        return () => clearInterval(timer) // pulizia al cambio pagina
    }, [])

    return (
        <div>
            <h2>Orologio digitale</h2>
            <h1 style={{ fontSize: '3rem', fontFamily: 'monospace' }}>{time}</h1>
        </div>
    )
}

export default DigitalClock