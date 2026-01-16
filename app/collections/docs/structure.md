# App Structure

Everything needed to build a Hyperspan app is contained in the `app` directory. This lets you maintain your own `src` directory structure for things that are specific to your app.

## App Directory

The app directory structure is as follows:

```
app/
├── actions/     [coming soon!]
│   └── create-user.ts
├── layouts/     [not managed by Hyperspan, but recommended]
│   └── main-layout.ts
├── styles/      [global styles & Tailwind setup]
│   └── global.css
└── routes/      [all your routes go here]
    └── index.ts
    └── about.ts
    └── contact.ts
```
