<span on:click={OnCollClick} ref='#'>{dnld}</span>

{#if pricing}
    <!-- <iframe  src='/kolmi/assets/pricing.{lang}.html' class='content' title="pricing" frameBorder="0"></iframe> -->
    <Tarif {rtc}></Tarif>
{/if}

<style>
    .content {
        /* padding: 0 18px; */
        width: 100%;
        height: 100%;
        overflow: hidden;
        /* overflow-y: scroll; */
        transition: max-height 0.2s ease-out;
        background-color: #f1f1f1;
    }
</style>

<script>
    import { onDestroy } from 'svelte';
    import Tarif from './Tarif.svelte'

    export let rtc;
    import {langs} from '$lib/stores.ts'
    let lang = 'en';
    const unsubscr_lang = langs.subscribe((data) => {
        if(data)
            lang = data;
    });

    import {dicts} from '$lib/stores.ts';
    let txt = 'Download Call Center';
    let dnld = '';
    let Dict;
    const unsubscribe = dicts.subscribe(data => {
        if(data){
            Dict = data;
            dnld = Dict.dict[txt][lang]
        }
    });
    onDestroy(unsubscribe);

    $:if(lang && Dict && txt){
        dnld = Dict.dict[txt][lang];
    }

    let pricing = false;
    async function OnCollClick(ev){
        txt = "Choose Tarif"
        pricing = true;
        // content.style.display = 'block'
        // if (content.style.maxHeight){
        //     content.style.maxHeight = null;
        // } else {
        //     content.style.maxHeight = content.scrollHeight +  "px";
        // } 
    }
</script>
