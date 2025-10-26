import { Editor, type Content } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';

const active_states = ['bold', 'italic', 'strike'];

export class TiptapViewModel {
	editor = $state() as Editor;

	active = $state<Record<string, boolean>>({});

	constructor(element: HTMLElement, content: Content) {
		this.editor = new Editor({
			element,
			extensions: [StarterKit],
			content,
			onUpdate: () => this.#updateInternalState(),
			onSelectionUpdate: () => this.#updateInternalState()
			// onTransaction: ({ editor: _editor }) => {
			// Increment the state signal to force a re-render
			// this.editor = _editor;
			// }
			// editorProps: {
			// 	attributes: {
			// 		class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
			// 	}
			// }
		});
	}

	#updateInternalState() {
		active_states.forEach((state) => {
			this.active[state] = this.editor.isActive(state);
		});
	}

	destroy() {
		this.editor.destroy();
	}
}
