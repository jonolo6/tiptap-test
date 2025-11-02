export function preventDefault(fn: (event: Event) => void) {
	return function (event: Event) {
		event.preventDefault();
		fn(event);
	};
}

export function once(fn: (event: Event) => void) {
	let count = 0;
	return function (event: Event) {
		if (count++ === 0) {
			fn(event);
		}
	};
}
