---
title: Introducing Hyperspan
date: 2026-04-06
description: Why I built a server-oriented TypeScript framework on Bun, and what you can expect from the project.
---

# Introducing Hyperspan

Today I’m introducing **Hyperspan**: a web framework for **dynamic, high-performance** sites and apps, built with **TypeScript** and **Bun**. It’s server-oriented by default: **zero JavaScript sent to the client** unless you explicitly add interactivity. No magic, no special file extensions: just TypeScript, HTML templates, and the web platform.

## Why Hyperspan?

I wanted a framework that sits between a classic server framework (think Express) and a full-stack React meta-framework (think Next.js). Hyperspan keeps **work and state on the server** while still letting you drop in **React/Preact, Vue, or Svelte** only where you need them, via an **islands** model, so you ship **minimal JS** and still get rich UI where it matters.

Hyperspan is built on **Bun**, so there’s **no compile step** to run your app: write TypeScript, run `hyperspan start` or `hyperspan-dev dev`, and go. Client bundles for islands are handled on the server with Hyperspan’s plugins when you need them.

## What you get

- **All TypeScript**: File-based and custom routing, full `Request` context, composable middleware, and streaming HTML without a bespoke compiler pipeline.
- **HTML templates**: Simple templates with `async`/`await`, streaming by default when your template includes unresolved promises (better TTFB, then stream dynamic pieces as they’re ready). You can also return `Generator` or `AsyncGenerator` from handlers for AI-style streaming responses with no special “flight” syntax.
- **Zero JS runtime (by default)**: Most pages don’t need hydration. Client JS ships only for **dynamic islands** and scripts you define.
- **Server Actions**: Forms and mutations with **Zod** validation, type-safe data, field errors, and HTMX-style in-place updates. Logic stays on the server.
- **Islands**: SSR for SEO, lazy loading and hydration options per island, so interactivity doesn’t mean shipping a whole app bundle to every page.

## Try it

If this matches how you want to build the web (fast defaults, server-first, optional client richness), start here:

```shell
bunx hyperspan create MyApp
```

Then follow the **[installation guide](/docs/install)** and **[documentation](/docs)** for routing, actions, streaming, and client JS.

I’m excited to share Hyperspan with the world. Star the repo, read the docs, and tell me what you build.

*Hyperspan: Web Framework for Dynamic High-Performance Sites and Apps.*
