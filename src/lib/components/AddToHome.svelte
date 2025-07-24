<script>
  import { onMount } from "svelte";
  let deferredPrompt = null;
  let showButton = false;

  onMount(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showButton = true;
    });

    window.addEventListener("appinstalled", () => {
      console.log("📦 PWA установлена");
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ SW зарегистрирован"))
        .catch(console.error);
    }
  });

  async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    console.log("Установка:", result.outcome);

    deferredPrompt = null;
    showButton = false;
  }
</script>

{#if showButton}
  <button
    style="position:fixed; top:0;left:0"
    on:click={installApp}
    class="add-btn"
    aria-label="Добавить на главный экран"
  >
    📲 Добавить на главный экран
  </button>
{/if}
