<script>
    export let children;
  </script>
  
  <w on:click>
    <slot>{children}</slot>
  </w>
  
  <style>
    w {
      cursor: pointer;
      /* Добавьте стили для визуального выделения слов, если хотите */
    }
  </style>