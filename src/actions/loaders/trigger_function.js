export default (actionData) => {
	let sequence = [];
	
	if (actionData.function) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['option', { option: actionData.function }]);
	}

	if (actionData.triggerForAllPlayers) sequence.push(['click', { slot: 11 }]);

	return ['Trigger Function', sequence];
}