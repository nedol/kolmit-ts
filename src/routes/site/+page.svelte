<html lang="ru">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Домашняя страница Kolmit</title>
		<link rel="stylesheet" href="styles.css" />
		<!-- Подключите ваш файл стилей CSS здесь -->
	</head>
	<body>
		<header>
			<h1>Добро пожаловать в Kolmit</h1>
			<p>Ваше приложение для изучения иностранных языков</p>
		</header>

		<nav>
			<ul>
				<li><a href="#">Главная</a></li>
				<li><a href="#">О нас</a></li>
				<li><a href="#">Учебные материалы</a></li>
				<li><a href="#">Контакты</a></li>
			</ul>
		</nav>

		<main>
			<section>
				<h2>О нас</h2>
				<p id="about-text">
					Мы - команда разработчиков, увлеченных изучением иностранных языков. Наше приложение
					Kolmit создано для того, чтобы помочь вам в этом нелегком деле.
				</p>
			</section>

			<section>
				<h2>Учебные материалы</h2>
				<p id="materials-text">
					У нас есть обширная библиотека учебных материалов на различных языках. Вы можете начать
					изучение прямо сейчас!
				</p>
			</section>
		</main>

		<footer>
			<p>&copy; 2024 Kolmit. Все права защищены.</p>
		</footer>

		<select id="language-select">
			<option value="ru">Русский</option>
			<option value="en">English</option>
			<option value="nl">Nederlands</option>
			<option value="es">Español</option>
			<option value="fr">Français</option>
		</select>

		<script>
			// JavaScript для изменения контента при выборе языка
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
			});
		</script>
	</body>
</html>

<style>
	/* Стилизация шапки */
	header {
		background-color: #3498db;
		color: #fff;
		text-align: center;
		padding: 20px;
	}

	/* Стилизация навигации */
	nav ul {
		list-style: none;
		padding: 0;
		text-align: center;
		background-color: #333;
	}

	nav ul li {
		display: inline;
		margin-right: 20px;
	}

	nav a {
		text-decoration: none;
		color: #fff;
	}

	/* Стилизация основного контента */
	main {
		margin: 20px;
	}

	section {
		margin-bottom: 30px;
	}

	/* Стилизация выбора языков */
	#language-select {
		margin: 20px;
		padding: 10px;
		font-size: 16px;
	}

	/* Стилизация подвала */
	footer {
		background-color: #333;
		color: #fff;
		text-align: center;
		padding: 10px;
	}
</style>
