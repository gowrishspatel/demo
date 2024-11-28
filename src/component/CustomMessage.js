import { React, useEffect, useState } from "react";
import '../customMessage.css';
const CustomMessage = ({ message, setMessage }) => {
    const [msg, setMsg] = useState(false);

    useEffect(() => {
        if (message !== "") {
            setMsg(true);
            setTimeout(() => {
                setMsg(false);
                setMessage("");
            }, 2000)
        }
    }, [message])

    return (
        <>
            {msg && (<div class="top-up"
            ><p> {message}</p></div>)}
        </>
    )
}
export default CustomMessage;