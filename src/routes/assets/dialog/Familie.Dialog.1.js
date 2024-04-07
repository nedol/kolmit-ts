export let dialog_data = {
	title: 'Intro',
	html: [
		`
	<style>
		body {
			font-family: 'Arial', sans-serif;
			background-color: #f4f4f4;
			margin: 0;
			padding: 0;
	}

		.html_container {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			margin: 20px;
	}

		.html_card {
			flex-basis: 80%;
	
			padding: 20px;
			border: 1px solid #3498db;
			border-radius: 10px;
			margin-bottom: 20px;
			background-color: #fff;
			box-shadow: 0 2px 4px rgba(0,
		0,
		0,
		0.1);
	}

		.header,
		.q {
			width: 80%;
			padding: 10px;
			border: 1px solid #3498db;
			border-radius: 5px;
			background-color: white;
			text-align: center;
			margin: 0 auto;
	}

		.toggleButton {
			background-color: #3498db;
			color: #fff;
			border: none;
			border-radius: 5px;
			cursor: pointer;
	}

		#question {
			visibility: hidden;
			nl-align: center;
	}
	</style>

	<body>                   

		<div class="header">Mijn familie (James) &#8594; Trinidad</div>

		<div class="html_container">
			<div class="html_card">
				Vader: Ross<br />
				84-pensioen;<br />
				met zijn vrouw praten
			</div>

			<div class="html_card">
				Moeder: Rachel<br />
				78-gepensioeneerd<br />
				met haar man praten
			</div>

			<div class="html_card">
				Broer: Joey<br />
				51-kantoor<br />
				modelvliegtuigen bouwen Janice
			</div>

			<div class="html_card">
				Zus: Monica<br />
				48-verpleegster<br />
				koffie zetten
			</div>
		</div>
	</body>
	`,
		`
	<style>
		body {
			font-family: 'Arial', sans-serif;
			background-color: #f4f4f4;
			margin: 0;
			padding: 0;
	}

		.html_container {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			margin: 20px;
	}

		.html_card {
			flex-basis: 35%;
			max-width: 400px;
			padding: 20px;
			border: 1px solid #3498db;
			border-radius: 10px;
			margin-bottom: 20px;
			background-color: #fff;
			box-shadow: 0 2px 4px rgba(0,
		0,
		0,
		0.1);
	}

		.header,
		.q {
			width: 95%;
			padding: 10px;
			border: 1px solid #3498db;
			border-radius: 5px;
			background-color: white;
			nl-align: center;
			margin: 10px;
	}

		.toggleButton {
			background-color: #3498db;
			color: #fff;
			border: none;
			border-radius: 5px;
			cursor: pointer;
	}

		#question {
			visibility: hidden;
			nl-align: center;
	}
	</style>
	<body>
		<div class="header">Mijn familie (Mimi) &#8594; Libanon</div>

		<div class="html_container">
			<div class="html_card">
				Vader: Noah<br />
				58-tandarts;<br />
				puzzelen
			</div>

			<div class="html_card">
				Moeder: Nimra<br />
				56-huisvrouw<br />
				in de tuin werken
			</div>

			<div class="html_card">
				Broer: Rami<br />
				32-gemeente<br />
				tekenen<br />
				Dina
			</div>

			<div class="html_card">
				Zus: Aya<br />
				29-kokkin<br />
				Engels spreken
			</div>
		</div>
	</body>`,
		`
		<style>
		body {
			font-family: 'Arial', sans-serif;
			background-color: #f4f4f4;
			margin: 0;
			padding: 0;
	}

		.html_container {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			margin: 20px;
	}

		.html_card {
			flex-basis: 35%;
			max-width: 400px;
			padding: 20px;
			border: 1px solid #3498db;
			border-radius: 10px;
			margin-bottom: 20px;
			background-color: #fff;
			box-shadow: 0 2px 4px rgba(0,
		0,
		0,
		0.1);
	}

		.header,
		.q {
			width: 95%;
			padding: 10px;
			border: 1px solid #3498db;
			border-radius: 5px;
			background-color: white;
			nl-align: center;
			margin: 0px;
	}

		.toggleButton {
			background-color: #3498db;
			color: #fff;
			border: none;
			border-radius: 5px;
			cursor: pointer;
	}

		#question {
			visibility: hidden;
			nl-align: center;
	}
	</style>

	<body>                   

		<div class="header">Mijn familie (Thomas) &#8594; Engeland</div>

		<div class="html_container">
			<div class="html_card">
				Vader: George<br />
				60-bouwakker;<br />
				piano spellen
			</div>

			<div class="html_card">
				Moeder: Karen<br />
				57-arts<br />
				naar de cinema gaan
			</div>

			<div class="html_card">
				Broer: Devon<br />
				22-zinger<br />
				Sarah
			</div>

			<div class="html_card">
				Zus: Diana<br />
				16-school<br />
				kleren strijken
			</div>
		</div>
	</body>
	`
	],
	content: [
		{
			num: '1',
			question: {
				nl: 'Waar woont jouw familie?',
				ru: 'Где живет твоя семья?',
				uk: 'Де живе твоя родина?',
				fr: 'Où habite ta famille?',
				en: 'Where does your family live?',
				de: 'Wo wohnt deine Familie?'
			},
			answer: {
				nl: 'Mijn familie woont nog in …',
				ru: 'Моя семья еще живет в …',
				uk: 'Моя родина ще живе в …',
				fr: 'Ma famille habite encore à …',
				en: 'My family still lives in …',
				de: 'Meine Familie lebt noch in …'
			}
		},
		{
			num: '2',
			question: {
				nl: 'Hoe heet jouw vader?',
				ru: 'Как зовут твоего отца?',
				uk: 'Як звуть твого батька?',
				fr: "Comment s'appelle ton père?",
				en: "What is your father's name?",
				de: 'Wie heißt dein Vater?'
			},
			answer: {
				nl: 'Mijn vader heet …',
				ru: 'Моего отца зовут …',
				uk: 'Мого батька звуть …',
				fr: "Mon père s'appelle …",
				en: "My father's name is …",
				de: 'Mein Vater heißt …'
			}
		},
		{
			num: '3',
			question: {
				nl: 'Hoe oud is hij?',
				ru: 'Сколько ему лет?',
				uk: 'Скільки йому років?',
				fr: 'Quel âge a-t-il?',
				en: 'How old is he?',
				de: 'Wie alt ist er?'
			},
			answer: {
				nl: 'Hij is … jaar (oud)',
				ru: 'Ему … лет',
				uk: 'Йому … років',
				fr: 'Il a … ans',
				en: 'He is … years old',
				de: 'Er ist … Jahre alt'
			}
		},
		{
			num: '4',
			question: {
				nl: 'Werkt hij?',
				ru: 'Работает ли он?',
				uk: 'Чи працює він?',
				fr: 'Travaille-t-il?',
				en: 'Does he work?',
				de: 'Arbeitet er?'
			},
			answer: {
				nl: 'Nee, hij is gepensioneerd./ Ja, hij werkt als … ./ Ja, hij is …',
				ru: 'Нет, он на пенсии./ Да, он работает как … ./ Да, он …',
				uk: 'Ні, він на пенсії./ Так, він працює як … ./ Так, він …',
				fr: 'Non, il est à la retraite. / Oui, il travaille comme … / Oui, il est …',
				en: 'No, he is retired. / Yes, he works as … / Yes, he is …',
				de: 'Nein, er ist im Ruhestand. / Ja, er arbeitet als … / Ja, er ist …'
			}
		},
		{
			num: '5',
			question: {
				nl: 'Wat doet jouw vader graag?',
				ru: 'Что твой отец любит делать?',
				uk: 'Що твій батько любить робити?',
				fr: "Qu'aime faire ton père?",
				en: 'What does your father like to do?',
				de: 'Was macht dein Vater gerne?'
			},
			answer: {
				nl: 'Mijn vader <cite>verbum+t</cite> graag …',
				ru: 'Мой отец любит …',
				uk: 'Мій батько любить …',
				fr: 'Mon père aime …',
				en: 'My father likes to …',
				de: 'Mein Vater macht gerne …'
			}
		},
		{
			num: '6',
			question: {
				nl: 'Hoe heet jouw moeder?',
				ru: 'Как зовут твою мать?',
				uk: 'Як звуть твою матір?',
				fr: "Comment s'appelle ta mère?",
				en: "What is your mother's name?",
				de: 'Wie heißt deine Mutter?'
			},
			answer: {
				nl: 'Mijn moeder heet …',
				ru: 'Мою мать зовут …',
				uk: 'Мою матір звуть …',
				fr: "Ma mère s'appelle …",
				en: "My mother's name is …",
				de: 'Meine Mutter heißt …'
			}
		},
		{
			num: '7',
			question: {
				nl: 'Hoe oud is zij?',
				ru: 'Сколько ей лет?',
				uk: 'Скільки їй років?',
				fr: 'Quel âge a-t-elle?',
				en: 'How old is she?',
				de: 'Wie alt ist sie?'
			},
			answer: {
				nl: 'Zij is … jaar (oud)',
				ru: 'Ей … лет',
				uk: 'Їй … років',
				fr: 'Elle a … ans',
				en: 'She is … years old',
				de: 'Sie ist … Jahre alt'
			}
		},
		{
			num: '8',
			question: {
				nl: 'Werkt zij?',
				ru: 'Работает ли она?',
				uk: 'Чи працює вона?',
				fr: 'Travaille-t-elle?',
				en: 'Does she work?',
				de: 'Arbeitet sie?'
			},
			answer: {
				nl: 'Nee. Ze is huisvrouw./ Ja, zij werkt als … ./ Ja, zij is … .',
				ru: 'Нет. Она домохозяйка./ Да, она работает как … ./ Да, она … .',
				uk: 'Ні. Вона домогосподарка./ Так, вона працює як … ./ Так, вона … .',
				fr: 'Non, elle est femme au foyer. / Oui, elle travaille comme … / Oui, elle est … .',
				en: 'No, she is a housewife. / Yes, she works as … / Yes, she is … .',
				de: 'Nein, sie ist Hausfrau. / Ja, sie arbeitet als … / Ja, sie ist … .'
			}
		},
		{
			num: '9',
			question: {
				nl: 'Wat doet zij niet graag?',
				ru: 'Чего она не любит делать?',
				uk: 'Що вона не любить робити?',
				fr: "Qu'aime-t-elle ne pas faire?",
				en: 'What does she not like to do?',
				de: 'Was mag sie nicht gerne tun?'
			},
			answer: {
				nl: 'Zij <cite> verbum +t </cite> niet graag … .',
				ru: 'Она не любит … .',
				uk: 'Вона не любить … .',
				fr: "Elle n'aime pas … .",
				en: 'She does not like to … .',
				de: 'Sie mag nicht gerne … .'
			}
		},
		{
			num: '10',
			question: {
				nl: 'Heb jij nog broers of zussen?',
				ru: 'У тебя есть братья или сестры?',
				uk: 'У тебе є брати або сестри?',
				fr: 'As-tu des frères ou des sœurs?',
				en: 'Do you have any brothers or sisters?',
				de: 'Hast du noch Brüder oder Schwestern?'
			},
			answer: {
				nl: 'Ja, ik heb nog 1 broer en 1 zus.',
				ru: 'Да, у меня есть еще 1 брат и 1 сестра.',
				uk: 'Так, у мене є ще 1 брат і 1 сестра.',
				fr: "Oui, j'ai encore 1 frère et 1 sœur.",
				en: 'Yes, I have 1 more brother and 1 sister.',
				de: 'Ja, ich habe noch 1 Bruder und 1 Schwester.'
			}
		},
		{
			num: '11',
			question: {
				nl: 'Hoe heet jouw broer?',
				ru: 'Как зовут твоего брата?',
				uk: 'Як звуть твого брата?',
				fr: "Comment s'appelle ton frère?",
				en: "What is your brother's name?",
				de: 'Wie heißt dein Bruder?'
			},
			answer: {
				nl: 'Mijn broer heet … .',
				ru: 'Моего брата зовут … .',
				uk: 'Мого брата звуть … .',
				fr: "Mon frère s'appelle … .",
				en: "My brother's name is … .",
				de: 'Mein Bruder heißt … .'
			}
		},
		{
			num: '12',
			question: {
				nl: 'Hoe oud is jouw broer?',
				ru: 'Сколько лет твоему брату?',
				uk: 'Скільки років твоєму братові?',
				fr: 'Quel âge a ton frère?',
				en: 'How old is your brother?',
				de: 'Wie alt ist dein Bruder?'
			},
			answer: {
				nl: 'Mijn broer is … jaar (oud).',
				ru: 'Моему брату … лет.',
				uk: 'Моєму братові … років.',
				fr: 'Mon frère a … ans.',
				en: 'My brother is … years old.',
				de: 'Mein Bruder ist … Jahre alt.'
			}
		},
		{
			num: '13',
			question: {
				nl: 'Waar werkt jouw broer?',
				ru: 'Где работает твой брат?',
				uk: 'Де працює твій брат?',
				fr: 'Où travaille ton frère?',
				en: 'Where does your brother work?',
				de: 'Wo arbeitet dein Bruder?'
			},
			answer: {
				nl: 'Mijn broer werkt <b>IN een</b> <i>+ winkel</i> / bedrijf <b>OP een</b> <i> kantoor</i> / boerderij <b>BĲ de</b> <i> + persoon </i>/ bank <b>BĲ</b> <i>+ naam bedrijf</i>.',
				ru: 'Мой брат работает <b>В</b> + магазине / компании <b>НА</b> + офисе / ферме <b>У</b> + человека / банке <b>В</b> + название компании.',
				uk: 'Мій брат працює <b>У</b> + магазині / компанії <b>НА</b> + офісі / фермі <b>В</b> + людини / банку <b>У</b> + назва компанії.',
				fr: "Mon frère travaille <b>DANS</b> + un magasin / une entreprise <b>DANS UN</b> + bureau / une ferme <b>CHEZ</b> + une personne / une banque <b>CHEZ</b> + le nom de l'entreprise.",
				en: 'My brother works <b>IN</b> + a shop / company <b>AT</b> + an office / a farm <b>WITH</b> + a person / a bank <b>AT</b> + the name of the company.',
				de: 'Mein Bruder arbeitet <b>IN</b> + einem Laden / Unternehmen <b>AUF</b> + einem Büro / einer Farm <b>BEI</b> + einer Person / einer Bank <b>BEI</b> + dem Namen des Unternehmens.'
			}
		},
		{
			num: '14',
			question: {
				nl: 'Wat kan hij goed?',
				ru: 'Что он умеет делать?',
				uk: 'Що він вміє робити?',
				fr: "Qu'est-ce qu'il sait bien faire?",
				en: 'What is he good at?',
				de: 'Was kann er gut?'
			},
			answer: {
				nl: 'Hij kan goed … -en',
				ru: 'Он умеет хорошо … -ть',
				uk: 'Він вміє добре … -ти',
				fr: 'Il sait bien faire … -er',
				en: 'He is good at … -ing',
				de: 'Er kann gut … -en'
			}
		},
		{
			num: '15',
			question: {
				nl: 'Is hij getrouwd?',
				ru: 'Он женат?',
				uk: 'Він одружений?',
				fr: 'Est-il marié?',
				en: 'Is he married?',
				de: 'Ist er verheiratet?'
			},
			answer: {
				nl: 'Ja, hij is getrouwd met … .',
				ru: 'Да, он женат на … .',
				uk: 'Так, він одружений на … .',
				fr: 'Oui, il est marié avec … .',
				en: 'Yes, he is married to … .',
				de: 'Ja, er ist verheiratet mit … .'
			}
		},
		{
			num: '16',
			question: {
				nl: 'Hoe heet jouw zus?',
				ru: 'Как зовут твою сестру?',
				uk: 'Як звуть твою сестру?',
				fr: "Comment s'appelle ta sœur?",
				en: "What is your sister's name?",
				de: 'Wie heißt deine Schwester?'
			},
			answer: {
				nl: 'Mijn zus heet … .',
				ru: 'Мою сестру зовут … .',
				uk: 'Мою сестру звуть … .',
				fr: "Ma sœur s'appelle … .",
				en: "My sister's name is … .",
				de: 'Meine Schwester heißt … .'
			}
		},
		{
			num: '17',
			question: {
				nl: 'Hoe oud is zij?',
				ru: 'Сколько лет твоей сестре?',
				uk: 'Скільки років твоїй сестрі?',
				fr: 'Quel âge a ta sœur?',
				en: 'How old is your sister?',
				de: 'Wie alt ist deine Schwester?'
			},
			answer: {
				nl: 'Zij is … jaar (oud).',
				ru: 'Ей … лет.',
				uk: 'Їй … років.',
				fr: 'Elle a … ans.',
				en: 'She is … years old.',
				de: 'Sie ist … Jahre alt.'
			}
		},
		{
			num: '18',
			question: {
				nl: 'Welk beroep heeft jouw zus?',
				ru: 'Какая у твоей сестры профессия?',
				uk: 'Яка у твоєї сестри професія?',
				fr: 'Quel est le métier de ta sœur?',
				en: "What is your sister's profession?",
				de: 'Was ist der Beruf deiner Schwester?'
			},
			answer: {
				nl: 'Mijn zus werkt als … .',
				ru: 'Моя сестра работает … .',
				uk: 'Моя сестра працює … .',
				fr: 'Ma sœur travaille comme … .',
				en: 'My sister works as … .',
				de: 'Meine Schwester arbeitet als … .'
			}
		},
		{
			num: '19',
			question: {
				nl: 'Wat kan zij niet zo goed?',
				ru: 'Чего она не может хорошо делать?',
				uk: 'Що вона не вміє робити добре?',
				fr: "Qu'est-ce qu'elle ne sait pas bien faire?",
				en: 'What is she not good at?',
				de: 'Was kann sie nicht so gut?'
			},
			answer: {
				nl: 'Zij kan niet zo goed … -en.',
				ru: 'Она не может хорошо … -ть.',
				uk: 'Вона не вміє добре … -ти.',
				fr: 'Elle ne sait pas bien … -er.',
				en: 'She is not good at … -ing.',
				de: 'Sie kann nicht gut … -en.'
			}
		}
	]
};
