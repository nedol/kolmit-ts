export let dialog_data = {
	title: 'Bij de dokter',
	content: [
		{
			num: '1',
			question: {
				nl: 'Waarom ben je hier vandaag?',
				ru: 'Почему ты здесь сегодня?',
				uk: 'Чому ти тут сьогодні?',
				fr: "Pourquoi es-tu ici aujourd'hui?",
				en: 'Why are you here today?',
				de: 'Warum bist du heute hier?'
			},
			answer: {
				nl: 'Ik ben misselijk en heb koorts.',
				ru: 'Мне не по себе, и у меня температура.',
				uk: 'Мені не по собі, і у мене температура.',
				fr: "Je ne me sens pas bien et j'ai de la fièvre.",
				en: 'I feel unwell and have a fever.',
				de: 'Mir geht es nicht gut, und ich habe Fieber.'
			}
		},
		{
			num: '2',
			question: {
				nl: 'Wat scheelt er?',
				ru: 'Что случилось?',
				uk: 'Що сталося?',
				fr: "Qu'est-ce qui s'est passé?",
				en: "What's wrong?",
				de: 'Was ist passiert?'
			},
			answer: {
				nl: 'Ik heb mijn hand verbrand.',
				ru: 'Я обжег руку.',
				uk: 'Я обпік руку.',
				fr: 'Je me suis brûlé la main.',
				en: 'I burned my hand.',
				de: 'Ich habe meine Hand verbrannt.'
			}
		},
		{
			num: '3',
			question: {
				nl: 'Heb je andere symptomen?',
				ru: 'Есть ли у тебя другие симптомы?',
				uk: 'Чи маєш ти інші симптоми?',
				fr: "As-tu d'autres symptômes?",
				en: 'Do you have any other symptoms?',
				de: 'Hast du andere Symptome?'
			},
			answer: {
				nl: 'Ja, ik ben ook duizelig en heb hoofdpijn.',
				ru: 'Да, у меня также кружится голова и болит голова.',
				uk: 'Так, у мене також кружляє голова і болить голова.',
				fr: "Oui, j'ai aussi des vertiges et mal à la tête.",
				en: "Yes, I'm also dizzy and have a headache.",
				de: 'Ja, mir ist auch schwindelig und ich habe Kopfschmerzen.'
			}
		},
		{
			num: '4',
			question: {
				nl: 'Heb je recent iets gegeten of gedronken dat je niet gewend bent?',
				ru: 'Вы недавно ели или пили что-то непривычное для вас',
				uk: 'Чи нещодавно ви їли або пили щось незвичне для вас?',
				fr: "Avez-vous récemment mangé ou bu quelque chose que vous n'avez pas l'habitude?",
				en: "Have you recently eaten or drank something you're not used to?",
				de: 'Hast du in letzter Zeit etwas gegessen oder getrunken, woran du nicht gewöhnt bist?'
			},
			answer: {
				nl: 'Nee, ik heb niets ongebruikelijks gegeten of gedronken.',
				ru: 'Нет, я не ел и не пил ничего необычного.',
				uk: 'Ні, я не їв і не пив нічого незвичайного.',
				fr: "Non, je n'ai rien mangé ou bu d'inhabituel.",
				en: "No, I haven't eaten or drank anything unusual.",
				de: 'Nein, ich habe nichts Ungewöhnliches gegessen oder getrunken.'
			}
		},
		{
			num: '5',
			question: {
				nl: 'Heb je recent gereisd of ben je in contact geweest met iemand die ziek is?',
				ru: 'Ты недавно путешествовал или был в контакте с кем-то больным?',
				uk: 'Ти нещодавно подорожував або був у контакті з кимось хворим?',
				fr: "Avez-vous récemment voyagé ou été en contact avec quelqu'un de malade?",
				en: 'Have you recently traveled or been in contact with someone who is sick?',
				de: 'Hast du in letzter Zeit gereist oder Kontakt zu jemandem gehabt, der krank ist?'
			},
			answer: {
				nl: 'Nee, ik ben niet gereisd en heb geen contact gehad met zieke mensen.',
				ru: 'Нет, я не путешествовал и не контактировал с больными.',
				uk: 'Ні, я не подорожував і не контактував з хворими.',
				fr: "Non, je n'ai pas voyagé et je n'ai eu aucun contact avec des personnes malades.",
				en: "No, I haven't traveled and haven't had contact with sick people.",
				de: 'Nein, ich bin nicht gereist und hatte keinen Kontakt zu kranken Menschen.'
			}
		},
		{
			num: '6',
			question: {
				nl: 'Heb je momenteel medicijnen gebruikt?',
				ru: 'Ты в настоящее время принимаешь какие-то лекарства?',
				uk: 'Ти в даний час приймаєш які-небудь ліки?',
				fr: 'Prenez-vous actuellement des médicaments?',
				en: 'Are you currently taking any medications?',
				de: 'Nimmst du derzeit Medikamente?'
			},
			answer: {
				nl: 'Nee, ik gebruik op dit moment geen medicijnen.',
				ru: 'Нет, в настоящее время я не принимаю никаких лекарств.',
				uk: 'Ні, в даний час я не приймаю жодних ліків.',
				fr: 'Non, je ne prends actuellement aucun médicament.',
				en: "No, I'm not currently taking any medications.",
				de: 'Nein, ich nehme derzeit keine Medikamente ein.'
			}
		},
		{
			num: '7',
			question: {
				nl: 'Heb je recentelijk een allergische reactie gehad?',
				ru: 'Ты недавно испытывал аллергическую реакцию?',
				uk: 'Ти нещодавно відчував алергічну реакцію?',
				fr: 'Avez-vous récemment eu une réaction allergique?',
				en: 'Have you recently had an allergic reaction?',
				de: 'Hatten Sie in letzter Zeit eine allergische Reaktion?'
			},
			answer: {
				nl: 'Nee, ik heb geen recente allergische reactie gehad.',
				ru: 'Нет, у меня не было недавних аллергических реакций.',
				uk: 'Ні, у мене не було нещодавніх алергічних реакцій.',
				fr: "Non, je n'ai pas eu de réaction allergique récente.",
				en: "No, I haven't had any recent allergic reactions.",
				de: 'Nein, ich hatte keine kürzlichen allergischen Reaktionen.'
			}
		},
		{
			num: '8',
			question: {
				nl: 'Heb je eerder soortgelijke symptomen ervaren?',
				ru: 'Ты раньше испытывал похожие симптомы?',
				uk: 'Ти раніше відчував подібні симптоми?',
				fr: 'Avez-vous déjà éprouvé des symptômes similaires?',
				en: 'Have you experienced similar symptoms before?',
				de: 'Hast du schon einmal ähnliche Symptome erlebt?'
			},
			answer: {
				nl: 'Nee, dit is de eerste keer dat ik deze symptomen heb.',
				ru: 'Нет, это первый раз, когда у меня такие симптомы.',
				uk: 'Ні, це перший раз, коли у мене такі симптоми.',
				fr: "Non, c'est la première fois que j'ai ces symptômes.",
				en: 'No, this is the first time I have these symptoms.',
				de: 'Nein, das ist das erste Mal, dass ich diese Symptome habe.'
			}
		},
		{
			num: '9',
			question: {
				nl: 'Heb je onlangs de griepprik gehad?',
				ru: 'Ты недавно делал прививку от гриппа?',
				uk: 'Ти нещодавно робив щеплення від грипу?',
				fr: 'Avez-vous récemment reçu le vaccin contre la grippe?',
				en: 'Have you recently had the flu shot?',
				de: 'Hast du kürzlich die Grippeimpfung erhalten?'
			},
			answer: {
				nl: 'Nee, ik heb dit jaar geen griepprik gehad.',
				ru: 'Нет, в этом году я не делал прививку от гриппа.',
				uk: 'Ні, цього року я не робив щеплення від грипу.',
				fr: "Non, je n'ai pas reçu le vaccin contre la grippe cette année.",
				en: "No, I haven't had the flu shot this year.",
				de: 'Nein, ich habe in diesem Jahr keine Grippeimpfung erhalten.'
			}
		}
	]
};
