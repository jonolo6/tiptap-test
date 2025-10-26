import { Editor, type Content } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';

export class TiptapViewModel {
	editor = $state() as Editor;

	formatState = $state([]);

	active = $state<Record<string, boolean>>({});

	constructor(element: HTMLElement, content: Content) {
		this.editor = new Editor({
			element,
			extensions: [StarterKit],
			content,
			onUpdate: ({ editor: _editor }) => {
				this.#updateInternalState();
			},
			onSelectionUpdate: ({ editor: _editor }) => {
				this.#updateInternalState();
			}
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
		this.active['bold'] = this.editor.isActive('bold');
		this.active['italic'] = this.editor.isActive('italic');
		this.active['strike'] = this.editor.isActive('strike');
	}

	destroy() {
		this.editor.destroy();
	}
}
