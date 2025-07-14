export function Button({ text, onClick, type, disabled, className }) {
    return (
        <button
            onClick={onClick}
            type={type || "button"}
            disabled={disabled}
            className={className || "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
        >
            {text}
        </button>
    )
}