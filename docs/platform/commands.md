---
icon: lucide/terminal
---

# CLI commands at a glance

Zensical ships with a compact CLI for spinning up, previewing, and shipping documentation sites.
Use these commands in your project root to manage the full lifecycle.

## Core commands

- [`zensical new`](https://zensical.org/docs/usage/new/) — Create a new project from the default template.
- [`zensical serve`](https://zensical.org/docs/usage/preview/) — Start the local web server with live reload.
- [`zensical build`](https://zensical.org/docs/usage/build/) — Build the static site for deployment.

## Quick start

```bash
zensical new docs-site
cd docs-site
zensical serve
```

Once you are happy with the output, run `zensical build` and push the generated files to your hosting provider.
