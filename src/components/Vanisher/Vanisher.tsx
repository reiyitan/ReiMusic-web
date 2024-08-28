import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import "./Vanisher.css"; 

export const Vanisher = ({ msg, setMsg }: { msg: string, setMsg: Dispatch<SetStateAction<string>> }) => {
    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        if (msg === "") return;
        setVisible(true); 
        const timer = setTimeout(() => {
            setVisible(false);
            setMsg("");
        }, 3000);
        
        return () => clearTimeout(timer);
    }, [msg]); 

    const cancelVanisher = () => {
        setVisible(false);
        setMsg("");
    }

    return (
        <div 
            className={visible ? "vanisher vanisher-visible" : "vanisher vanisher-hidden"}
            onMouseEnter={cancelVanisher}
        >
            {msg}
        </div>
    );
}