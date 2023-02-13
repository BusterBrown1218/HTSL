export default (actionData) => {
	let sequence = [];

	if (actionData.sound) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['option', { option: actionData.sound }]);
	}

	if (!isNaN(actionData.pitch) && actionData.pitch !== 1) {
		sequence.push(['click', { slot: 11 }]);
		sequence.push(['anvil', { text: actionData.pitch }]);
	}

	return ['Play Sound', sequence]; 
}