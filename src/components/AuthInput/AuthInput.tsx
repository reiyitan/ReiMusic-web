import { Dispatch, SetStateAction, ChangeEvent } from "react";
import "./AuthInput.css"; 

interface AuthInputProps {
    label: string,
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    type: string
}

export const AuthInput = ({ label, value, setValue, type }: AuthInputProps) => {
    const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value);
    }

    return (
        <div className="auth-input-container">
            <span className="auth-label">{label}:</span>
            <input 
                type={type} 
                className="auth-input"
                onChange={handleInput}
                value={value}
                spellCheck={false}
            />
        </div>
    );
}