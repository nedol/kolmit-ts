<script>
  export let className = '';
</script>

<div class={`container ${className}`}>
  <slot />
</div>

<style>
  :global(.mdc-top-app-bar__row){
      height:48px
  }

  :global(.mdc-icon-button){
    top:5px;
    padding: 1px;
    margin: 0px;
    width: 25px;
    height: 25px;
  }
  .top-app-bar-container{
    position: relative;
    top:0px; 
    height: 45px;
  /* transform: scale(1.2) isTransloc(-4%,0%);
  transform-origin: center ;  */
  }

  .card {
    transition: transform 0.3s ease-in-out;
    transform-style: preserve-3d;
    transition: transform 0.5s;
    top: 10px;
    overflow-y: auto;
    border-radius: 5px;
    margin: 0 auto;
    position: relative;
    height: calc(100vh - 80px);
    margin-left: 10px;
    margin-right: 10px;
  }

  .container {
    position: relative;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
    border: 1px solid lightgrey;
    border-radius: 5px;
    margin:5px 10px;
  }
  .hint-button {
      border: 0px;
      color: white;
      background-color: #2196f3;
      border-radius: 3px;
      padding: 8px 10px;
  }

  .bricks-header {
    display: flex;
    align-items: center;
    gap: 10px; /* Отступ между элементами */
    margin-top: 5px;
  }


  .bricks_name{
    position:relative;
    width:80%;
    color: black;
    font-style: italic;
    font-size: small;
    font-family: serif;
  }

  .invisible{
      color:transparent
  }

  .article{
    display: flex;;
    justify-content: center;
    align-items: center;
    color: #2196f3;
    font-style: italic;
    font-size: small;
    margin-left: 10px;
    margin-right: 10px;
  }
  .speaker-button {
    display: inline-flex;
    float: right;
    font-size: large;
    border-radius: 25px;
    margin-right: 0px;
    margin-left: 10px;
    z-index: 0;
  }

  .counter {
      position: relative;
      background-color: #f0f0f0;
      border-radius: 25px;
      width: 30px;
      height: 30px;
      top: 0px;
      left: -5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
  }


  .trans {
      font-size: 0.8em;
      flex-direction: column;
      align-items: center;
      text-align: center;
      line-height: 1.2 !important;
      margin-left: 10px;
      margin-right: 10px;
    
  }

  .placeholder {
    border-bottom: 1px dashed #000;
    cursor: pointer;
  }

  .title {
      width: fit-content;
      margin: 5px; 

      color: #9eb2cc;
      line-height: normal;
      text-align: left;
      font-size: 0.8em;
      background-color:transparent; 
  }
  
  .word-list {
    display: flex;
    justify-content: center;
    margin: 10px 2px 15px 2px;
    gap: 10px;
    font-weight: 500;
    flex-wrap: wrap;
    color: #2196f3;
  }

  .formatted-list {
    display: flex;
    justify-content: center;
    margin: 10px 2px 15px 2px;
    gap: 10px;
    font-weight: 700;
    flex-wrap: wrap;
    color: #2196f3;
  }

  .word-list span:not(.ver):not(.subj):not(.tijd):not(.plaats):not(.adv), 
  .formatted-list span:not(.ver):not(.subj):not(.tijd):not(.plaats):not(.adv) {
    padding: 0px 6px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #f9f9f9;
    cursor: pointer;
    user-select: none;

  }

  .formatted-list span:focus {
    outline: 2px solid transparent
  }

  .word-list span{
      border-color: lightgray;
  }

  .incorrect{
      color:red;
      animation: color-blink 1s infinite;
  }

  .material-symbols-outlined {
      font-size: 15px;
      scale: 1.5;
      font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 24;
  }

  .rate{
    position:relative; 
    float:right; 
    right: -6px;
    bottom:30px;
  }

  .similarity, .rate  p {
    margin: 0;
    font-size: 10px;
    color: #333;
  }
  .similarity, .rate {
    position: relative;
    margin: 0 auto;
    background-color: #f0f0f0;
    padding: 0px;
    border-radius: 20px;
    width: 30px;
    height: 30px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .similarity, .rate  span {
    font-weight: 700;
    font-size: 15px;
    color: #2ca838; /* цвет счетчика */
    text-align: center;
  }

  .rate span{   
    font-size: 10px;
  }


 .ver {
    position: relative;
    border:2px solid; 
    border-color: rgb(225, 111, 111);
    --border-color: rgb(225, 111, 111); /* Красный для .ver */
    border-radius: 5px;
    /* background-color: lightcoral; */
    padding: 0px 6px;
  } 

  .word-list .ver,.formatted-list .ver:not(.invisible){
    color: rgb(225, 111, 111); 
  }

  .subj{
    position: relative;
    border:2px solid; 
    border-color: rgb(49, 49, 169); 
    --border-color: rgb(49, 49, 169); 
    border-radius: 7px;
    /* background-color:lightskyblue; */
    padding: 0px 6px;
  } 

  .word-list .subj,.formatted-list .subj:not(.invisible){
    color: rgb(49, 49, 169); 
  }

  .tijd{
    position: relative;
    border:2px solid; 
    border-color: rgb(119, 201, 119); 
    --border-color: rgb(119, 201, 119); 
    border-radius: 5px;
    /* background-color: lightgreen; */
    padding: 0px 6px;
  } 


  .word-list .tijd,.formatted-list .tijd:not(.invisible){
    color: rgb(119, 201, 119);
  }

  .plaats{
    position: relative;
    border:2px solid; 
    border-color:  darkmagenta;
    --border-color:  darkmagenta;
    /* background-color: lightcyan ; */
    border-radius: 5px;
    padding: 0px 6px;
  } 
  .word-list .plaats,.formatted-list .plaats:not(.invisible){
    color:  darkmagenta
  }

  .adv{
    position: relative;
    border:2px solid; 
    border-color: darkmagenta;
    --border-color: darkmagenta;
    border-radius: 5px;
    padding: 0px 6px;
  }

  .word-list .adv,.formatted-list .adv:not(.invisible){
    color:  darkmagenta
  }


  /* Анимация мигания */
  @keyframes color-blink {
    0%, 100% {
      color:red;

    }
    50% {
      color:white;

    }
  }

  @keyframes border-blink {
    0%, 100% {
      box-shadow: 0 0 0px 0 var(--border-color, rgb(124, 124, 139)); /* Без тени */
  }
  50% {

      box-shadow: 0 0 10px 4px var(--border-color, rgb(124, 124, 139)); /* Тень цвета рамки */
  }
}

   /* Эффект мигания при фокусе */
   span:focus {
      /*outline: none; /* Убираем стандартный outline браузера */
      animation: border-blink 1s infinite; /* Запускает мигание */
      border-width: 2px; /* Устанавливаем ширину рамки для чёткости */
    }

      /* Стили для мобильных устройств */
  @media screen and (max-width: 767px) {
      .trans {
          font-size: 0.7em;
      }
      .word-list, .formatted-list {
          font-size: 0.9em;
          /* margin: 2px 10px; */
          padding: 0 5px
      }
      .title{
          font-size: small;
      }
  }
</style>