import {App, Editor, MarkdownView, Modal, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab} from "./settings";
import {Flashcard, FlashCardTypes} from "./flashcard";
import FlashcardBlock from "./ui/FlashcardBlock.svelte";
import {parseFlashCardCode} from "./logic/flashcard-logic";
import { mount } from "svelte";
// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('dice', 'Sample', async (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			const cards = await this.indexFlashCards();
			new Notice('HELLLOOO!');
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status bar text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-modal-simple',
			name: 'Open modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'replace-selected',
			name: 'Replace selected content',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection('Sample editor command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-modal-complex',
			name: 'Open modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
				return false;
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// Add a rendering function for the single flashcard
		this.registerMarkdownCodeBlockProcessor("flashcard", (source, el, ctx) => {
			const data = parseFlashCardCode(source);

			mount(FlashcardBlock, {
				target: el,
				props: {
					question: data.question || "No question provided",
					correctAnswer: data.correct_answer || "No correct answer provided",
					topics: Array.isArray(data.topics) ? data.topics : [],
					possibleAnswers: Array.isArray(data.options) ? data.options : [],
					references: Array.isArray(data.references) ? data.references : [],
					cardType: data.type === "mcq" ? "mcq" : "open",
					created_at: data.created_at || new Date().toISOString(),
					onLinkClick: (link: string) => {
						// Remove [[ and ]] if present
						const cleanLink = link.replace(/[\[\]]/g, "");
						this.app.workspace.openLinkText(cleanLink, ctx.sourcePath, true);
					}
					//app: this.app
				}
			});
		});

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	new Notice("Click");
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async indexFlashCards(): Promise<Flashcard[]> {
		const files = this.app.vault.getMarkdownFiles();
		const flashCards: Flashcard[] = [];

		files.forEach((file) => {
			const cache = this.app.metadataCache.getFileCache(file);
			const frontmatter = cache?.frontmatter;

			if (frontmatter?.type === "flashcard") {
				flashCards.push({
					path: file.path,
					question: frontmatter.question || "Untitled Question",
					type: frontmatter.card_type === "mcq" ? FlashCardTypes.MULTIPLE_CHOICE : FlashCardTypes.OPEN_ENDED,
					topics: frontmatter.topics || [],
					options: frontmatter.options || [],
					correct_answer: frontmatter.correct_answer || ""
				});
			}
		});

		console.log(`Found ${flashCards.length} flashcards!`, flashCards);
		return flashCards;
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

}
