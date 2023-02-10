export default (actionData) => {
	let sequence = [];

	if (actionData.stat) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['chat', { text: actionData.stat }]);
	}

	if (actionData.mode && (actionData.mode !== "increment" || actionData.mode !== "inc")) {
		sequence.push(['click', { slot: 11 }]);
		if (actionData.mode === 'decrement' || actionData.mode === 'dec') {
			sequence.push(['click', { slot: 11 }]);
		}
		if (actionData.mode === 'set') {
			sequence.push(['click', { slot: 12 }]);
		}
	}

	if (actionData.value !== '1') {
		sequence.push(['click', { slot: 12 }]);
		sequence.push(['anvil', { text: actionData.value }]);
	}

	return ['Change Global Stat', sequence];
}
