import { createAPIRoute } from '@hyperspan/framework';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default createAPIRoute(async (c) => {
  await sleep(200);

  return { foo: 'bar' };
});
