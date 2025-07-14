export function Card({ cardHeader, cardFooter, cardImage, className }) {
    return (
        <div className={className || "bg-white rounded-lg shadow-md p-4"}>
            <div className="font-bold text-lg mb-2">{cardHeader}</div>
            <img
                src={cardImage}
                alt="Card Image"
                className="w-full h-48 object-cover rounded mb-4"
            />
            <div className="text-gray-600">{cardFooter}</div>
        </div>
    )
}