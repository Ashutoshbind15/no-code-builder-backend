export function ImageContainer({ image, className }) {
    return (
        <div className={className}>
            <img src={image} alt="image" />
        </div>
    )
}