export let dialog_data = {
	title: 'Mijn Vakantie',
	html: [
		
		<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			body {
			font-family: Arial, sans-serif;
			}

			table {
			width: 100%;
			margin: 20px auto;
			border-collapse: collapse;
			border: 1px solid #ddd;
			font-size: 12px;
			}

			th, td {
			padding: 12px;
			text-align: left;
			border-bottom: 1px solid #ddd;
			}

			th {
			background-color: #f2f2f2;
			}

			tr:hover {
			background-color: #f5f5f5;
			}
		</style>
		<title>Flight Details</title>
		</head>
		<body>

		<table>
			<tr>
			<td>Naam maatschappij?</td>
			<td>Brussels Airlines</td>
			</tr>
			<tr>
			<td>Prijs vlucht?</td>
			<td>€ 104.98</td>
			</tr>
			<tr>
			<td>Datum heenreis?</td>
			<td>20 augustus</td>
			</tr>
			<tr>
			<td>Vertrekuur heenreis?</td>
			<td>16.25</td>
			</tr>
			<tr>
			<td>Aankomstuur heenreis?</td>
			<td>17.50</td>
			</tr>
			<tr>
			<td>Datum terugreis?</td>
			<td>24 augustus</td>
			</tr>
			<tr>
			<td>Vertrekuur terugreis?</td>
			<td>11.40</td>
			</tr>
			<tr>
			<td>Aankomstuur terugreis?</td>
			<td>13.10</td>
			</tr>
		</table>

		</body>
	`
	],
	content: [
		{
			question: {
				nl: 'Met welke maatschappij vlieg je?',
				ru: 'С какой авиакомпанией ты летишь?',
				uk: 'З якою авіакомпанією ти летиш?',
				fr: 'Avec quelle compagnie aérienne voyages-tu?',
				en: 'Which airline are you flying with?',
				de: 'Mit welcher Fluggesellschaft fliegst du?'
			},
			answer: {
				nl: 'Ik vlieg met...',
				ru: 'Я лечу с...',
				uk: 'Я лечу з...',
				fr: 'Je vole avec...',
				en: 'I am flying with...',
				de: 'Ich fliege mit...'
			}
		},
		{
			question: {
				nl: 'Hoeveel kost de vlucht?',
				ru: 'Сколько стоит билет на самолет?',
				uk: 'Скільки коштує авіаквиток?',
				fr: 'Combien coûte le vol?',
				en: 'How much does the flight cost?',
				de: 'Wie viel kostet der Flug?'
			},
			answer: {
				nl: 'De vlucht kost...',
				ru: 'Билет на самолет стоит...',
				uk: 'Квиток на літак коштує...',
				fr: 'Le vol coûte...',
				en: 'The flight costs...',
				de: 'Der Flug kostet...'
			}
		},
		{
			question: {
				nl: 'Wanneer vertrek je?',
				ru: 'Когда ты вылетаешь?',
				uk: 'Коли ти вилітаєш?',
				fr: 'Quand est-ce que tu pars?',
				en: 'When are you leaving?',
				de: 'Wann fliegst du ab?'
			},
			answer: {
				nl: 'Ik vertrek op...',
				ru: 'Я вылетаю ...',
				uk: 'Я вилітаю ...',
				fr: 'Je pars le...',
				en: 'I am leaving on...',
				de: 'Ich fliege ab am...'
			}
		},
		{
			question: {
				nl: 'Hoe laat vertrek je?',
				ru: 'Во сколько ты вылетаешь?',
				uk: 'О котрій годині ти вилітаєш?',
				fr: 'À quelle heure pars-tu?',
				en: 'At what time are you leaving?',
				de: 'Um wie viel Uhr fliegst du ab?'
			},
			answer: {
				nl: 'Ik vertrek om...',
				ru: 'Я вылетаю в...',
				uk: 'Я вилітаю о...',
				fr: 'Je pars à...',
				en: 'I am leaving at...',
				de: 'Ich fliege ab um...'
			}
		},
		{
			question: {
				nl: 'Hoe laat kom je aan?',
				ru: 'Во сколько ты прилетаешь?',
				uk: 'О котрій годині ти прилітаєш?',
				fr: 'À quelle heure arrives-tu?',
				en: 'At what time do you arrive?',
				de: 'Um wie viel Uhr kommst du an?'
			},
			answer: {
				nl: 'Ik kom om... aan.',
				ru: 'Я прилетаю в...',
				uk: 'Я прилітаю в...',
				fr: "J'arrive à...",
				en: 'I arrive at...',
				de: 'Ich komme um... an.'
			}
		},
		{
			question: {
				nl: 'Wanneer kom je terug naar huis?',
				ru: 'Когда ты вернешься домой?',
				uk: 'Коли ти повертаєшся додому?',
				fr: 'Quand reviens-tu à la maison?',
				en: 'When are you coming back home?',
				de: 'Wann kommst du nach Hause zurück?'
			},
			answer: {
				nl: 'Ik kom op... terug naar huis.',
				ru: 'Я возвращаюсь домой ...',
				uk: 'Я повертаюся додому ...',
				fr: 'Je reviens à la maison le...',
				en: 'I am coming back home on...',
				de: 'Ich komme am... nach Hause zurück.'
			}
		},
		{
			question: {
				nl: 'Hoe laat vertrek je?',
				ru: 'Во сколько ты вылетаешь?',
				uk: 'О котрій годині ти вилітаєш?',
				fr: 'À quelle heure pars-tu?',
				en: 'At what time are you leaving?',
				de: 'Um wie viel Uhr fliegst du ab?'
			},
			answer: {
				nl: 'Ik vertrek om...',
				ru: 'Я вылетаю в...',
				uk: 'Я вилітаю о...',
				fr: 'Je pars à...',
				en: 'I am leaving at...',
				de: 'Ich fliege ab um...'
			}
		},
		{
			question: {
				nl: 'Hoe laat kom je aan?',
				ru: 'Во сколько ты прилетаешь?',
				uk: 'О котрій годині ти прилітаєш?',
				fr: 'À quelle heure arrives-tu?',
				en: 'At what time do you arrive?',
				de: 'Um wie viel Uhr kommst du an?'
			},
			answer: {
				nl: 'Ik kom om... aan.',
				ru: 'Я прилетаю в...',
				uk: 'Я прилітаю в...',
				fr: "J'arrive à...",
				en: 'I arrive at...',
				de: 'Ich komme um... an.'
			}
		},
		{
			question: {
				nl: 'Waar ga je logeren?',
				ru: 'Где ты будешь останавливаться?',
				uk: 'Де ти будеш зупинятися?',
				fr: 'Où vas-tu loger?',
				en: 'Where are you going to stay?',
				de: 'Wo wirst du übernachten?'
			},
			answer: {
				nl: 'Ik ga in/op een... logeren.',
				ru: 'Я буду останавливаться в...',
				uk: 'Я буду зупинятися в...',
				fr: 'Je vais loger dans...',
				en: 'I am staying in a...',
				de: 'Ich werde in einem... übernachten.'
			}
		},
		{
			question: {
				nl: 'Waar ga je logeren?',
				ru: 'Где ты будешь останавливаться?',
				uk: 'Де ти будеш зупинятися?',
				fr: 'Où vas-tu loger?',
				en: 'Where will you stay?',
				de: 'Wo wirst du übernachten?'
			},
			answer: {
				nl: 'Ik ga logeren in...',
				ru: 'Я буду останавливаться в...',
				uk: 'Я буду зупинятися в...',
				fr: 'Je vais loger à...',
				en: 'I will stay in...',
				de: 'Ich werde in...'
			}
		},
		{
			question: {
				nl: 'Wat is de naam van het hotel/appartement/...?',
				ru: 'Как называется отель/аппартаменты/...?',
				uk: 'Як називається готель/апартаменти/...?',
				fr: "Quel est le nom de l'hôtel/appartement/...?",
				en: 'What is the name of the hotel/apartment/...?',
				de: 'Wie heißt das Hotel/Appartement/...?'
			},
			answer: {
				nl: 'De naam van het hotel/appartement is...',
				ru: 'Название отеля/аппартаментов - ...',
				uk: 'Назва готелю/апартаментів - ...',
				fr: "Le nom de l'hôtel/appartement est...",
				en: 'The name of the hotel/apartment is...',
				de: 'Der Name des Hotels/Appartements ist...'
			}
		},
		{
			question: {
				nl: 'Hoeveel kost het verblijf?',
				ru: 'Сколько стоит проживание?',
				uk: 'Скільки коштує проживання?',
				fr: 'Combien coûte le séjour?',
				en: 'How much does the stay cost?',
				de: 'Wie viel kostet der Aufenthalt?'
			},
			answer: {
				nl: 'Het verblijf kost...',
				ru: 'Проживание стоит...',
				uk: 'Проживання коштує...',
				fr: 'Le séjour coûte...',
				en: 'The stay costs...',
				de: 'Der Aufenthalt kostet...'
			}
		},
		{
			question: {
				nl: 'Is het ontbijt inbegrepen?',
				ru: 'Включен ли завтрак?',
				uk: 'Чи включений сніданок?',
				fr: 'Le petit-déjeuner est-il inclus?',
				en: 'Is breakfast included?',
				de: 'Ist das Frühstück inbegriffen?'
			},
			answer: {
				nl: 'Ja, het ontbijt is inbegrepen.',
				ru: 'Да, завтрак включен.',
				uk: 'Так, сніданок включений.',
				fr: 'Oui, le petit-déjeuner est inclus.',
				en: 'Yes, breakfast is included.',
				de: 'Ja, das Frühstück ist inbegriffen.'
			}
		},
		{
			question: {
				nl: 'Nee, het ontbijt is niet inbegrepen. Er is een...',
				ru: 'Нет, завтрак не включен. Есть...',
				uk: 'Ні, сніданок не включений. Є...',
				fr: "Non, le petit-déjeuner n'est pas inclus. Il y a...",
				en: 'No, breakfast is not included. There is a...',
				de: 'Nein, das Frühstück ist nicht inbegriffen. Es gibt...'
			},
			answer: {
				nl: 'Nee, het ontbijt is niet inbegrepen. Er is een...',
				ru: 'Нет, завтрак не включен. Есть...',
				uk: 'Ні, сніданок не включений. Є...',
				fr: "Non, le petit-déjeuner n'est pas inclus. Il y a...",
				en: 'No, breakfast is not included. There is a...',
				de: 'Nein, das Frühstück ist nicht inbegriffen. Es gibt...'
			}
		},
		{
			question: {
				nl: 'Er zijn...',
				ru: 'Есть...',
				uk: 'Є...',
				fr: 'Il y a...',
				en: 'There are...',
				de: 'Es gibt...'
			},
			answer: {
				nl: 'Er zijn...',
				ru: 'Есть...',
				uk: 'Є...',
				fr: 'Il y a...',
				en: 'There are...',
				de: 'Es gibt...'
			}
		}
	]
};
