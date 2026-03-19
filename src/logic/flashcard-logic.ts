export function parseFlashCardCode(content: string): any {
	const lines = content.split('\n');
	const data: any = {};

	lines.forEach(line => {
		const [key, ...valueParts] = line.split(':');
		if (key && valueParts.length > 0) {
			const rawValue = valueParts.join(':').trim();
			const cleanKey = key.trim();

			// Handle fields that should be Arrays
			if (['topics', 'options', 'references'].includes(cleanKey)) {
				data[cleanKey] = rawValue.split(',').map(item => item.trim()).filter(item => item !== "");
			} else {
				data[cleanKey] = rawValue;
			}
		}
	});
	return data;
}
