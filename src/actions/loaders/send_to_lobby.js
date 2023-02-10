export default (actionData) => {
	let sequence = [];

	if (actionData.lobby) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['option', { option: actionData.lobby }]);
	}

	return ['Send to Lobby', sequence];
}