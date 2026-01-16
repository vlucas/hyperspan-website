# Hyperspan Config

Hyperspan expects a config file named `hyperspan.config.ts` in the root of your project.

If you just created a new project from the [starter template](/docs/install), the contents might look like this:

```typescript
import { createConfig } from '@hyperspan/framework';
import { preactPlugin } from '@hyperspan/plugin-preact';

export default createConfig({
  appDir: './app',
  publicDir: './public',
  plugins: [preactPlugin()],
});
```

## Config API

The `createConfig` function accepts a configuration object with the following options:

| Property            | Type                       | Required | Description                                                        |
| ------------------- | -------------------------- | -------- | ------------------------------------------------------------------ |
| `appDir`            | `string`                   | Yes      | Path to the application directory containing routes, layouts, etc. |
| `publicDir`         | `string`                   | Yes      | Path to the public directory for static assets                     |
| `plugins`           | `Array<Plugin>`            | Yes      | Array of plugins for client-side islands (e.g., Preact, React)     |
| `beforeRoutesAdded` | `(server: Server) => void` | No       | Hook called before file-based routes are added to the server       |
| `afterRoutesAdded`  | `(server: Server) => void` | No       | Hook called after file-based routes are added to the server        |
| `responseOptions`   | `ResponseOptions`          | No       | Options for controlling response behavior (e.g., streaming)        |

### Plugin Type

A `Plugin` is a function that receives the config and can perform setup or initialization:

```typescript
type Plugin = (config: Hyperspan.Config) => Promise<void> | void;
```

Plugins are typically used to set up [client-side island rendering](/docs/clientjs/islands) (e.g., `preactPlugin()` from `@hyperspan/plugin-preact`).

### ResponseOptions

The `responseOptions` object allows you to control response behavior:

```typescript
type ResponseOptions = {
  disableStreaming?: (context: Hyperspan.Context) => boolean;
};
```

- `disableStreaming` - A function that receives the request context and returns `true` to disable streaming for that request. This allows you to conditionally disable streaming based on route path, route name, or any other context property. See the [streaming documentation](/docs/streaming) for more details.
