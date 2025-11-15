# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development & Build:**

- `pnpm dev` - Start dev server
- `pnpm build` - Build the project
- `pnpm preview` - Preview production build
- `pnpm check` - Run svelte-check with TypeScript validation
- `pnpm check:watch` - Run svelte-check in watch mode

**Testing:**

- `pnpm test` - Run both e2e and unit tests
- `pnpm test:e2e` - Run Playwright e2e tests
- `pnpm test:unit` - Run Vitest unit tests (with auto-run)
- `vitest run --testNamePattern='Test Name'` - Run specific test by name

**Code Quality:**

- `pnpm lint` - Check code formatting with Prettier
- `pnpm format` - Auto-format code with Prettier

**Database (Drizzle):**

- `pnpm db:push` - Push schema changes to database (create/update DB)
- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Architecture

### Tech Stack

- **Framework:** SvelteKit (Svelte 5 with runes)
- **Styling:** Tailwind CSS v4 (via Vite plugin)
- **Rich Text Editor:** Tiptap v3 (ProseMirror-based)
- **Database:** SQLite with Drizzle ORM (libsql client)
- **Testing:** Vitest (unit + browser tests) + Playwright (e2e)
- **Type Validation:** Valibot
- **UI Components:** bits-ui (headless components) + shadcn-svelte + custom UI library and @lucide/svelte icons.

### Key SvelteKit Configurations

- **Adapter:** Static adapter with `fallback: '200.html'`
- **Experimental Features Enabled:**
  - `remoteFunctions: true` - Enables remote function calls
  - `async: true` (compiler) - Allows async components
- **Routing:** File-based routing with layout groups `(app-sidebar)`

### Application Structure

**Global State Management:**

- `AppModel` (src/lib/AppModel.svelte.ts): Centralized app state using Svelte 5 runes
  - Manages todos across all notes
  - Tracks note titles
  - Provides reactive callbacks for todo changes
  - Uses Svelte context API (`getContext`/`setContext`) for dependency injection
  - Initialized in root `+layout.svelte`

**Database Layer:**

- Schema: `src/lib/db/schema.ts` - Drizzle table definitions
- Remote Functions: `src/lib/db/remote/notes.remote.ts` - SvelteKit remote commands/queries
  - Uses `query()` for read operations (e.g., `getAllNotes`, `getNoteById`)
  - Uses `command()` for write operations (e.g., `insertNote`, `updateNoteContent`)
  - Automatically refreshes queries after mutations
- Connection: Uses libsql client with database path from `DB_FILE_NAME` env var

**Tiptap Integration:**

- `TipTapViewModel` (src/lib/components/tiptap-menu/TipTapViewModel.svelte.ts):
  - Wraps Tiptap Editor as Svelte view model with runes
  - Manages editor state, formatting controls, headings, and lists
  - Syncs todo items (task list nodes) bidirectionally with AppModel
  - Custom extensions: `TaskItemWithFlag` for flaggable todo items
  - Uses UniqueID extension to generate stable IDs for task items

**Custom Tiptap Extension:**

- `TaskItemWithFlag` (src/lib/components/tiptap-menu/TaskItemWithFlag.ts):
  - Extends Tiptap's TaskItem with flagging functionality
  - Integrates with AppModel for global task tracking
  - Adds `flagged` attribute to task items
  - Custom node view with flag toggle button

**UI Component Architecture:**

- Base components in `src/lib/components/ui/` (accordions, buttons, dialogs, etc.)
- Built on bits-ui headless primitives
- Styling via Tailwind with custom theme system (mode-watcher for dark mode)
- Custom components: `NotePage`, `TaskList`, `TaskSorter`, `Tiptap` wrapper

**Routing Structure:**

- `src/routes/+layout.svelte`: Root layout with AppModel initialization, sidebar, breadcrumbs
- `src/routes/(app-sidebar)/`: Layout group for sidebar components
  - `LeftSidebar.svelte`: Navigation sidebar
  - `NoteMenuItem.svelte`: Individual note menu items
- `src/routes/note/[id]/+page.svelte`: Dynamic note page (renders `NotePage` component)

### Vitest Configuration

- **Dual test projects:**
  1. `client` - Browser tests for Svelte components (Playwright/Chromium)
     - Files: `src/**/*.svelte.{test,spec}.{js,ts}`
     - Environment: browser with vitest-browser-svelte
  2. `server` - Node tests for server-side code
     - Files: `src/**/*.{test,spec}.{js,ts}` (excludes `.svelte.{test,spec}`)
     - Environment: node
- All tests require assertions (`requireAssertions: true`)

### Important Patterns

**Svelte 5 Runes:**

- Use `$state()` for reactive state
- Use `$derived()` for computed values
- Use `$effect()` for side effects
- Use `$props()` for component props
- Use `$inspect()` for debugging

**Remote Functions:**

- Define queries/commands in `src/lib/db/remote/`
- Use `query()` for reads, `command()` for writes
- Validate inputs with Valibot schemas
- Call `.refresh()` on queries to invalidate cache

**Tiptap-AppModel Sync:**

- Tiptap nodes with UniqueID extension generate stable IDs
- `TipTapViewModel` syncs task items to AppModel on editor updates
- AppModel changes (e.g., from TaskList UI) sync back to Tiptap nodes
- Bidirectional sync prevents state divergence between editor and global task list
