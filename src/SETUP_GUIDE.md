# Calcura - Local Development Setup Guide

## Prerequisites

Before running this project, make sure you have installed:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **VS Code** - [Download here](https://code.visualstudio.com/)

## Setup Instructions

### 1. Install Dependencies

Since this project was built with Figma Make, you'll need to set up a local development environment. Follow these steps:

#### Option A: Using Vite (Recommended)

1. **Create a `package.json` file** in the root directory:

```json
{
  "name": "calcura",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.344.0",
    "recharts": "^2.12.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "typescript": "^5.3.3"
  }
}
```

2. **Create a `vite.config.ts` file** in the root directory:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

3. **Create an `index.html` file** in the root directory:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Calcura - Smart Budget Planning</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
```

4. **Create a `main.tsx` file** in the root directory:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

5. **Create a `tsconfig.json` file** in the root directory:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["."],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

6. **Create a `tsconfig.node.json` file**:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

7. **Install dependencies** - Open the terminal in VS Code (Terminal → New Terminal) and run:

```bash
npm install
```

### 2. Run the Development Server

Once dependencies are installed, start the development server:

```bash
npm run dev
```

This will start the Vite development server. You should see output like:

```
VITE v5.1.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 3. Open in Browser

Open your browser and navigate to `http://localhost:5173/` to see your Calcura app running!

## VS Code Recommended Extensions

Install these extensions for the best development experience:

1. **ES7+ React/Redux/React-Native snippets** - Code snippets
2. **Tailwind CSS IntelliSense** - Tailwind class autocomplete
3. **Prettier - Code formatter** - Code formatting
4. **ESLint** - Code linting
5. **Auto Rename Tag** - Automatically rename paired HTML/JSX tags

## Project Structure

```
calcura/
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
├── index.html                 # HTML template
├── components/                # All React components
│   ├── ui/                    # Reusable UI components
│   └── figma/                 # Figma-specific components
├── styles/
│   └── globals.css            # Global styles and Tailwind
├── package.json               # Dependencies
├── vite.config.ts             # Vite configuration
└── tsconfig.json              # TypeScript configuration
```

## Troubleshooting

### Port already in use
If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.)

### Module not found errors
Make sure you've run `npm install` and all dependencies are installed correctly.

### Tailwind classes not working
Ensure your `styles/globals.css` file includes the Tailwind directives and is imported in `main.tsx`.

### Hot Module Replacement (HMR) not working
Try restarting the dev server with `npm run dev`.

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
```

## Additional Notes

- The app uses **state-based routing** in App.tsx (not React Router in this version)
- **Tailwind CSS v4** is used for styling
- **Lucide React** is used for icons
- **Recharts** is used for charts and graphs
- All components are written in **TypeScript**

## Need Help?

- Check the `/COMPONENT_LIST.md` for a full list of components
- Check the `/MENU_HIERARCHY.md` for navigation structure
- Review the code in `/App.tsx` to understand the routing logic

---

**Happy coding! 🚀**
