import { setCounter } from "../store";

export default function CounterUpdater() {
    return <button onClick={() => setCounter((prev) => prev + 1)}>Increment</button>;
}