import { getContext, setContext } from 'svelte';

const APP_MODEL_KEY = Symbol('APP_MODEL');

export class AppModel {
	constructor() {
		// Initialize any app-level state here
	}
}

export function initialiseAppModel(model: AppModel = new AppModel()) {
	return setAppModel(model);
}

export function setAppModel(model: AppModel) {
	return setContext(APP_MODEL_KEY, model);
}

export function getAppModel(): AppModel {
	return getContext(APP_MODEL_KEY);
}
