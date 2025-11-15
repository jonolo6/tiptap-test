import { getContext, setContext } from 'svelte';

const APP_MODEL_KEY = Symbol('APP_MODEL');

export interface Todo {
	title: string;
	checked: boolean;
	flagged: boolean;
	noteId: string;
}

export interface TodoCallbacks {
	onTodoAdded?: (id: string, todo: Todo) => void;
	onTodoUpdated?: (id: string, updates: Partial<Todo>, todo: Todo) => void;
	onTodoDeleted?: (id: string, todo: Todo) => void;
}

export class AppModel {
	#todos = $state<Record<string, Todo>>({});
	#noteTitles = $state<Record<string, string>>({});
	#todoChangeCallbacks: Set<() => void> = new Set();
	#todoCallbacks: TodoCallbacks = {};

	get todos() {
		return this.#todos;
	}

	get noteTitles() {
		return this.#noteTitles;
	}

	onTodoChange(callback: () => void) {
		this.#todoChangeCallbacks.add(callback);
		return () => this.#todoChangeCallbacks.delete(callback);
	}

	setTodoCallbacks(callbacks: TodoCallbacks) {
		this.#todoCallbacks = callbacks;
	}

	#notifyTodoChange() {
		this.#todoChangeCallbacks.forEach((callback) => callback());
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
		const isNew = !this.#todos[id];
		this.#todos[id] = todo;
		if (isNew) {
			this.#todoCallbacks.onTodoAdded?.(id, todo);
		}
	}

	updateTodo(id: string, updates: Partial<Todo>) {
		const existing = this.#todos[id];
		if (existing) {
			this.#todos[id] = { ...existing, ...updates };
			this.#todoCallbacks.onTodoUpdated?.(id, updates, this.#todos[id]);
		}
	}

	deleteTodo(id: string) {
		const todo = this.#todos[id];
		if (todo) {
			delete this.#todos[id];
			this.#todoCallbacks.onTodoDeleted?.(id, todo);
		}
	}

	toggleTodoFlag(id: string) {
		const todo = this.#todos[id];
		if (todo) {
			this.#todos[id] = { ...todo, flagged: !todo.flagged };
			this.#notifyTodoChange();
		}
	}

	toggleTodoChecked(id: string) {
		const todo = this.#todos[id];
		if (todo) {
			this.#todos[id] = { ...todo, checked: !todo.checked };
			this.#notifyTodoChange();
		}
	}

	getTodosForNote(noteId: string): Array<Todo & { id: string }> {
		return Object.entries(this.#todos)
			.filter(([_, todo]) => todo.noteId === noteId)
			.map(([id, todo]) => ({ ...todo, id }));
	}

	getAllTodos(): Array<Todo & { id: string }> {
		return Object.entries(this.#todos)
			.map(([id, todo]) => ({ ...todo, id }))
			.sort((a, b) => a.noteId.localeCompare(b.noteId));
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
