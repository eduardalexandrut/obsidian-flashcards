<script lang="ts">
	export let question: string = "";
	export let topics: any = [];
	export let possibleAnswers: string[] = [];
	export let correctAnswer: string = "";
	export let created_at: string = "";
	export let references: string[] = [];

	export let revealed:boolean = false;

	function toggleReveal() {
		revealed = !revealed;
	}

</script>

<div class="flashcard-card">
	<div class="header">
		{#each topics as topic}
			<span class="tag">{topic}</span>
		{/each}
	</div>

	<p class="question">{question}</p>

	{#if revealed}
		<div class="answer-section">
			<p>Answer details revealed!</p>
		</div>
	{/if}

	<button on:click={toggleReveal}>
		{revealed ? "Hide Answer" : "Show Answer"}
	</button>
</div>

<style>
	.flashcard-card {
		border: 1px solid var(--background-modifier-border);
		background: var(--background-primary);
		padding: 1rem;
		border-radius: 8px;
	}
	.tag {
		font-size: 0.7rem;
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		padding: 2px 5px;
		border-radius: 4px;
	}
</style>
