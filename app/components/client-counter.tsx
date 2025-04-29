import { useState } from 'preact/compat';

export default function ClientCounter({ count: initialCount = 0 }: { count?: number }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Counter: {count}</h2>
        <p>A simple Preact/React client component with an interactive counter.</p>
        <div class="card-actions">
          <button className="btn btn-outline" onClick={() => setCount(count - 1)}>
            Decrement
          </button>
          <button className="btn btn-outline" onClick={() => setCount(count + 1)}>
            Increment
          </button>
        </div>
      </div>
    </div>
  );
}
