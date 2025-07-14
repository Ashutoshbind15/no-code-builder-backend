import { Card } from "../../../componentregistry/card.jsx";
import { Button } from "../../../componentregistry/button.jsx";
import { Text } from "../../../componentregistry/text.jsx";
import { Container } from "../../../componentregistry/container.jsx";

export default function GeneratedApp() {
    return (
        <div>
<section className="flex w-full py-2 px-4 bg-gray-100 min-h-screen">
  <Card cardHeader="Updated Card Title" cardFooter="This card has been updated!" cardImage="https://via.placeholder.com/300x200" />
  <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" text="Click me!" />
  <Text className="text-lg text-gray-800 mt-4" content="This is a dynamically generated text element!" />
  <Container className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
    <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" text="Container Button" />
    <Text className="text-gray-600 ml-4" content="This text is inside the container!" />
  </Container>
</section>
        </div>
    );
}