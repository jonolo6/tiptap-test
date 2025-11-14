# AGENTS.md for Tiptap Test

## Build, Lint, Test Commands

- `pnpm run build` - Build the project
- `pnpm run lint` - Check code style and formatting
- `pnpm test` or `vitest run` - Run all tests
- `vitest run --testNamePattern='Test Name'` - Run a specific test by name

## Code Style Guidelines

- Use ES modules import syntax
- Import components and utilities with relative paths, e.g., `import { something } from './utils'`
- Follow Prettier formatting rules for consistent code style
- Use TypeScript types for function signatures and variables
- Use camelCase for variables and functions, PascalCase for components
- Handle errors gracefully with try-catch blocks or error boundaries

## Cursor and Copilot Rules

- Follow existing cursor rules in `.cursor/rules/` and `.cursorrules`
- Adhere to Copilot instructions in `.github/copilot-instructions.md`

Ensure all code changes pass lint and tests before committing.
