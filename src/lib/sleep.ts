// Sleep util with promises
export function sleep(ms: number, cb?: (resolve: (value: unknown) => void) => void) {
  return new Promise((resolve) =>
    setTimeout(() => {
      cb ? cb(resolve) : resolve(null);
    }, ms)
  );
}
