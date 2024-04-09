// @ts-nocheck
import { redirect } from '@sveltejs/kit';

/** @param {Parameters<import('./$types').LayoutServerLoad>[0]} event */
export function load({ locals }) {
	// if (!locals.user) {
	// 	throw redirect(307, '/site');
	// }
}
