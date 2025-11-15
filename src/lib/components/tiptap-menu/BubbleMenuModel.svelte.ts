import type { TiptapViewModel } from './TipTapViewModel.svelte';

export class BubbleMenuModel {
	#model = $state() as TiptapViewModel;
	#openDropdown = $state<string | null | undefined>();

	editor = $derived(this.#model.editor);
	heading = $derived(this.#model.heading);
	list = $derived(this.#model.list);

	#timeout: ReturnType<typeof setTimeout> | null | undefined;

	get openDropdown() {
		return this.#openDropdown;
	}
	set openDropdown(value: string | null | undefined) {
		clearTimeout(this.#timeout!);
		if (value === this.#openDropdown) return;
		if (value == null) {
			this.#timeout = setTimeout(() => {
				this.#openDropdown = value;
			}, 200);
		} else {
			this.#openDropdown = value;
		}
	}

	constructor(model: TiptapViewModel) {
		this.#model = model;
	}
}
