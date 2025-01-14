<script>
    import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar';
    import IconButton, { Icon } from '@smui/icon-button';
    import Badge from '@smui-extra/badge';
    
    import {
        mdiFormatAlignLeft,
        mdiArrowRight,
        mdiArrowLeft,
        mdiShuffle,
        mdiPagePreviousOutline,
        mdiChevronDownCircleOutline,
        mdiHelp,
        mdiTextBoxCheckOutline,
        mdiPlay,
        mdiEarHearing,
        mdiTranslateVariant,
        mdiTranslate,
        mdiTranslateOff
    } from '@mdi/js';

    export let cur, bricks_data,nextSentence,span_equal, formattedSentence 
     let topAppBar;

     export const onToggleWord = ()=>{

        if(!span_equal){

            formattedSentence.forEach((item)=>{
                item.placeholder = item.value;
                item.class = "invisible"
            });
        }else{
            formattedSentence.forEach((item)=>{
                item.placeholder = "\u00a0\u00a0\u00a0\u00a0\u00a0";
                item.class = ""
            });
        }

formattedSentence = formattedSentence

}
</script>
<div class="top-app-bar-container flexor">

<TopAppBar bind:this={topAppBar} variant="fixed">
    <Row>
      <Section align="start">
        <!-- {#if currentWordIndex > 0}
          <Icon
            tag="svg"
            on:click={onPrev}
            viewBox="0 0 24 24"
            style="margin:10px 5px 10px 5px; scale:.5; width:50px"
          >
            <path fill="white" d={mdiArrowLeft} />
          </Icon>
        {/if} -->
      </Section>
      <Section align="start">

      </Section>
      <Section>
          
          <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px"  fill="white"  
              on:click={()=>{span_equal = !span_equal; onToggleWord()}} >
              <!-- Верхняя полоска -->
              <rect x="2" y="4" width="14" height="2" />
              <rect x="18" y="4" width="4" height="2" />
              <!-- Вторая полоска (разделенная на две части) -->
              <rect x="12" y="8" width="10" height="2" />
              <rect x="2" y="8" width="8" height="2" />
              <!-- Третья полоска -->
              <rect x="2" y="12" width="20" height="2" />
              <!-- Четвертая полоска (разделенная на две части) -->
              <rect x="2" y="16" width="14" height="2" />
              <rect x="18" y="16" width="4" height="2" />
              <!-- Нижняя полоска -->
              <rect x="12" y="20" width="10" height="2" />
              <rect x="2" y="20" width="8" height="2" />
          </Icon>

      </Section>

      <Section align="end">
        <div class="counter">
          <p>
            <span class="mdc-typography--overline" style="position:relative"
              >{cur+1}
              <Badge
                position="middle"
                align="bottom-end - bottom-middle"
                aria-label="unread count"
                style="margin-right:-10px;scale:.8">{bricks_data?.text.length-1}</Badge
              >
            </span>
          </p>
        </div>
      </Section>
      <Section align="end">

      </Section>
      <Section align="end">

      </Section>

      <Section align="end">
        <Icon
          tag="svg"
          on:click={nextSentence}
          viewBox="0 0 24 24"
          style="margin:10px 5px 10px 5px; scale:.5; width:50px"
        >
        <path fill="green" d={mdiArrowRight} />
      </Icon>
      </Section>
    </Row>
  </TopAppBar>
    </div>
  <style>
    .top-app-bar-container{
        position: relative;
        top:0px; 
        height: 45px;
        /* transform: scale(1.2) translate(-4%,0%);
        transform-origin: center ;  */
    }
        .counter {
        /* position: absolute; */
        background-color: #f0f0f0;
        padding: 0px;
        border-radius: 25px;
        width: 30px;
        height: 30px;
        top: -10px;
        left: -6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    .counter p {
        margin: 0;
        font-size: 15px;
        color: #333;
    }

    .counter span {
        font-weight: 700;
        font-size: 15px;
        color: #ff5733; /* цвет счетчика */
    }
  </style>