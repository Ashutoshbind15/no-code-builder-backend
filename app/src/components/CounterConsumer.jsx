import { counter } from "../store";

export default function CounterConsumer() {
    return <div>Counter: {counter()}</div>;
}