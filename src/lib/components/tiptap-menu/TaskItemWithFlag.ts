import { TaskItem } from '@tiptap/extension-list';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { mount, unmount } from 'svelte';
import TaskFlagButtonWrapper from './TaskFlagButtonWrapper.svelte';
import type { AppModel } from '$lib/AppModel.svelte';

export interface TaskItemWithFlagOptions {
	appModel: AppModel | null;
}

export const TaskItemWithFlag = TaskItem.extend<TaskItemWithFlagOptions>({
	name: 'taskItem',

	addOptions() {
		return {
			...this.parent?.(),
			appModel: null,
		} as any;
	},

	addAttributes() {
		return {
			...this.parent?.(),
			flagged: {
				default: false,
				parseHTML: (element) => element.getAttribute('data-flagged') === 'true',
				renderHTML: (attributes) => ({
					'data-flagged': attributes.flagged ? 'true' : 'false',
				}),
			},
		};
	},

	addCommands() {
		return {
			...this.parent?.(),
			flagg:
				() =>
				({ commands }: { commands: any }) => {
					console.log({ commands });
					return commands.setContent('hello');
				},
		};
	},

	addKeyboardShortcuts() {
		return {
			...this.parent?.(),
			'Mod-l': () => {
				console.log('Keyboard shortcut executed');
				return true;
			},
		};
	},

	addNodeView() {
		return ({ node, getPos, editor }) => {
			// Create main container
			const dom = document.createElement('li');
			dom.dataset.type = 'taskItem';
			dom.dataset.checked = String(node.attrs.checked);
			if (node.attrs.id) dom.dataset.id = node.attrs.id;
			if (node.attrs.flagged) dom.dataset.flagged = 'true';

			// Helper to update node attributes
			const updateNodeAttrs = (attrs: Partial<typeof node.attrs>) => {
				const pos = getPos();
				if (typeof pos === 'number') {
					editor.commands.command(({ tr }) => {
						tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs });
						return true;
					});
				}
			};

			// Create checkbox
			const label = document.createElement('label');
			label.contentEditable = 'false';
			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = node.attrs.checked;
			checkbox.onchange = () => updateNodeAttrs({ checked: checkbox.checked });
			label.appendChild(checkbox);
			dom.appendChild(label);

			// Create flag button
			const flagContainer = document.createElement('span');
			flagContainer.contentEditable = 'false';
			const flagComponent = mount(TaskFlagButtonWrapper, {
				target: flagContainer,
				props: {
					initialFlagged: node.attrs.flagged ?? false,
					onclick: (e: MouseEvent) => {
						e.preventDefault();
						e.stopPropagation();
						updateNodeAttrs({ flagged: !node.attrs.flagged });
					},
				},
			});
			dom.appendChild(flagContainer);

			// Create content container
			const contentDOM = document.createElement('div');
			dom.appendChild(contentDOM);

			return {
				dom,
				contentDOM,
				update: (updatedNode: ProseMirrorNode) => {
					if (updatedNode.type !== node.type) return false;

					// Update checkbox state
					checkbox.checked = updatedNode.attrs.checked;
					dom.dataset.checked = String(updatedNode.attrs.checked);

					// Update flagged state
					const flagged = updatedNode.attrs.flagged ?? false;
					if (flagged) {
						dom.dataset.flagged = 'true';
					} else {
						delete dom.dataset.flagged;
					}
					flagComponent.updateFlagged(flagged);

					return true;
				},
				destroy: () => unmount(flagComponent),
			};
		};
	},
});
