import { useState } from 'preact/hooks';

export default function ClientCounter({ count: initialCount = 0 }: { count?: number }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button className="btn" onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button className="btn" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
