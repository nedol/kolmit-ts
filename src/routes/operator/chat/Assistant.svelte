<script lang="ts">
 import Card, { PrimaryAction, Media, MediaContent } from '@smui/card';
 import tutor_src from '$lib/images/tutor.png';

const aiAssistant = {
    operator: 'ai_assistant', // Уникальный идентификатор
    name: 'Kolmit',     // Имя ассистента
    src: tutor_src, // Путь к изображению
    status: 'offer',         // Статус
    type: 'dialog',               // Тип (для区分 AI от обычных пользователей)
  };
</script>

<div class="card_container">
    <Card
    style="width:30px; "
    >
    <Media
        class="card-media-square"
        aspectRatio="square"
    >
        <MediaContent>
        <img
            src={aiAssistant.src}
            alt=""
            width="28px"
            style="position:relative; padding:1px"
        />
        </MediaContent>
    </Media>

    </Card>
</div>

<style>
.card_container{
    display: block;
  position: relative;  
}

</style>