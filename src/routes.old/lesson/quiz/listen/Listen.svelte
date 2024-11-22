<script lang="ts">
  import { onMount } from 'svelte';

  export let title = "Название аудиофайла";
  export let audioSrc = "";
  export let text = "Текст, который должен отображаться под аудиоконтейнером. Это пример текста, чтобы продемонстрировать вертикальную прокрутку, если текст слишком длинный и не помещается в отведенное пространство.";

  let audio: HTMLAudioElement;
  let isPlaying = false;

  function toggleAudio() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  function handlePlay() {
    isPlaying = true;
  }

  function handlePause() {
    isPlaying = false;
  }

  onMount(() => {
    audio = new Audio(audioSrc);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
      audio = null;
    };
  });
</script>

<main>
  <div class="title">{title}</div>

  <div class="audio-container">
    <button class="play-button" on:click={toggleAudio}>
      {isPlaying ? "Пауза" : "Воспроизвести аудио"}
    </button>
  </div>

  <div class="text-container">
    <p>{text}</p>
  </div>
</main>

<style>
  main {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh; /* 100% высоты экрана */
    padding-top: 80px; /* Отступ сверху */
  }

  .audio-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f8ff;
    border: 2px solid #1e90ff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    text-align: center;
    margin-bottom: 40px;
  }

  .title {
    position: absolute;
    top: 40px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
    color: #1e90ff;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .play-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    background-color: #1e90ff;
    color: #fff;
    border: none;
    border-radius: 50px;
    transition: all 0.3s ease;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  }

  .play-button:hover {
    background-color: #1c86ee;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  .play-button:active {
    transform: translateY(1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  }

  .text-container {
    max-width: 400px;
    padding: 0 10px;
    text-align: center;
    overflow-y: auto; /* Включение вертикальной прокрутки */
    border: 1px solid #ddd; /* Легкая граница для отделения */
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-grow: 1; /* Занимает оставшуюся часть экрана */
    margin-top: 10px;
    padding-bottom: 20px;
  }

  .text-container p {
    font-size: 18px;
    color: #333;
    line-height: 1.5;
    font-weight: 400;
  }
</style>
