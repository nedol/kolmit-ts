<script>
     import { onMount } from 'svelte';
        export let muted = false;
        export let srcObject;

        let rs; 
        onMount(async () => {

        });

        $: if(rs && srcObject){
            rs.srcObject = srcObject;
        }
</script>

<audio bind:this={rs} autoplay {muted}>
    <track kind="captions">
</audio>

