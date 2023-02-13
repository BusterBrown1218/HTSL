export default (actionData) => {
	let sequence = [];

	if (!isNaN(actionData.level)) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['anvil', { text: actionData.level }]);
	}

	return ['Set Hunger Level', sequence];
}