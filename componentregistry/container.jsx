export function Container({ children, className }) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}