export default (actionData) => {
	let sequence = [];

	if (actionData.item) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['item', { item: actionData.item }]); // slot 36 is the first slot in the hotbar
	}

	if (actionData.allowMultiple) sequence.push(['click', { slot: 11 }]);

	if (actionData.slot) {
		if (actionData.slot !== "First Slot") {
			sequence.push(['click', { slot: 12 }]);
			sequence.push(['option', { option: actionData.slot }]);
		}
	}

	if (actionData.replace) {
		sequence.push(['click', { slot: 13 }]);
	}

	return ['Give Item', sequence];
}