import type { TiptapViewModel } from './TipTapViewModel.svelte';
import { OpenDebouncer } from './OpenDebouncer.svelte';

export class BubbleMenuModel {
	#model = $state() as TiptapViewModel;
	#openDropdown = $state<string | null | undefined>();

	editor = $derived(this.#model.editor);
	heading = $derived(this.#model.heading);
	list = $derived(this.#model.list);

	#timeout: number | null | undefined;
	// #openState = new OpenDebouncer();
	//
	get openDropdown() {
		return this.#openDropdown;
	}
	set openDropdown(value: string | null | undefined) {
		console.log('set openDropdown...', { value });
		clearTimeout(this.#timeout!);
		if (value === this.#openDropdown) return;
		if (value == null) {
			this.#timeout = setTimeout(() => {
				console.log('set openDropdown 1!', { value });
				this.#openDropdown = value;
			}, 200);
		} else {
			console.log('set openDropdown 2!', { value });
			this.#openDropdown = value;
		}
	}

	constructor(model: TiptapViewModel) {
		this.#model = model;
	}

	// doOpen(dropdown: string) {
	// 	this.dropdown[dropdown] = true;
	// 	if (this.#timeout == null) return;
	// 	clearTimeout(this.#timeout);
	// 	this.#timeout = null;
	// }
	//
	// doClose(dropdown: string) {}
}
