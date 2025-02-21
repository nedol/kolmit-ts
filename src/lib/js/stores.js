import { writable } from 'svelte/store';


export let operatorst = writable();

export let editable = writable(false);

export let view = writable('group');

export let nlang = writable('en'); //native lang

export let langs = writable('en'); //current lang

export let llang = writable('en'); //learning

export let posterst = writable();

export let msg = writable();

export let signal = writable();

// export let wss = writable();

export let dicts = writable();

export let credentials = writable();

export let users = writable({});

export let call_but_status = writable('inactive');

export let ice_conf = writable();

export let rtcPool_st = writable({ });
// rtcPool_st.set({ });

export let lesson = writable({ visible: true , data:''});

export let click_call_func = writable();

export let dc = writable();

export let dc_state = writable('close');

export let sql_st = writable();

export let muted = writable(true);

export let showBottomAppBar = writable(true);

export let OnCheckQU = writable();
