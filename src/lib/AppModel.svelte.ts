import { getContext, setContext } from 'svelte';

const APP_MODEL_KEY = Symbol('APP_MODEL');

export interface Todo {
	title: string;
	flagged: boolean;
	noteId: string;
	lineNumber: number;
}

export class AppModel {
	#todos = $state<Record<string, Todo>>({});
	#noteTitles = $state<Record<string, string>>({});

	get todos() {
		return this.#todos;
	}

	get noteTitles() {
		return this.#noteTitles;
	}

	setNoteTitle(noteId: string, title: string) {
		this.#noteTitles[noteId] = title;
	}

	getNoteTitle(noteId: string): string | undefined {
		return this.#noteTitles[noteId];
	}

	getTodo(id: string): Todo | undefined {
		return this.#todos[id];
	}

	setTodo(id: string, todo: Todo) {
		this.#todos[id] = todo;
	}

	updateTodo(id: string, updates: Partial<Todo>) {
		const existing = this.#todos[id];
		if (existing) {
			this.#todos[id] = { ...existing, ...updates };
		}
	}

	deleteTodo(id: string) {
		delete this.#todos[id];
	}

	toggleTodoFlag(id: string) {
		const todo = this.#todos[id];
		if (todo) {
			this.#todos[id] = { ...todo, flagged: !todo.flagged };
		}
	}

	getTodosForNote(noteId: string): Array<Todo & { id: string }> {
		return Object.entries(this.#todos)
			.filter(([_, todo]) => todo.noteId === noteId)
			.map(([id, todo]) => ({ ...todo, id }))
			.sort((a, b) => a.lineNumber - b.lineNumber);
	}

	getAllTodos(): Array<Todo & { id: string }> {
		return Object.entries(this.#todos)
			.map(([id, todo]) => ({ ...todo, id }))
			.sort((a, b) => {
				// Sort by noteId first, then by lineNumber
				if (a.noteId !== b.noteId) {
					return a.noteId.localeCompare(b.noteId);
				}
				return a.lineNumber - b.lineNumber;
			});
	}

	constructor() {
		// Initialize any app-level state here
	}
}

export function initialiseAppModel(model: AppModel = new AppModel()) {
	return setAppModel(model);
}

export function setAppModel(model: AppModel) {
	return setContext(APP_MODEL_KEY, model);
}

export function getAppModel(): AppModel {
	return getContext(APP_MODEL_KEY);
}
