import { useEffect, useState } from 'react';

export default function ResponseMessage({ msg, status }) {
    const [show, setShow] = useState(false);
    const [displayedMsg, setDisplayedMsg] = useState(msg);

    useEffect(() => {
        setShow(false); // fade out
        const timeout = setTimeout(() => {
            setDisplayedMsg(msg); // troca msg depois do fade out
            setShow(true); // fade in
        }, 200); // espera o fade out completar

        return () => clearTimeout(timeout);
    }, [msg]);

    return (
        <p
            className="message-transition ContentMessageResponse ContentStandartMoreBlack"
            style={{
                opacity: show ? 1 : 0,
                transition: 'opacity 0.3s ease, color 0.3s ease',
                color: status ? 'green' : status === '' ? '#d9d9d9' : 'red',
            }}
        >
            {displayedMsg}
        </p>
    );
}
