import type { Context } from 'hono';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(c: Context) {
  await sleep(200);

  return Response.json({ foo: 'bar' });
}
