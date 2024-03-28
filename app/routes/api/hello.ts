function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  await sleep(200);

  return Response.json({ foo: 'bar' });
}
