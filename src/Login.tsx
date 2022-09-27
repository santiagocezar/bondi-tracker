import { useEffect, useRef, useState } from 'preact/hooks'
import {z} from 'zod'
import { SendLocation } from './SendLocation'

const LoginData = z.object({
    token: z.string(),
    id: z.string(),
    lineName: z.string(),
    unitName: z.string(),
})

const APIResult = <T extends z.ZodType>(T: T) => z.union([
    z.object({
        error: z.literal(true),
        message: z.string(),
    }),
    z.object({
        error: z.literal(false),
        data: T,
    })
])



export const Login = ()=> {
    const [line, setLine] = useState("A")
    const [unit, setUnit] = useState("1")
    const [password, setPassword] = useState("")
    
    const [token, setToken] = useState<string | null>(null)
    
    function onLineChange(ev: Event) {
        if (ev.target instanceof HTMLSelectElement)
            setLine(ev.target.value)
    }
    function onUnitChange(ev: Event) {
        if (ev.target instanceof HTMLSelectElement)
            setUnit(ev.target.value)
    }
    function onPasswordChange(ev: Event) {
        if (ev.target instanceof HTMLInputElement)
            setPassword(ev.target.value)
    }

    function onSubmit(ev: Event) {
        fetch('https://bondi-server.herokuapp.com/api/login', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                lineName: line,
                unitName: unit,
                password
            })
        })
            .then(res => res.json())
            .then(res => APIResult(LoginData).parse(res))
            .then(res => {
                if (res.error) {
                    throw new Error(res.message)
                } else {
                    setToken(res.data.token)
                }
            })
        
        ev.preventDefault()
    }
    
    return (
        token ? (
            <SendLocation token={token}/>
        ) : (
            <>
                <form onSubmit={onSubmit} class="bondi">
                    <label>
                        <span>Linea</span>
                        <select value={line} onChange={onLineChange}>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </label>
                    <label>
                        <span>Unidad</span>
                        <select value={unit} onChange={onUnitChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </label>
                    <label>
                        <span>Contraseña</span>
                        <input value={password} onChange={onPasswordChange} type="password"  />
                    </label>
                </form>
            </>
        )
    )
}