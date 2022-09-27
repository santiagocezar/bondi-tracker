import { useEffect, useRef, useState } from 'preact/hooks'

interface SendLocationProps {
    token: string
}

export const SendLocation = ({token}: SendLocationProps) => {
    const [result, setResult] = useState("")
    const [ppsDisplay, setPPSDisplay] = useState(0)
    const pps = useRef(0)

    useEffect(() => {
        if (navigator.geolocation === undefined) {
            setResult("bro no puedo usar el gps")
        }

        setInterval(() => {
            setPPSDisplay(pps.current)
            pps.current = 0
        }, 1000)

        navigator.geolocation.watchPosition((pos) => {
            fetch("https://bondi-server.herokuapp.com/api/coordenadas", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
                body: JSON.stringify({
                    coord: [pos.coords.latitude, pos.coords.longitude]
                })
            })
                .then(res => console.log(res))
                .catch(err => console.error(err))
            setResult(`lat: ${pos.coords.latitude} long: ${pos.coords.longitude}`)
            pps.current++
        }, (err) => {
            console.error(err)
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
        })
    }, [token])

    return (
        <>
                <code>
                    <pre>
                    {`${result}\n${ppsDisplay} pps`}
                    </pre>
                </code>
        </>
    )
}
