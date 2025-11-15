import { TaskItem } from '@tiptap/extension-list';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { mount, unmount } from 'svelte';
import TaskFlagButtonWrapper from './TaskFlagButtonWrapper.svelte';
import type { AppModel } from '$lib/AppModel.svelte';
import TaskItemView from '$lib/components/tiptap-menu/TaskItem.svelte';

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

	addNodeView() {
		return ({ node, getPos, editor }) => {
			// Create main container
			const dom = document.createElement('li');
			dom.dataset.type = 'taskItem';
			dom.dataset.checked = String(node.attrs.checked);
			// dom.style.display = 'flex';
			// dom.style.justifyItems = 'center';
			// dom.style.alignContent = 'center';
			// dom.style.border = 'solid 1px orange';
			if (node.attrs.id) dom.dataset.id = node.attrs.id;
			if (node.attrs.flagged) dom.dataset.flagged = 'true';
			if (node.attrs.checked) dom.dataset.checked = 'true';

			// Helper to update node attributes
			const updateNodeAttrs = (attrs: Partial<typeof node.attrs>) => {
				const pos = getPos();
				if (typeof pos === 'number') {
					editor.commands.command(({ tr }) => {
						// Get the current node from the document to ensure we have the latest attrs
						const currentNode = tr.doc.nodeAt(pos);
						if (currentNode) {
							tr.setNodeMarkup(pos, undefined, { ...currentNode.attrs, ...attrs });
						}
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
			// const flagContainer = document.createElement('span');
			// flagContainer.contentEditable = 'false';
			// let currentFlagged = node.attrs.flagged ?? false;
			// const flagComponent = mount(TaskFlagButtonWrapper, {
			// 	target: flagContainer,
			// 	props: {
			// 		flagged: currentFlagged,
			// 		onclick: (e: MouseEvent) => {
			// 			e.preventDefault();
			// 			e.stopPropagation();
			// 			updateNodeAttrs({ flagged: !currentFlagged });
			// 		},
			// 	},
			// });
			// dom.appendChild(flagContainer);

			let currentFlagged = node.attrs.flagged ?? false;
			const taskItemView = mount(TaskItemView, {
				target: dom,
				props: {
					checked: node.attrs.checked,
					flagged: currentFlagged,
					onclick: (e: MouseEvent) => {
						e.preventDefault();
						e.stopPropagation();
						updateNodeAttrs({ flagged: !currentFlagged });
					},
					onchecked: (v) => {
						// e.preventDefault();
						// e.stopPropagation();
						updateNodeAttrs({ checked: v });
					},
				},
			});
			// dom.appendChild(taskItemView);

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
					currentFlagged = updatedNode.attrs.flagged ?? false;
					if (currentFlagged) {
						dom.dataset.flagged = 'true';
					} else {
						delete dom.dataset.flagged;
					}

					taskItemView.updateChecked(updatedNode.attrs.checked);
					taskItemView.updateFlagged(currentFlagged);

					return true;
				},
				destroy: () => {
					unmount(flagComponent);
				},
			};
		};
	},
});
