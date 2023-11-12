export default (actionData) => {
	let sequence = [];

    if (!isNaN(actionData.ticks) && actionData.ticks !== 20) {
        sequence.push(['click', { slot: 10 }]);
        sequence.push(['anvil', { text: actionData.ticks}])
    }

	return ['Pause Execution', sequence];
}