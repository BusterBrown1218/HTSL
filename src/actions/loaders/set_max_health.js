export default (actionData) => {
	let sequence = [];

	if (!isNaN(actionData.health) && actionData.health !== 20) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['anvil', { text: actionData.health }]);
	}

	return ['Set Max Health', sequence];
}