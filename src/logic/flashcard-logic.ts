import {Flashcard} from "../flashcard";

export function parseFlashCardCode(content: string): Partial<Flashcard> {
	const lines = content.split('\n');
	const data: any = {};

	lines.forEach(line => {
		const [key, ...value] = line.split(':');
		if (key && value) {
			data[key.trim()] = value.join(':').trim();
		}
	});
	return data;
}
