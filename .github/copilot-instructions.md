<!-- Copilot / AI agent instructions for Proyecto-Kine -->
# Proyecto-Kine — AI assistant quick guide

Purpose: help AI coding agents become productive quickly in this frontend repository.

- Project type: Vite + React (ESM) with TailwindCSS. Entry: `src/main.jsx` → `src/App.jsx`.
- Where UI pages live: `src/pages/` (each page is a default-exported React component e.g. `MenuSupervisor.jsx`).
- Routing: defined in `src/App.jsx` using `react-router-dom` (v7). Add new routes by importing the page and adding a `<Route path="/my-path" element={<MyPage/>} />` inside the existing `Routes` block.

Run / build commands (from project root):

```
npm install
npm run dev      # starts Vite dev server (default port 5173)
npm run build    # production build
npm run preview  # preview built production bundle
npm run lint     # run ESLint
```

Project-specific conventions and patterns
- File & component naming: PascalCase for files in `src/pages` (example: `MenuSupervisor.jsx`). Components are simple functional components with a default export.
- Styling: Tailwind CSS utility classes are used inline in JSX. Global styles appear in `src/index.css` and `src/App.css`. Follow existing visual tokens (example color hexes used in `MenuSupervisor.jsx`: `#D2C9FF`, `#1E6176`).
- Assets: keep images and static assets under `src/assets` and import them in components, e.g. `import textura from "../assets/TexturaHQ.png"`.
- Routing & navigation: pages use `useNavigate()` to go to routes (see `MenuSupervisor.jsx` which calls `navigate('/lista-practicantes')`). Routing uses an `AnimatedRoutes` wrapper keyed on `location.pathname` — preserve the `location` usage when adding routes to keep animations working.
- Data & API: currently pages often use hard-coded/local constants (see `MenuSupervisor.jsx`). There is no centralized API service yet — prefer adding a new `src/services/api.js` or `src/services/*` module for fetch/axios code and import it into pages.

Integration points and external deps
- Key dependencies: `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `@vitejs/plugin-react`. See `package.json` for exact versions.
- Backend: repository contains `dump_kine_app.sql` but no backend server code in this repo. Expect API endpoints to be external — use `import.meta.env` for Vite environment variables (e.g. `import.meta.env.VITE_API_URL`) if you add configuration.

Developer notes for edits and pull requests
- Add page: create `src/pages/MyPage.jsx`, default-export a functional component, import it into `src/App.jsx` and add a `Route` with the desired path.
- Reuse UI patterns: header block (rounded containers, `bg-white/90`, `rounded-2xl`, `shadow-lg`), and button classes (use existing patterns for hover and active states). See `MenuSupervisor.jsx` for examples.
- Linting & formatting: run `npm run lint`. There is an `eslint.config.js` at project root; adhere to that config.

What AI agents should not assume
- There are no tests or CI defined in the repo — do not add tests without asking.
- No backend client library or API schema exists in the repo — don't invent endpoints; ask for API contract or use `import.meta.env.VITE_API_URL` placeholder.

Quick examples (copyable)

- Add a route in `src/App.jsx`:
```
import MyPage from './pages/MyPage';
...
<Route path="/my-page" element={<MyPage />} />
```

- Import an image from `src/assets` inside a page:
```
import logo from '../assets/logo.png';
<img src={logo} alt="logo" />
```

If anything is unclear or you need conventions expanded (API patterns, env values, or design tokens), ask the repository owner for a short spec and I will iterate.
