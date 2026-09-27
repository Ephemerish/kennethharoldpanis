# Kenneth Harold Panis - Portfolio Website

![Portfolio Preview](./public/images/me/me.jpg)

## ✨ About

This portfolio showcases my journey as a developer

## 🛠️ Built With

- **[Astro](https://astro.build/)** - Static site generator for optimal performance
- **[React](https://reactjs.org/)** - Interactive components and animations
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Heroicons](https://heroicons.com/)** - Beautiful iconography

## 🚀 Project Structure

```text
/
├── public/
│   ├── images/           # Project screenshots and galleries
│   │   └── me/          # Profile photos
│   │       ├── me.jpg   # Main profile photo
│   │       └── me2.jpg  # Additional profile photo
│   └── favicon.ico      # Site favicon
├── src/
│   ├── components/      # Reusable React/Astro components
│   │   ├── ui/         # UI primitives (buttons, tooltips, etc.)
│   ├── content/        # Content collections
│   │   ├── blog/       # Blog posts (MD)
│   │   └── projects/   # Project documentation (MD)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Site pages and API routes
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
└── package.json
```

## 🧞 Development Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`           | Install dependencies                             |
| `pnpm dev`               | Start development server at `localhost:4321`    |
| `pnpm build`             | Build production site to `./dist/`              |
| `pnpm preview`           | Preview production build locally                 |
| `pnpm astro check`       | Check for TypeScript and accessibility issues   |
| `pnpm astro sync`        | Generate TypeScript definitions for content     |

## 📦 App Updates (release notes)

The website shows what is shipping in the apps (Pundo, Pidada): a card per app
on the home page, a "What's New" card on each project page, and the full
history on `/updates`.

The apps own their release notes. Each app keeps a patch notes file in its own
repo, and `pnpm sync-notes` mirrors those files into the website:

| File | Role |
| :--- | :--- |
| `src/data/patch-notes/types.ts` | The shared release model every app is normalized into |
| `src/data/patch-notes/releases.ts` | Generated mirror of the apps' notes (do not edit) |
| `src/data/patch-notes/index.ts` | The query API pages import |
| `scripts/sync-patch-notes.mjs` | Reads the app repos, normalizes, checks, writes the mirror |

To publish an update on the website:

1. Add the release to the app's own patch notes (the file the app reads).
2. Run `pnpm sync-notes` (fix anything it reports; it refuses to write a bad mirror).
3. Deploy the site.

The app repos are expected next to this one (`../budget`, `../pidada`); if they
live elsewhere, point the `PUNDO_PATCH_NOTES` / `PIDADA_CHANGELOG` environment
variables at the files. Adding another app means adding one entry to `SOURCES`
in the script and one to `src/data/apps.ts`.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
