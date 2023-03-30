export default (actionData) => {
	let sequence = [];

	if (actionData.stat) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['chat', { text: actionData.stat }]);
	}

	if (actionData.mode && actionData.mode !== "increment") {
		sequence.push(['click', { slot: 11 }]);
		if (actionData.mode === 'decrement') {
			sequence.push(['click', { slot: 11 }]);
		}
		if (actionData.mode === 'set') {
			sequence.push(['click', { slot: 12 }]);
		}
		if (actionData.mode === 'multiply') {
			sequence.push(['click', { slot: 13}]);
		}
		if (actionData.mode === 'divide') {
			sequence.push(['click', { slot: 14}]);
		}
	}

	if (actionData.value !== '1') {
		sequence.push(['click', { slot: 12 }]);
		sequence.push(['anvil', { text: actionData.value }]);
	}

	return ['Change Global Stat', sequence];
}
