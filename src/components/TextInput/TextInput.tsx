import { Dispatch, SetStateAction, ChangeEvent } from "react";
import "./TextInput.css"; 

interface TextInputProps {
    label: string,
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    type: string
}

export const TextInput = ({ label, value, setValue, type }: TextInputProps) => {
    const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value);
    }

    return (
        <div className="text-input-container">
            <span className="input-label">{label}</span>
            <input 
                type={type} 
                className="text-input"
                onChange={handleInput}
                value={value}
                spellCheck={false}
            />
        </div>
    );
}