<script>
	import "../app.scss";

  

    import './styles.css';
    import './smui.css';
    import './smui.1.css';
    // import './smui.2.css';
</script>

<div class="app">
	

	<main>
		<slot></slot>
	</main>

	<!-- 
	<footer>
		<p>
			visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
		</p>
	</footer> -->
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		/* max-width: 64rem; */
		/* margin: 0 auto; */
		box-sizing: border-box;
		/* margin-top: 40px; */
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	/* footer a {
		font-weight: bold;
	} */

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
