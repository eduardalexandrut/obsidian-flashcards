export enum FlashCardTypes {
	MULTIPLE_CHOICE = "mcq",
	OPEN_ENDED = "oeq"
}

export interface Flashcard {
	path: string,
	type: FlashCardTypes,
	question: string,
	options?: string[],
	correct_answer: string,
	created_at?: string,
	topics: string[],
	references?: string[]
}
