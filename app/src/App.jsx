import CounterConsumer from "./components/CounterConsumer";
import CounterUpdater from "./components/CounterUpdater";

export default function App() {
    return (
        <div>
            <CounterConsumer />
            <CounterUpdater />
        </div>
    );
}