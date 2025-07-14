export function Text({ children, className }) {
    return (
        <p className={className || "text-gray-900"}>{children}</p>
    )
}