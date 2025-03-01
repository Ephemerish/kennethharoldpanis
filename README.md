# React Project Structure with React Router & Zustand

This repository follows a **scalable folder structure** for a React project using **React Router** for navigation and **Zustand** for state management.

## 📂 Folder Structure

```
/src
│── /assets           # Static assets (images, fonts, etc.)
│── /components       # Reusable UI components
│── /features         # Feature-based components (self-contained)
│── /layouts          # Layout components (e.g., AuthLayout, MainLayout)
│── /pages            # Page components (mapped to routes)
│── /routes           # Centralized route definitions
│── /stores           # Zustand stores (state management)
│── /hooks            # Custom hooks
│── /utils            # Utility functions/helpers
│── /services         # API calls or external services
│── /types            # TypeScript types (if using TS)
│── App.tsx           # Root component
│── main.tsx          # Entry point (if using Vite) / index.tsx for CRA
│── vite.config.ts    # Vite configuration (if using Vite)
│── tsconfig.json     # TypeScript config (if using TS)
│── package.json      # Dependencies and scripts
```

---

## 📌 Folder Breakdown

### `/components`

- Contains **reusable UI components** (e.g., `Button.tsx`, `Modal.tsx`).
- Should not contain business logic.

### `/features`

- Groups related components, Zustand store, and API calls together per feature.
- Example:
  ```
  /features/auth
  │── AuthForm.tsx
  │── authStore.ts
  │── authService.ts
  ```

### `/layouts`

- Defines layouts like `MainLayout.tsx`, `AuthLayout.tsx` for different page structures.

### `/pages`

- Contains **page components** mapped to routes.
- Example:
  ```
  /pages
  │── Home.tsx
  │── Dashboard.tsx
  │── Login.tsx
  ```

### `/routes`

- Centralizes **React Router** configuration.
- Example (`routes.tsx`):

  ```tsx
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import Home from "@/pages/Home";
  import Dashboard from "@/pages/Dashboard";
  import Login from "@/pages/Login";

  const AppRoutes = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );

  export default AppRoutes;
  ```

### `/stores`

- Stores Zustand global state files.
- Example (`authStore.ts`):

  ```tsx
  import { create } from "zustand";

  interface AuthState {
    user: string | null;
    login: (username: string) => void;
    logout: () => void;
  }

  export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    login: (username) => set({ user: username }),
    logout: () => set({ user: null }),
  }));
  ```

### `/hooks`

- Stores custom hooks (e.g., `useAuth.ts` for authentication logic).

### `/utils`

- Utility/helper functions (e.g., `formatDate.ts`, `getToken.ts`).

### `/services`

- API calls or external service interactions (e.g., `authService.ts` for authentication API calls).

---

## 🚀 Example Usage

Inside `App.tsx`:

```tsx
import AppRoutes from "@/routes/routes";

const App = () => {
  return <AppRoutes />;
};

export default App;
```

This structure keeps components **modular, scalable**, and maintains **clean separation of concerns**. 🎯
