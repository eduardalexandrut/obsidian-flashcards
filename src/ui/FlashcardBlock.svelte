<script lang="ts">
	import { format } from 'date-fns';

	let {
		question = "No Question Provided",
		topics = [],
		possibleAnswers = [],
		correctAnswer = "",
		created_at = "",
		references = [],
		cardType = "open",
		onLinkClick
	} = $props<{
		question: string;
		topics: string[];
		possibleAnswers: string[];
		correctAnswer: string;
		created_at?: string; // Optional
		references: string[];
		cardType?: "mcq" | "open";
		onLinkClick?: (link: string) => void;
	}>();

	// 2. Component State
	let revealed = $state(false);
	let selectedAnswer = $state<string | null>(null); // For MCQ

	// 3. Helper to format date if it exists
	const formattedDate = created_at ? format(new Date(created_at), 'yyyy-MM-dd HH:mm') : null;

	// 4. MCQ Helper: A=0, B=1...
	const getLetter = (index: number) => String.fromCharCode(65 + index);

	// 5. Interaction Functions
	function toggleReveal() { revealed = !revealed; }
	function selectChoice(choice: string) { selectedAnswer = choice; }

</script>

<div class="flashcard-container">

	<div class="card-meta">
		<div class="tag-list">
			{#each topics as topic}
				<span class="tag"># {topic}</span>
			{/each}
		</div>
		{#if formattedDate}
			<span class="date-time">🕒 {formattedDate}</span>
		{/if}
	</div>

	<div class="question-section">
		<h2 class="question-text">{question}</h2>
	</div>

	<div class="answers-section">

		{#if cardType === "mcq"}
			<div class="mcq-options">
				{#each possibleAnswers as choice, i}
					<button
						class="choice-button"
						class:selected={selectedAnswer === choice}
						on:click={() => selectChoice(choice)}>
						<span class="choice-letter">{getLetter(i)}.</span>
						<span class="choice-text">{choice}</span>
					</button>
				{/each}
			</div>

		{:else}
			<div class="open-ended-possible">
				{#if possibleAnswers.length > 0}
					<p class="section-label">💡 Key Concepts / Possible Solutions:</p>
					<ul class="italic-solutions">
						{#each possibleAnswers as solution}
							<li>{solution}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>

	<div class="interaction-bar">
		{#if revealed}
			<div class="correct-answer-display">
				<p>✅ Correct Answer: <strong>{correctAnswer}</strong></p>
			</div>
		{/if}
		<button class="reveal-button" on:click={toggleReveal}>
			{revealed ? "🙈 Hide Answer" : "👀 Reveal Answer"}
		</button>
	</div>

	{#if references.length > 0}
		<div class="references-section">
			<p class="references-label">🔗 References</p>
			<div class="references-links">
				{#each references as link}
					<button class="obsidian-link" on:click={() => onLinkClick(link)}>
						{link}
					</button>
				{/each}
			</div>
		</div>
	{/if}

</div>

<style>
	/* COMPONENT CONTAINER */
	.flashcard-container {
		border: 1px solid var(--background-modifier-border);
		background-color: var(--background-secondary);
		border-radius: 12px;
		padding: 2rem;
		margin: 1.5rem 0;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* 1. TOP METADATA */
	.card-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--background-modifier-border);
		padding-bottom: 0.75rem;
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.tag-list {
		display: flex;
		gap: 0.5rem;
	}
	.tag {
		background: var(--background-modifier-border);
		color: var(--text-normal);
		padding: 3px 8px;
		border-radius: 15px;
	}

	/* 2. CENTERED QUESTION */
	.question-section {
		text-align: center;
		padding: 1rem 0;
	}
	.question-text {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0;
		color: var(--text-normal);
		line-height: 1.2;
	}

	/* 3. DYNAMIC ANSWERS */
	.mcq-options {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}
	.choice-button {
		display: flex;
		align-items: center;
		text-align: left;
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		color: var(--text-normal);
		padding: 1rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.choice-button:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
	}
	.choice-button.selected {
		background: var(--background-modifier-success); /* Use a slight success tone */
		border-color: var(--interactive-accent);
		box-shadow: 0 0 8px var(--interactive-accent);
	}
	.choice-letter {
		font-weight: 800;
		color: var(--interactive-accent);
		margin-right: 1rem;
		font-size: 1.1rem;
	}

	.italic-solutions {
		font-style: italic;
		color: var(--text-muted);
		list-style-type: circle;
		margin-left: 1.5rem;
	}
	.section-label, .references-label {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-muted);
		margin-bottom: 0.5rem;
	}

	/* 4. REVEAL */
	.interaction-bar {
		text-align: center;
		border-top: 1px solid var(--background-modifier-border);
		padding-top: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.reveal-button {
		background-color: var(--interactive-accent);
		color: var(--text-on-accent);
		padding: 10px 20px;
		font-weight: 600;
	}
	.correct-answer-display {
		font-size: 1.1rem;
		background: var(--background-modifier-success);
		padding: 1rem;
		border-radius: 8px;
	}

	/* 5. BOTTOM REFERENCES */
	.references-section {
		border-top: 1px solid var(--background-modifier-border);
		padding-top: 1rem;
		font-size: 0.9rem;
	}
	.references-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.obsidian-link {
		color: var(--link-color);
		background: var(--background-modifier-border);
		padding: 2px 8px;
		border-radius: 4px;
		text-decoration: underline; /* Simulate Obsidian Link */
	}
</style>
