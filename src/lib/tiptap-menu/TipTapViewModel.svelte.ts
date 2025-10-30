import { Editor, type Content } from '@tiptap/core';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Dropcursor, UndoRedo } from '@tiptap/extensions';
import UniqueID from '@tiptap/extension-unique-id';

const lists = [
	{
		key: 'bulletList',
		toggle: (editor: Editor) => editor.chain().focus().toggleBulletList().run()
	},
	{
		key: 'orderedList',
		toggle: (editor: Editor) => editor.chain().focus().toggleOrderedList().run()
	},
	{
		key: 'todosList',
		toggle: (editor: Editor) => editor.chain().focus().toggleTaskList().run()
	}
];
const active_states = ['bold', 'italic', 'strike'];
const headings = [
	{
		key: 'heading1',
		level: 1,
		toggle: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run()
	},
	{
		key: 'heading2',
		level: 2,
		toggle: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run()
	}
];

export const DEFAULT_VALUE = 'none';

export class TiptapViewModel {
	editor = $state() as Editor;

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
		onUpdate?: (viewModel: TiptapViewModel) => void
	) {
		this.editor = new Editor({
			element,
			extensions: [
				Blockquote,
				BulletList,
				CodeBlock,
				Document,
				Dropcursor,
				HardBreak,
				Heading,
				HorizontalRule,
				Image,
				ListItem,
				OrderedList,
				Paragraph,
				TaskList,
				TaskItem.configure({
					nested: true
				}),
				Text,
				UndoRedo,
				UniqueID.configure({
					types: ['heading', 'paragraph', 'taskItem']
				})
			],
			content,
			onUpdate: () => {
				this.#updateInternalState();
				onUpdate?.(this);
			},
			onSelectionUpdate: () => this.#updateInternalState(),
			onTransaction: () => this.#updateInternalState()
		});
	}

	#updateInternalState() {
		active_states.forEach((state) => {
			this.active[state] = this.editor.isActive(state);
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

	destroy() {
		this.editor.destroy();
	}
}
