import { ImageContainer } from "./imagecontainer";

export function Card({ title, description, image }) {
    return (
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
            <ImageContainer image={image} />
        </div>
    )
}