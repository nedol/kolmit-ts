import { c as create_ssr_component } from "../../../chunks/ssr.js";
const css = {
  code: "header.svelte-19uk3xr.svelte-19uk3xr{background-color:#3498db;color:#fff;text-align:center;padding:20px}nav.svelte-19uk3xr ul.svelte-19uk3xr{list-style:none;padding:0;text-align:center;background-color:#333}nav.svelte-19uk3xr ul li.svelte-19uk3xr{display:inline;margin-right:20px}nav.svelte-19uk3xr a.svelte-19uk3xr{text-decoration:none;color:#fff}main.svelte-19uk3xr.svelte-19uk3xr{margin:20px}section.svelte-19uk3xr.svelte-19uk3xr{margin-bottom:30px}#language-select.svelte-19uk3xr.svelte-19uk3xr{margin:20px;padding:10px;font-size:16px}footer.svelte-19uk3xr.svelte-19uk3xr{background-color:#333;color:#fff;text-align:center;padding:10px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<html lang="ru"><head data-svelte-h="svelte-xut2jm"><meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Домашняя страница Kolmit</title> <link rel="stylesheet" href="styles.css"> </head> <body><header class="svelte-19uk3xr" data-svelte-h="svelte-10gip9a"><h1>Добро пожаловать в Kolmit</h1> <p>Ваше приложение для изучения иностранных языков</p></header> <nav class="svelte-19uk3xr" data-svelte-h="svelte-ny1ykt"><ul class="svelte-19uk3xr"><li class="svelte-19uk3xr"><a href="#" class="svelte-19uk3xr">Главная</a></li> <li class="svelte-19uk3xr"><a href="#" class="svelte-19uk3xr">О нас</a></li> <li class="svelte-19uk3xr"><a href="#" class="svelte-19uk3xr">Учебные материалы</a></li> <li class="svelte-19uk3xr"><a href="#" class="svelte-19uk3xr">Контакты</a></li></ul></nav> <main class="svelte-19uk3xr" data-svelte-h="svelte-k20qj1"><section class="svelte-19uk3xr"><h2>О нас</h2> <p id="about-text">Мы - команда разработчиков, увлеченных изучением иностранных языков. Наше приложение
					Kolmit создано для того, чтобы помочь вам в этом нелегком деле.</p></section> <section class="svelte-19uk3xr"><h2>Учебные материалы</h2> <p id="materials-text">У нас есть обширная библиотека учебных материалов на различных языках. Вы можете начать
					изучение прямо сейчас!</p></section></main> <footer class="svelte-19uk3xr" data-svelte-h="svelte-3e0agz"><p>© 2024 Kolmit. Все права защищены.</p></footer> <select id="language-select" class="svelte-19uk3xr"><option value="ru" data-svelte-h="svelte-kb8mvn">Русский</option><option value="en" data-svelte-h="svelte-1bjraht">English</option><option value="nl" data-svelte-h="svelte-hi7116">Nederlands</option><option value="es" data-svelte-h="svelte-128r36l">Español</option><option value="fr" data-svelte-h="svelte-r9p3ar">Français</option></select> <script data-svelte-h="svelte-lqsuaj">// JavaScript для изменения контента при выборе языка
			const languageSelect = document.getElementById('language-select');
			const aboutText = document.getElementById('about-text');
			const materialsText = document.getElementById('materials-text');

			languageSelect.addEventListener('change', function () {
				const selectedLanguage = languageSelect.value;

				if (selectedLanguage === 'ru') {
					aboutText.textContent =
						'Мы - команда разработчиков, увлеченных изучением иностранных языков. Наше приложение Kolmit создано для того, чтобы помочь вам в этом нелегком деле.';
					materialsText.textContent =
						'У нас есть обширная библиотека учебных материалов на различных языках. Вы можете начать изучение прямо сейчас!';
				} else if (selectedLanguage === 'en') {
					aboutText.textContent =
						'We are a team of developers passionate about learning foreign languages. Our Kolmit app is designed to help you in this challenging endeavor.';
					materialsText.textContent =
						'We have an extensive library of educational materials in various languages. You can start learning right now!';
				} else if (selectedLanguage === 'nl') {
					aboutText.textContent =
						'Wij zijn een team van ontwikkelaars die gepassioneerd zijn over het leren van vreemde talen. Onze Kolmit-app is ontworpen om je te helpen bij deze uitdagende onderneming.';
					materialsText.textContent =
						'We hebben een uitgebreide bibliotheek met educatief materiaal in verschillende talen. Je kunt nu beginnen met leren!';
				} else if (selectedLanguage === 'es') {
					aboutText.textContent =
						'Somos un equipo de desarrolladores apasionados por aprender idiomas extranjeros. Nuestra aplicación Kolmit está diseñada para ayudarte en este desafiante proceso.';
					materialsText.textContent =
						'Tenemos una amplia biblioteca de materiales educativos en varios idiomas. ¡Puedes comenzar a aprender ahora mismo!';
				} else if (selectedLanguage === 'fr') {
					aboutText.textContent =
						"Nous sommes une équipe de développeurs passionnés par l'apprentissage des langues étrangères. Notre application Kolmit est conçue pour vous aider dans cette entreprise exigeante.";
					materialsText.textContent =
						'Nous avons une vaste bibliothèque de matériel éducatif dans diverses langues. Vous pouvez commencer à apprendre dès maintenant !';
				}
			});<\/script></body> </html>`;
});
export {
  Page as default
};
