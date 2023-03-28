export default (actionData) => {
	let sequence = [];

	if (actionData.stat) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['chat', { text: actionData.stat }]);
	}

	if (actionData.mode && (actionData.mode !== "increment" && actionData.mode !== "inc")) {
		sequence.push(['click', { slot: 11 }]);
		if (actionData.mode === 'decrement' || actionData.mode === 'dec' || actionData.mode === '-=') {
			sequence.push(['click', { slot: 11 }]);
		}
		if (actionData.mode === 'set' || actionData.mode === "=") {
			sequence.push(['click', { slot: 12 }]);
		}
		if (actionData.mode === 'multiply' || actionData.mode === 'mult' || actionData.mode === '*=') {
			sequence.push(['click', { slot: 13}]);
		}
		if (actionData.mode === 'divide' || actionData.mode === 'div' || actionData.mode === '//=' || actionData.mode === '/=') {
			sequence.push(['click', { slot: 14}]);
		}
	}

	if (actionData.value !== '1') {
		sequence.push(['click', { slot: 12 }]);
		sequence.push(['anvil', { text: actionData.value }]);
	}

	return ['Change Player Stat', sequence];
}