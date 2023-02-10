export default (actionData) => {
	let sequence = [];

	if (!isNaN(actionData.levels)) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['anvil', { text: actionData.levels }]);
	}

	return ['Give Experience Levels', sequence];
}