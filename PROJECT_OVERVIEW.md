# Roomus Listings Project Overview

This document provides a comprehensive overview of the Roomus Listings project, including its structure, available scripts, and coding guidelines.

## 🚀 Getting Started

To get the project up and running, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:5173](http://localhost:5173).

## 📜 Available Scripts

The following scripts are available in this project:

*   `npm run dev`: Starts the development server with hot reloading.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase using ESLint to enforce code quality.
*   `npm run preview`: Serves the production build locally for preview.

## 🗂️ Project Structure

The project is organized as follows:

```
src/
  api/              # API client and adapters for the mock API
  features/
    listings/       # Main feature directory for the Room Listings
      components/   # Reusable UI components
      pages/        # Page-level components
  mocks/            # Mock Service Worker (MSW) setup
    fixtures/       # JSON files with mock data
    handlers.js     # Mock API endpoints
  styles/           # Global styles
  App.jsx           # Root application component
  main.jsx          # Application entry point and router setup
```

## 📦 Dependencies

### Main Dependencies

*   `react`: A JavaScript library for building user interfaces.
*   `react-dom`: Serves as the entry point to the DOM and server renderers for React.
*   `react-router-dom`: DOM bindings for React Router.
*   `msw` (Mock Service Worker): API mocking library for seamless development and testing.
*   `clsx`: A tiny utility for constructing `className` strings conditionally.

### Development Dependencies

*   `vite`: A fast build tool and development server.
*   `eslint`: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
*   `@vitejs/plugin-react`: Vite plugin for React.

## 🧑‍💻 Coding Guidelines

*   **CSS:** Use CSS Modules or prefix classes with `.rm-` to avoid global scope leakage.
*   **API:** Use the provided functions in `api/rooms.js`.
*   **React:** Use functional components and hooks.
*   **File Structure:** One component per file, with `PascalCase` naming for components.

##  मॉक API and Data

This project uses **Mock Service Worker (MSW)** to simulate a backend API.

*   **Mock Data:** The mock data for rooms is located in `src/mocks/fixtures/rooms.json`.
*   **API Handlers:** The mock API endpoints are defined in `src/mocks/handlers.js`.
*   **API Client:** The application interacts with the mock API through the functions provided in `src/api/rooms.js`.
