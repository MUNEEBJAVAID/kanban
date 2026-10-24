# Kanban Board

A lightweight, single-board Kanban project management web application built with Next.js, React, and TypeScript. Designed with a custom design system, native HTML5 drag-and-drop mechanics, and automated test coverage.

## Features

- Single board workflow with 5 customizable columns (Backlog, To Do, In Progress, In Review, Done)
- Inline column title editing with instant save on Enter or blur
- Card creation with title and details validation
- Drag-and-drop card movement across columns
- Reordering cards within the same column by dropping onto target cards
- Instant card deletion
- Pre-populated dummy project data
- Clean UI built with custom CSS variables and responsive horizontal scrolling
- Zero third-party component library bloat

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Vanilla CSS / CSS Modules
- Icons: Lucide React
- Unit Testing: Vitest, React Testing Library, JSDOM
- End-to-End Testing: Playwright
- CI/CD: GitHub Actions

## Project Structure

```
kanban/
├── .github/
│   └── workflows/
│       └── ci.yml             # Automated CI pipeline
├── frontend/
│   ├── e2e/
│   │   └── kanban.spec.ts     # Playwright E2E integration tests
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css    # Design tokens and base styles
│   │   │   ├── layout.tsx     # Root document layout
│   │   │   └── page.tsx       # Main page entry
│   │   ├── components/
│   │   │   ├── KanbanBoard.tsx# Board state and column management
│   │   │   ├── ColumnItem.tsx # Column container, title editing, drop target
│   │   │   ├── CardItem.tsx   # Draggable card item and delete trigger
│   │   │   └── AddCardForm.tsx# Inline card creation form
│   │   ├── data/
│   │   │   └── initialData.ts # Default board cards and columns
│   │   ├── types/
│   │   │   └── kanban.ts      # TypeScript interfaces
│   │   └── __tests__/
│   │       └── KanbanBoard.test.tsx # Vitest unit test suite
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.mts
│   └── playwright.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18.x or later (Node 22 recommended)
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MUNEEBJAVAID/kanban.git
   cd kanban/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

### Unit Tests
Runs the Vitest suite covering column rendering, renaming, card creation, deletion, and same-column reordering:
```bash
cd frontend
npm test
```

### End-to-End Tests
Runs the Playwright browser integration tests:
```bash
cd frontend
npm run test:e2e
```

## Production Build

To build the static optimized production bundle:
```bash
cd frontend
npm run build
npm run start
```
