import "./TextInput.css"; 

interface TextInputProps {
    label: string | undefined,
    value: string | undefined,
    handleInput: React.ChangeEventHandler<HTMLInputElement>,
    type: string,
    placeholder: string | undefined
}

export const TextInput = ({ label, value, handleInput, type, placeholder }: TextInputProps) => {
    return (
        <div className="text-input-container">
            {label && <span className="input-label">{label}</span>}
            <input 
                type={type} 
                className="text-input"
                onChange={handleInput}
                value={value || ""}
                spellCheck={false}
                placeholder={placeholder || ""}
            />
        </div>
    );
}