export default function Input({ type, placeholder, value, onInput, className }) {
    return (
        <input type={type} placeholder={placeholder} value={value} onInput={onInput} className={className} />
    )
}