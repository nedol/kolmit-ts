declare module './Word.svelte' {
  import { SvelteComponent } from 'svelte';

  export interface WordProps {
    children?: string;
    // Add other props if your Word component accepts more
  }

  export default class Word extends SvelteComponent<WordProps, any, any> {}
}