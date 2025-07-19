<script lang="ts">
  let deferredPrompt = null;
  let showButton = false;

  // перехватываем момент, когда установка разрешена
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // блокируем авто-показ
    deferredPrompt = e;
    showButton = true;
  });

  async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // показать нативное окно установки
    const result = await deferredPrompt.userChoice;
    console.log("Установка:", result.outcome); // accepted / dismissed

    deferredPrompt = null;
    showButton = false;
  }
</script>

{#if showButton}
  <button
    on:click={installApp}
    class="add-btn"
    aria-label="Добавить на главный экран"
  >
    📲 Добавить на главный экран
  </button>
{/if}

<style>
  .add-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 16px;
    font-size: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    z-index: 1000;
  }

  .add-btn:hover {
    background: #0056b3;
  }
</style>
