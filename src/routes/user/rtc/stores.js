import { writable } from 'svelte/store';

export let editable = writable(false);

export let langs = writable('en');

export const hosts = writable();

export const msg = writable();

export let msg_1 = writable();

export let signal = writable();

export let dicts = writable();
