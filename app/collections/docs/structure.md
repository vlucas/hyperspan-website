# App Structure

Everything needed to build a Hyperspan app is contained in the `app` directory. This lets you maintain your own `src` directory structure for things that are specific to your app.

Project-level files live at the root:

```
hyperspan.config.ts   [app config, island plugins, deploy adapter]
vite.config.ts        [Vite + Hyperspan plugin, Tailwind, build output]
package.json
dist/                 [production build output]
```

## App Directory

The app directory structure is as follows:

```
app/
├── actions/     [server actions]
│   └── create-user.ts
├── layouts/     [recommended folder for layouts]
│   └── main-layout.ts
├── styles/      [global styles & Tailwind setup (if used)]
│   └── global.css
├── client/      [optional vanilla client JS modules]
│   └── hello-client.ts
└── routes/      [all your routes go here]
    └── index.ts
    └── about.ts
    └── contact.ts
    └── posts/
        └── [id].ts
        └── index.ts
    └── docs/
        └── [...page].ts
```

Run `hyperspan build` to emit the production server entry, asset manifest, and hashed client/CSS files into `dist/`.
