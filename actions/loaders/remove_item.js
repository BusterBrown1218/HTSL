export default (actionData) => {
	let sequence = [];

	if (actionData.item) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['item', { item: actionData.item }]); // slot 36 is the first slot in the hotbar
	}

	return ['Remove Item', sequence];
}