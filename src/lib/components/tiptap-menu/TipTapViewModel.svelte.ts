import { Editor, type Content } from '@tiptap/core';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import CodeBlock from '@tiptap/extension-code-block';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import { BulletList, ListItem, OrderedList, TaskList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import UniqueID from '@tiptap/extension-unique-id';
import { Dropcursor, Placeholder, UndoRedo } from '@tiptap/extensions';

import type { AppModel } from '$lib/AppModel.svelte';
import { TaskItemWithFlag } from './TaskItemWithFlag';

const lists = [
	{
		key: 'bulletList',
		toggle: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
	},
	{
		key: 'orderedList',
		toggle: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
	},
	{
		key: 'taskList',
		toggle: (editor: Editor) => editor.chain().focus().toggleTaskList().run(),
	},
];
export const FORMAT_STATES = [
	{
		key: 'bold',
		toggle: (editor: Editor) => editor.chain().focus().toggleBold().run(),
	},
	{
		key: 'italic',
		toggle: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
	},
	{
		key: 'strike',
		toggle: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
	},
];
const headings = [
	{
		key: 'heading1',
		level: 1,
		toggle: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
	},
	{
		key: 'heading2',
		level: 2,
		toggle: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
	},
	{
		key: 'heading3',
		level: 3,
		toggle: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
	},
];

export const DEFAULT_VALUE = 'none';

export class TiptapViewModel {
	editor = $state() as Editor;
	appModel = $state<AppModel | null>(null);
	noteId = $state<string>('');
	#unsubscribeTodoChange?: () => void;

	heading = $state(DEFAULT_VALUE);
	list = $state(DEFAULT_VALUE);
	active = $state<Record<string, boolean>>({});

	setHeading(newValue: string) {
		headings.find(({ key }) => key === newValue)?.toggle(this.editor);
	}
	setList(newValue: string) {
		lists.find(({ key }) => key === newValue)?.toggle(this.editor);
	}

	constructor(
		element: HTMLElement,
		content: Content,
		onUpdate?: (viewModel: TiptapViewModel) => void,
		options?: { appModel?: AppModel; noteId?: string }
	) {
		this.appModel = options?.appModel ?? null;
		this.noteId = options?.noteId ?? '';

		this.editor = new Editor({
			element,
			extensions: [
				Document,
				Paragraph.configure({
					HTMLAttributes: {
						class: 'py-0.5',
					},
				}),
				Text,
				Heading.configure({
					levels: [1, 2, 3],
					HTMLAttributes: {
						class: 'text-lg font-bold',
					},
				}),
				Blockquote,
				Bold,
				Italic,
				Strike,
				CodeBlock,
				Dropcursor,
				HardBreak,
				HorizontalRule,
				Image,
				BulletList.configure({
					HTMLAttributes: {
						class: 'pl-5 list-disc ',
					},
				}),
				ListItem.configure({
					HTMLAttributes: {
						// class: 'first:mt-1',
						// class: 'pl-2 list-disc',
					},
				}),
				OrderedList.configure({
					HTMLAttributes: {
						class: 'dark:marker:text-slate-400 marker:text-slate-600 pl-5 list-decimal',
					},
				}),
				Placeholder.configure({
					// Use a placeholder:
					placeholder: 'Notes…',
					// Use different placeholders depending on the node type:
					// placeholder: ({ node }) => {
					//   if (node.type.name === 'heading') {
					//     return 'What's the title?'
					//   }

					//   return 'Can you add some further context?'
					// },
				}),
				TaskList,
				TaskItemWithFlag.configure({
					appModel: this.appModel,
					nested: true,
					HTMLAttributes: {
						class: '[&_p]:min-w-1',
					},
				} as any),
				UndoRedo,
				UniqueID.configure({
					types: ['taskItem'],
				}),
			],
			content,
			onUpdate: () => {
				this.#updateInternalState();
				this.#syncTodosWithAppModel();
				onUpdate?.(this);
			},
			onSelectionUpdate: () => this.#updateInternalState(),
			onTransaction: () => this.#updateInternalState(),
		});

		// Initial sync of todos
		this.#syncTodosWithAppModel();

		// Listen for todo changes from AppModel (e.g., from TaskList)
		if (this.appModel) {
			this.#unsubscribeTodoChange = this.appModel.onTodoChange(() => {
				// Sync AppModel changes back to Tiptap nodes
				this.#syncAppModelToTiptap();
			});
		}
	}

	#updateInternalState() {
		FORMAT_STATES.forEach(({ key }) => {
			this.active[key] = this.editor.isActive(key);
		});
		this.list = DEFAULT_VALUE;
		lists.forEach(({ key }) => {
			if (this.editor.isActive(key)) {
				this.list = key;
			}
		});
		this.heading = DEFAULT_VALUE;
		headings.forEach(({ key, level }) => {
			if (this.editor.isActive('heading', { level })) {
				console.log('same');
				this.heading = key;
			}
		});
	}

	#syncAppModelToTiptap() {
		if (!this.appModel || !this.noteId) return;

		const { tr } = this.editor.state;
		let updated = false;

		// Walk through document and update node attributes from AppModel
		this.editor.state.doc.descendants((node, pos) => {
			if (node.type.name === 'taskItem' && node.attrs.id) {
				const todo = this.appModel!.getTodo(node.attrs.id);
				if (todo) {
					const needsUpdate =
						node.attrs.flagged !== todo.flagged || node.attrs.checked !== todo.checked;
					if (needsUpdate) {
						tr.setNodeMarkup(pos, undefined, {
							...node.attrs,
							checked: todo.checked,
							flagged: todo.flagged,
						});
						updated = true;
					}
				}
			}
		});

		if (updated) {
			this.editor.view.dispatch(tr);
		}
	}

	#syncTodosWithAppModel() {
		if (!this.appModel || !this.noteId) return;

		const currentTodoIds = new Set<string>();

		// Walk through the document and find all taskItems
		this.editor.state.doc.descendants((node, pos) => {
			if (node.type.name === 'taskItem') {
				const id = node.attrs.id;
				if (id) {
					currentTodoIds.add(id);

					// Get the text content and states from the node
					const title = node.textContent || '';
					const checked = node.attrs.checked ?? false;
					const flagged = node.attrs.flagged ?? false;

					// Update or create todo in AppModel
					const existingTodo = this.appModel!.getTodo(id);
					if (existingTodo) {
						// Update existing todo
						this.appModel!.updateTodo(id, {
							title,
							checked,
							flagged,
						});
					} else {
						// Create new todo
						this.appModel!.setTodo(id, {
							title,
							checked,
							flagged,
							noteId: this.noteId,
						});
					}
				}
			}
		});

		// Remove todos that no longer exist in the editor
		const allTodos = this.appModel.todos;
		Object.keys(allTodos).forEach((id) => {
			const todo = allTodos[id];
			if (todo.noteId === this.noteId && !currentTodoIds.has(id)) {
				this.appModel!.deleteTodo(id);
			}
		});
	}

	destroy() {
		// Unsubscribe from todo changes
		if (this.#unsubscribeTodoChange) {
			this.#unsubscribeTodoChange();
		}
		this.editor.destroy();
	}
}
