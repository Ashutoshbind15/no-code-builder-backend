export function Button({ children, onClick, type, disabled, className }) {
    return (
        <button onClick={onClick} type={type} disabled={disabled} className={className}>{children}</button>
    )
}