# Kenneth Harold Panis - Portfolio Website

![Portfolio Preview](./public/me.jpg)

## ✨ About

This portfolio showcases my journey as a developer

## 🛠️ Built With

- **[Astro](https://astro.build/)** - Static site generator for optimal performance
- **[React](https://reactjs.org/)** - Interactive components and animations
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Lucide Icons](https://lucide.dev/)** - Beautiful iconography

## 🚀 Project Structure

```text
/
├── public/
│   ├── images/           # Project screenshots and galleries
│   ├── me.jpg           # Profile photo
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

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
