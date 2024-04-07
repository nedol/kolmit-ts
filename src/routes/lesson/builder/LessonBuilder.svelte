<script>
	let levels = [];
	let currentLevel = {
		level: '',
		themes: []
	};

	let currentTheme = {
		num: '',
		name: '',
		lessons: []
	};

	let currentLesson = {
		num: '',
		title: ''
	};

	function addLevel() {
		levels.push({ ...currentLevel });
		currentLevel = {
			level: '',
			themes: []
		};
	}

	function addTheme() {
		currentLevel.themes.push({ ...currentTheme });
		currentTheme = {
			num: '',
			name: '',
			lessons: []
		};
	}

	function addLesson() {
		currentTheme.lessons.push({ ...currentLesson });
		currentLesson = {
			num: '',
			title: ''
		};
	}

	function saveToFile() {
		const data = JSON.stringify(levels, null, 2);

		const blob = new Blob([data], { type: 'application/json' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'lesson_data.json';
		a.click();
	}
</script>

<form>
	<div>
		<label for="level">Level:</label>
		<input type="text" id="level" bind:value={currentLevel.level} />
	</div>
	<div>
		<button on:click={addLevel}>Add Level</button>
	</div>

	<div>
		<label for="themeNum">Theme Number:</label>
		<input type="text" id="themeNum" bind:value={currentTheme.num} />
	</div>
	<div>
		<label for="themeName">Theme Name:</label>
		<input type="text" id="themeName" bind:value={currentTheme.name} />
	</div>
	<div>
		<button on:click={addTheme}>Add Theme</button>
	</div>

	<div>
		<label for="lessonNum">Lesson Number:</label>
		<input type="text" id="lessonNum" bind:value={currentLesson.num} />
	</div>
	<div>
		<label for="lessonTitle">Lesson Title:</label>
		<input type="text" id="lessonTitle" bind:value={currentLesson.title} />
	</div>
	<div>
		<button on:click={addLesson}>Add Lesson</button>
	</div>

	<button on:click={saveToFile}>Save to File</button>
</form>
