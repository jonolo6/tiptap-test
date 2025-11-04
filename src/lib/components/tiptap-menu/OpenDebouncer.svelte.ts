export class OpenDebouncer {
	open = $state(false);
	#id: number | null | undefined;

	doOpen() {
		if (this.#id != null) clearTimeout(this.#id);
		if (this.open === true) return;
		this.open = true;
	}
	doClose() {
		this.#id = setTimeout(() => {
			this.open = false;
		}, 200);
	}
}
