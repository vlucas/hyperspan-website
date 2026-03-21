# Installation

To install Hyperspan, you first need to [install Bun](https://bun.sh/docs/installation) — a new fast JavaScript runtime with TypeScript support (and a lot more!) built in.

Once Bun is installed on your system, use the `hyperspan` package to create a new app from the starter template:

```shell
bunx hyperspan create MyApp
```

You can then step into your new project and check it out:

```shell
cd MyApp
bun run dev
```

From there, you can add [custom routes](/docs/routes), [server actions](/docs/actions), [layouts](/docs/layouts), [vanilla JS](/docs/clientjs/vanilla), and client islands with [React/Preact](/docs/clientjs/react), [Vue](/docs/clientjs/vue), or [Svelte](/docs/clientjs/svelte). The sky is the limit!
